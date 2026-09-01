# Estándar de skills

Una skill son instrucciones que tu asistente de IA carga para responder mejor sobre un tema. Este documento define cómo se escriben las de este repositorio, para que todas se sientan igual y funcionen igual de bien.

> ¿Vas a crear una? Parte de [`_plantilla/SKILL.md`](_plantilla/SKILL.md). O pásale este archivo a tu asistente y dile que te ayude.

---

## Estructura de la carpeta

```
skills/<audiencia>/<nombre-de-la-skill>/
├── SKILL.md       # obligatorio — lo que lee la IA
├── README.md      # obligatorio — lo que lee un humano en GitHub
└── references/    # opcional — material de apoyo que la skill consulta
```

`<audiencia>` es `pymes/` o `contadores/`. Si sirve a las dos por igual, va en la raíz de `skills/`.

## Nombre

- En **inglés, kebab-case**, siempre con el prefijo `alegra-`.
- Igual al nombre de la carpeta y al campo `name` del frontmatter.
- Describe lo que hace, no la herramienta que usa.

| Sí | No |
|---|---|
| `alegra-cash-radar` | `alegra-cashflow-report-tool` |
| `alegra-collections-assistant` | `alegra-get-receivables` |

El **título** dentro del `SKILL.md` sí va en español y orientado al beneficio: `# Radar de caja`.

---

## El frontmatter

Va al inicio del `SKILL.md`, entre `---`. Es lo que tu cliente de IA lee para saber **qué es la skill y cuándo activarla**. Sin esto, la skill se instala pero nunca se dispara.

```yaml
---
name: alegra-cash-radar
description: >
  Una a tres frases: qué hace y cuándo usarla, en lenguaje de negocio.
  Trigger phrases: "frase 1", "frase 2", "frase 3", "frase 4", "frase 5".
allowed-tools: mcp__alegra-mcp__reports_get_cash_flow, mcp__alegra-mcp__banks_getBanks
metadata:
  audiencia: pymes
  requiere: MCP de Alegra conectado (solo consulta)
  grupos-mcp: reports, banks
  autor: tu-usuario-de-github
  proposito: Decidir pagos y compras con la caja real a la vista
  fecha: 2026-09-01
  status: beta
---
```

### Campo por campo

| Campo | Obligatorio | Regla |
|---|---|---|
| `name` | Sí | Igual al nombre de la carpeta |
| `description` | Sí | Qué hace, cuándo usarla y **mínimo 5 trigger phrases** en español |
| `allowed-tools` | Sí | Solo las herramientas que la skill usa de verdad. Todas de consulta |
| `metadata.audiencia` | Sí | `pymes`, `contadores` o `ambas` |
| `metadata.requiere` | Sí | Qué necesita la persona para que funcione |
| `metadata.grupos-mcp` | Sí | Los grupos del header `mcp-groups` que hacen falta |
| `metadata.autor` | Sí | Tu usuario de GitHub |
| `metadata.proposito` | Sí | Una frase de negocio: para qué sirve |
| `metadata.fecha` | Sí | `AAAA-MM-DD` |
| `metadata.status` | Sí | `beta` o `estable` |

### Las trigger phrases

Son lo que hace que la skill se dispare en el momento correcto. Escríbelas **como las diría la persona**, no como las escribiría un programador.

| Sí | No |
|---|---|
| "¿cómo está mi caja?" | "ejecutar reporte de flujo de efectivo" |
| "¿a quién le cobro?" | "consultar cuentas por cobrar" |
| "¿me alcanza para pagar la nómina?" | "análisis de liquidez" |

Mínimo cinco. Que no se pisen con las de otra skill.

### Nombres de las herramientas

El patrón es `mcp__<nombre-del-servidor>__<grupo>_<herramienta>`.

Este repositorio asume que el servidor se llama **`alegra-mcp`**, como indica [`docs/conectar-mcp-alegra.md`](../docs/conectar-mcp-alegra.md). Ejemplos reales:

```
mcp__alegra-mcp__reports_get_cash_flow
mcp__alegra-mcp__reports_get_receivables_summary
mcp__alegra-mcp__banks_getTransactions
mcp__alegra-mcp__itemsStock_get_item_stock_summary
mcp__alegra-mcp__expenses_list-bills
```

**Verifica que la herramienta existe antes de ponerla.** Si te la inventas, la skill falla en silencio.

---

## Solo consulta

Ninguna skill de este repositorio usa herramientas que escriban. Nada de `create`, `update`, `delete` ni `void`.

Es una decisión de diseño, no una limitación técnica: una IA que se equivoca leyendo te da un dato malo y lo ves. Una que se equivoca escribiendo te daña la contabilidad y quizá no lo notas hasta el cierre.

Toda skill lo dice explícito en su sección de límites.

---

## El cuerpo del `SKILL.md`

Nueve secciones, en este orden:

```markdown
# <Título en español>

## Qué hace por ti
El beneficio en 2 o 3 frases. En lenguaje de negocio, no de API.

## Para quién es
Pyme o contador, y en qué momento se usa.

## Qué necesitas
El MCP de Alegra conectado y qué grupos habilitar.

## Cómo la usas
Cuatro o cinco frases de ejemplo, tal cual las escribiría la persona.

## Qué te entrega
Un ejemplo de la respuesta, con datos inventados. Que se vea el valor.

## Workflow
El paso a paso que sigue la IA, con los nombres exactos de las herramientas.

## Cómo interpretar los resultados
Qué significan las cifras y qué decisión habilitan. Opcional pero recomendado.

## Errores frecuentes
Tabla: Síntoma | Causa | Solución.

## Límites
Qué NO hace. Siempre incluye la nota de solo lectura.
```

### El workflow

Es la parte que ejecuta la IA. Sé específico:

- Nombra las herramientas exactas y en qué orden.
- Di qué hacer si un dato viene vacío (no inventar: decirlo).
- Di qué asumir cuando la persona no especifica (por ejemplo, si no dice período, usar el mes en curso y avisarlo).
- Define el formato de salida: tabla, resumen, lista priorizada.

### La nota de solo lectura

Copia esta línea tal cual en la sección `## Límites` de toda skill:

> Esta skill solo lee. No crea, no modifica ni borra nada en tu cuenta de Alegra.

---

## El `README.md` de la skill

GitHub lo muestra al entrar a la carpeta. Es la vitrina: alguien decide ahí si instala la skill o no.

Corto, cuatro bloques:

1. **Título y una frase** de qué resuelve.
2. **Para quién es** y en qué momento.
3. **Un ejemplo real**: la pregunta que escribe la persona y un pedazo de la respuesta.
4. **Cómo instalarla**: dos líneas y el enlace a [`docs/instalar-skills.md`](../docs/instalar-skills.md).

No repitas el workflow. Para eso está el `SKILL.md`.

---

## Estilo

- Español con acentos, forma con "tú". **Nunca voseo** ("tienes", no "tenés").
- Frases cortas. Primero el beneficio.
- Lenguaje del negocio. Si tienes que usar un término contable, explícalo o enlaza el [glosario](../docs/glosario.md).
- Sin emojis decorativos.
- Sin promesas infladas ni datos inventados que parezcan reales.
- Datos de ejemplo evidentemente ficticios (`Ferretería La 45`, `Distribuidora El Progreso`).

---

## Checklist antes de abrir el PR

- [ ] `name` = nombre de la carpeta, con prefijo `alegra-`
- [ ] `description` con mínimo 5 trigger phrases en español
- [ ] Todas las herramientas de `allowed-tools` existen y son de consulta
- [ ] `metadata` completo, con `audiencia` que coincide con la carpeta
- [ ] Las nueve secciones del cuerpo
- [ ] La nota de solo lectura en `## Límites`
- [ ] `README.md` de la carpeta escrito
- [ ] Cero tokens, cero datos reales, cero rutas de tu computador
- [ ] Probada de verdad contra una cuenta con datos
