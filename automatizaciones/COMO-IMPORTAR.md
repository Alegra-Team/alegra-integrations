# Cómo importar un flujo

**Qué es esto:** cada automatización es un archivo `workflow.json`. Importarlo es cargarlo
en tu n8n para poder usarlo. Son cinco pasos y no hay que escribir código.

**Cuánto demora:** 5 minutos por flujo.

---

## 1. Descarga el archivo

Entra a la carpeta del flujo que quieres, por ejemplo
[`n8n/alegra-payables-calendar/`](n8n/alegra-payables-calendar/), y descarga su
`workflow.json`.

En GitHub: abre el archivo, botón **Download raw file** (el icono de la flecha hacia abajo,
arriba a la derecha del archivo).

> Si al abrirlo se ve un montón de texto en el navegador, no le des a **Guardar como** desde
> ahí: usa el botón de descarga. Un `.json` guardado como página web no sirve.

## 2. Impórtalo en n8n

1. En n8n, menú de la izquierda → **Workflows**.
2. Arriba a la derecha, el botón **Create Workflow** tiene una flechita al lado. Ábrela y
   elige **Import from File**.
3. Selecciona el `workflow.json` que descargaste.

Se te abre el flujo con todos sus nodos y unas notas amarillas que explican qué hace cada
parte. **Léelas.**

## 3. Conecta las credenciales

Los nodos que necesitan credencial la referencian por nombre. Si ya las creaste con el
nombre exacto, aparecen conectadas solas.

Si alguna aparece en rojo o vacía:

1. Doble clic en el nodo.
2. Arriba, en **Credential to connect with**, elige la que corresponde.
3. Si no existe, **Create new credential** y sigue
   **[Credenciales](CREDENCIALES.md)**.

Nombres exactos: `Alegra API`, `Notion account`, `Google Sheets account`, `Gmail account`,
`Telegram account`.

## 4. Reemplaza los marcadores

Todos los flujos traen marcadores que empiezan por `REEMPLAZAR_`. Son los datos que solo
tú tienes.

| Marcador | Qué va | Dónde lo saco |
|---|---|---|
| `REEMPLAZAR_DATABASE_ID` | El id de tu base de Notion | [Credenciales → Notion](CREDENCIALES.md#notion) |
| `REEMPLAZAR_SPREADSHEET_ID` | El id de tu hoja de Google | [Credenciales → Google Sheets](CREDENCIALES.md#google-sheets) |
| `REEMPLAZAR_CORREO_DESTINO` | A qué correo te llega el informe | El tuyo |
| `REEMPLAZAR_CHAT_ID` | A qué conversación de Telegram avisa | [Credenciales → Telegram](CREDENCIALES.md#telegram) |
| `REEMPLAZAR_NOMBRE_DE_TU_EMPRESA` | Con qué nombre firmas los correos de cobro | El de tu negocio |

Para encontrarlos rápido: con el flujo abierto, `Ctrl+F` (o `Cmd+F` en Mac) y busca
`REEMPLAZAR`.

El README de cada flujo te dice exactamente en qué nodo está cada uno.

## 5. Pruébalo antes de activarlo

Botón **Execute Workflow**, abajo en el centro.

El flujo corre una vez, ahí mismo, sin esperar a la hora programada. Cada nodo se pone
verde si funcionó y rojo si falló. Haz clic en cualquiera para ver qué datos salieron de
él.

Revisa el resultado de verdad: entra a tu Notion, a tu hoja, a tu correo. Si se ve bien,
sigue. Si no, mira los [errores frecuentes](#errores-frecuentes).

## 6. Actívalo

Interruptor de arriba a la derecha, **Inactive** → **Active**.

Desde ese momento corre solo a la hora que tiene programada.

> **Los flujos por webhook necesitan un paso más.** Además de activarlos, hay que
> registrar su dirección en Alegra. Está en
> **[Conectar los webhooks de Alegra](CONECTAR-WEBHOOKS-ALEGRA.md)**.

---

## Los flujos que escriben en Alegra vienen apagados a propósito

Tres automatizaciones crean o modifican cosas en Alegra:

| Flujo | Qué escribe |
|---|---|
| [Facturación recurrente del mes](n8n/alegra-monthly-recurring-billing-run/) | Facturas de venta **en borrador** |
| [Seguimiento a cotizaciones frías](n8n/alegra-stale-estimate-followup/) | Facturas de venta **en borrador** |
| [Bienvenida a un cliente nuevo](n8n/alegra-new-client-onboarding/) | Completa datos del contacto |

En esos flujos, **el nodo que escribe viene desactivado** (se ve gris y tachado). Así la
primera vez que lo corres ves exactamente qué *habría* hecho, sin que haga nada.

Cuando estés conforme, doble clic derecho en el nodo → **Activate**, o selecciónalo y
presiona `D`.

Nada de lo que crean queda emitido: las facturas quedan en **borrador**, para que una
persona las revise en Alegra antes de que salgan.

---

## Errores frecuentes

| Qué ves | Por qué pasa | Cómo lo arreglas |
|---|---|---|
| `Could not import file` | El archivo se guardó como página web, no como `.json` | Descárgalo otra vez con **Download raw file** |
| Un nodo aparece vacío o dice "unknown node" | Tu n8n es más viejo que el flujo | Actualiza n8n. Estos flujos se hicieron con la versión de 2026 |
| El nodo está en rojo y dice `Credentials not set` | La credencial no existe o se llama distinto | Mira los nombres exactos en [Credenciales](CREDENCIALES.md) |
| `401 Unauthorized` en un nodo de Alegra | Pusiste la contraseña en vez del token | [Obtener tu token](OBTENER-TOKEN-ALEGRA.md) |
| El flujo corre pero no pasa nada | Quedó algún `REEMPLAZAR_` sin cambiar | `Ctrl+F` → busca `REEMPLAZAR` |
| Corre bien a mano pero nunca solo | No lo activaste | Interruptor de arriba a la derecha |
| Lo activé y sigue sin correr | Es un flujo por webhook | Falta registrar la dirección en Alegra: [ver aquí](CONECTAR-WEBHOOKS-ALEGRA.md) |
| Solo trae 30 registros | Se borró el bloque de paginación de algún nodo | Vuelve a importar el `workflow.json` |

---

## Cómo ver qué pasó en una corrida

Con el flujo abierto, pestaña **Executions** (arriba). Ahí está el historial: cuándo corrió,
si funcionó, y qué datos pasaron por cada nodo.

Cuando algo falla, esa es la primera pantalla que hay que mirar. Haz clic en la ejecución
roja y luego en el nodo que se rompió: el mensaje de error está ahí.

---

## Y ahora qué

- **[Empezar aquí](EMPEZAR-AQUI.md)** — si todavía no tienes n8n
- **[Obtener tu token de Alegra](OBTENER-TOKEN-ALEGRA.md)**
- **[Credenciales](CREDENCIALES.md)** — Notion, Sheets, Gmail, Telegram
- **[Conectar los webhooks de Alegra](CONECTAR-WEBHOOKS-ALEGRA.md)**
- **[Las 10 automatizaciones](README.md)**
