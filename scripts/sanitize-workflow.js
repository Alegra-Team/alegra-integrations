#!/usr/bin/env node
/**
 * Limpia los workflow.json de n8n antes de subirlos al repositorio.
 *
 * Un export de n8n arrastra cosas que no deben quedar en un repositorio público:
 * IDs de credenciales, nombres reales de documentos de Notion y Google, URLs de
 * webhook y datos de ejecuciones reales. Este script los quita.
 *
 * Uso:
 *   node scripts/sanitize-workflow.js                    # limpia todos
 *   node scripts/sanitize-workflow.js ruta/workflow.json # limpia uno
 *   node scripts/sanitize-workflow.js --check            # solo revisa, no escribe
 */

const fs = require('fs');
const path = require('path');

const RAIZ = path.resolve(__dirname, '..');
const BASE_FLUJOS = path.join(RAIZ, 'automatizaciones', 'n8n');

// Claves que se eliminan en cualquier nivel del JSON.
const CLAVES_PROHIBIDAS = [
  'pinData',        // datos reales de ejecuciones anteriores
  'instanceId',     // identifica la instancia de n8n de quien exportó
  'webhookId',      // UUID de la URL de webhook
  'staticData',     // estado guardado entre ejecuciones
  'versionId',      // versión interna del flujo
  'cachedResultName', // nombre real del documento de Notion o Google
  'cachedResultUrl',  // URL real de ese documento
  'shared',
  'triggerCount',
  'createdAt',
  'updatedAt',
];

// Patrones que nunca deben aparecer en un workflow.json.
const PATRONES_SECRETO = [
  { nombre: 'Authorization en base64', re: /Basic\s+[A-Za-z0-9+/]{20,}={0,2}/ },
  { nombre: 'token Bearer', re: /Bearer\s+[A-Za-z0-9._-]{20,}/ },
  { nombre: 'clave de OpenAI', re: /\bsk-[A-Za-z0-9]{20,}/ },
  { nombre: 'token de Slack', re: /\bxox[baprs]-[A-Za-z0-9-]{10,}/ },
  { nombre: 'token de Notion', re: /\b(ntn_|secret_)[A-Za-z0-9]{30,}/ },
  { nombre: 'token de bot de Telegram', re: /\b\d{8,10}:[A-Za-z0-9_-]{35}\b/ },
  { nombre: 'clave privada', re: /-----BEGIN [A-Z ]*PRIVATE KEY-----/ },
  { nombre: 'clave de Google', re: /\bAIza[A-Za-z0-9_-]{35}\b/ },
  { nombre: 'token de GitHub', re: /\bgh[pousr]_[A-Za-z0-9]{30,}/ },
  // "tu-cuenta" y "tu-n8n" son los subdominios de ejemplo que usamos en los
  // marcadores de posición. Cualquier otro es la instancia real de alguien.
  { nombre: 'URL de webhook real', re: /https:\/\/(?!tu-cuenta\.|tu-n8n\.)[a-z0-9-]+\.app\.n8n\.cloud\/webhook/ },
  { nombre: 'ruta local', re: /\/Users\/[a-z]/i },
];

// Correos que sí están permitidos porque son de ejemplo.
const CORREOS_PERMITIDOS = /@(ejemplo\.com|tuempresa\.com|example\.com)$/i;
const RE_CORREO = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;

function limpiar(nodo) {
  if (Array.isArray(nodo)) return nodo.map(limpiar);
  if (nodo === null || typeof nodo !== 'object') return nodo;

  const salida = {};
  for (const [clave, valor] of Object.entries(nodo)) {
    if (CLAVES_PROHIBIDAS.includes(clave)) continue;
    // credentials: { httpBasicAuth: { id, name } } -> nos quedamos solo con name
    if (clave === 'credentials' && valor && typeof valor === 'object') {
      const creds = {};
      for (const [tipo, cred] of Object.entries(valor)) {
        creds[tipo] = { name: cred && cred.name ? cred.name : tipo };
      }
      salida[clave] = creds;
      continue;
    }
    salida[clave] = limpiar(valor);
  }
  return salida;
}

function revisarSecretos(texto, archivo) {
  const hallazgos = [];
  for (const { nombre, re } of PATRONES_SECRETO) {
    const m = texto.match(re);
    if (m) hallazgos.push(`${nombre}: ${m[0].slice(0, 40)}`);
  }
  for (const correo of texto.match(RE_CORREO) || []) {
    if (!CORREOS_PERMITIDOS.test(correo)) {
      hallazgos.push(`correo que no es de ejemplo: ${correo}`);
    }
  }
  return hallazgos;
}

function procesar(archivo, soloRevisar) {
  const crudo = fs.readFileSync(archivo, 'utf8');

  let flujo;
  try {
    flujo = JSON.parse(crudo);
  } catch (e) {
    return { archivo, error: `JSON inválido: ${e.message}` };
  }

  const limpio = limpiar(flujo);
  limpio.active = false;
  if (!limpio.settings) limpio.settings = {};
  if (!limpio.settings.executionOrder) limpio.settings.executionOrder = 'v1';

  const salida = JSON.stringify(limpio, null, 2) + '\n';
  const hallazgos = revisarSecretos(salida, archivo);
  const cambio = salida !== crudo;

  if (cambio && !soloRevisar) fs.writeFileSync(archivo, salida);

  return { archivo, cambio, hallazgos };
}

function buscarFlujos() {
  if (!fs.existsSync(BASE_FLUJOS)) return [];
  return fs
    .readdirSync(BASE_FLUJOS, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => path.join(BASE_FLUJOS, d.name, 'workflow.json'))
    .filter(fs.existsSync);
}

function main() {
  const args = process.argv.slice(2);
  const soloRevisar = args.includes('--check');
  const rutas = args.filter((a) => !a.startsWith('--'));
  const archivos = rutas.length ? rutas.map((r) => path.resolve(r)) : buscarFlujos();

  if (!archivos.length) {
    console.log('No se encontró ningún workflow.json.');
    return;
  }

  let problemas = 0;

  for (const archivo of archivos) {
    const rel = path.relative(RAIZ, archivo);
    const r = procesar(archivo, soloRevisar);

    if (r.error) {
      console.error(`ERROR  ${rel} — ${r.error}`);
      problemas++;
      continue;
    }
    if (r.hallazgos.length) {
      console.error(`SECRETO  ${rel}`);
      r.hallazgos.forEach((h) => console.error(`         ${h}`));
      problemas++;
      continue;
    }
    if (r.cambio) {
      console.log(soloRevisar ? `SUCIO  ${rel}` : `LIMPIADO  ${rel}`);
      if (soloRevisar) problemas++;
    } else {
      console.log(`OK  ${rel}`);
    }
  }

  if (problemas) {
    console.error(`\n${problemas} archivo(s) con problemas. No subas esto todavía.`);
    process.exit(1);
  }
  console.log(`\n${archivos.length} archivo(s) revisados. Todo limpio.`);
}

main();
