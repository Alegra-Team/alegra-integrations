#!/usr/bin/env node
// Revisa que los flujos de n8n sean estructuralmente sanos antes de subirlos.
//
//   node scripts/revisar-flujos.js
//
// Sale con código 1 si algo falla, para poder usarlo en CI.

const fs = require('fs');
const path = require('path');

const raiz = path.join(__dirname, '..', 'automatizaciones', 'n8n');

// Versiones verificadas contra la instancia de n8n. Una versión distinta hace
// que el nodo cargue vacío al importar.
const VERSIONES = {
  'n8n-nodes-base.notion': 2.2,
  'n8n-nodes-base.httpRequest': 4.5,
  'n8n-nodes-base.googleSheets': 4.7,
  'n8n-nodes-base.scheduleTrigger': 1.3,
  'n8n-nodes-base.webhook': 2.1,
  'n8n-nodes-base.code': 2,
  'n8n-nodes-base.gmail': 2.2,
  'n8n-nodes-base.telegram': 1.2,
  'n8n-nodes-base.if': 2.2,
  'n8n-nodes-base.merge': 3.2,
  'n8n-nodes-base.formTrigger': 2.6,
  'n8n-nodes-base.stickyNote': 1,
};

const DISPARADORES = [
  'n8n-nodes-base.scheduleTrigger',
  'n8n-nodes-base.webhook',
  'n8n-nodes-base.formTrigger',
];

const METODOS_QUE_ESCRIBEN = ['POST', 'PUT', 'PATCH', 'DELETE'];

// Escrituras que no tocan la contabilidad y que por lo tanto no van
// desactivadas: si vinieran apagadas el flujo auxiliar no serviría de nada.
const ESCRITURAS_DE_CONFIGURACION = /\/webhooks\/subscriptions/;

const LISTADOS = /api\/v1\/(invoices|bills|estimates|items|contacts|payments)$/;

// Una búsqueda por un identificador puntual devuelve una sola cosa: no pagina.
const FILTROS_PUNTUALES = ['number', 'query', 'identification', 'id'];

let totalFallas = 0;

for (const carpeta of fs.readdirSync(raiz).sort()) {
  const archivo = path.join(raiz, carpeta, 'workflow.json');
  if (!fs.existsSync(archivo)) continue;

  const fallas = [];
  const aviso = (msg) => fallas.push(msg);

  let w;
  try {
    w = JSON.parse(fs.readFileSync(archivo, 'utf8'));
  } catch (e) {
    console.log('FALLA  ' + carpeta + ': JSON inválido: ' + e.message);
    totalFallas++;
    continue;
  }

  const nombres = new Set(w.nodes.map((n) => n.name));

  if (w.nodes.length !== nombres.size) aviso('hay nodos con el nombre repetido');
  if (w.active !== false) aviso('active debería ser false');
  if (!w.settings || w.settings.executionOrder !== 'v1') aviso('falta settings.executionOrder = v1');
  if (!w.nodes.some((n) => DISPARADORES.includes(n.type))) aviso('no tiene disparador');
  if (!fs.existsSync(path.join(raiz, carpeta, 'README.md'))) aviso('le falta el README.md');

  const ids = new Set();
  for (const n of w.nodes) {
    if (VERSIONES[n.type] === undefined) {
      aviso('tipo de nodo no previsto: ' + n.type);
    } else if (n.typeVersion !== VERSIONES[n.type]) {
      aviso(n.name + ' usa ' + n.type + ' v' + n.typeVersion + ' y se espera v' + VERSIONES[n.type]);
    }
    if (ids.has(n.id)) aviso('id de nodo repetido: ' + n.id);
    ids.add(n.id);
    if (!Array.isArray(n.position) || n.position.length !== 2) aviso(n.name + ' no tiene posición');
  }

  // Conexiones: origen y destino tienen que existir.
  const conectados = new Set();
  for (const [origen, salidas] of Object.entries(w.connections || {})) {
    if (!nombres.has(origen)) aviso('conexión desde un nodo que no existe: ' + origen);
    conectados.add(origen);
    for (const rama of salidas.main || []) {
      for (const destino of rama || []) {
        if (!nombres.has(destino.node)) aviso('conexión hacia un nodo que no existe: ' + destino.node);
        conectados.add(destino.node);
      }
    }
  }

  // Nodos sueltos. Las notas no se conectan a nada.
  for (const n of w.nodes) {
    if (n.type === 'n8n-nodes-base.stickyNote') continue;
    if (!conectados.has(n.name)) aviso('nodo suelto, sin conectar: ' + n.name);
  }

  // Los nodos que escriben en Alegra no reintentan (un reintento duplicaría el
  // documento) y vienen desactivados, para que la primera corrida sea en seco.
  for (const n of w.nodes) {
    if (n.type !== 'n8n-nodes-base.httpRequest') continue;
    if (!METODOS_QUE_ESCRIBEN.includes(n.parameters.method)) continue;
    if (n.retryOnFail !== false) aviso(n.name + ' escribe y no tiene retryOnFail: false');
    if (ESCRITURAS_DE_CONFIGURACION.test(String(n.parameters.url || ''))) continue;
    if (!n.disabled) aviso(n.name + ' escribe en Alegra y NO viene desactivado');
  }

  // Todo listado de Alegra tiene que paginar: el limit máximo es 30.
  for (const n of w.nodes) {
    if (n.type !== 'n8n-nodes-base.httpRequest') continue;
    if (n.parameters.method && n.parameters.method !== 'GET') continue;
    const esListado = LISTADOS.test(String(n.parameters.url || ''));
    const pagina = !!(n.parameters.options && n.parameters.options.pagination);
    const puntual = ((n.parameters.queryParameters || {}).parameters || []).some((p) =>
      FILTROS_PUNTUALES.includes(p.name)
    );
    if (esListado && !pagina && !puntual) aviso(n.name + ' consulta un listado y no pagina');
  }

  if (fallas.length) {
    totalFallas += fallas.length;
    console.log('FALLA  ' + carpeta);
    for (const f of fallas) console.log('       ' + f);
  } else {
    console.log('OK     ' + carpeta.padEnd(38) + w.nodes.length + ' nodos');
  }
}

console.log('');
if (totalFallas) {
  console.log(totalFallas + ' problema(s). No subas esto todavía.');
  process.exit(1);
}
console.log('Todos los flujos están sanos.');
