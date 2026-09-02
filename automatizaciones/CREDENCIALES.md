# Credenciales

**Qué es esto:** una credencial es el permiso que le das a n8n para entrar a un servicio
en tu nombre. Se configura una sola vez y todos los flujos la reutilizan.

Aquí está la ficha de los cinco servicios que usan estas automatizaciones.

---

## Los nombres exactos

Los `workflow.json` referencian las credenciales **por nombre**. Si las nombras distinto,
al importar un flujo los nodos aparecen sin credencial y toca seleccionarla a mano en cada
uno.

| Servicio | Tipo en n8n | Nómbrala exactamente |
|---|---|---|
| Alegra | Basic Auth | `Alegra API` |
| Notion | Notion API | `Notion account` |
| Google Sheets | Google Sheets OAuth2 API | `Google Sheets account` |
| Gmail | Gmail OAuth2 | `Gmail account` |
| Telegram | Telegram API | `Telegram account` |

Cópialos tal cual, con mayúsculas y espacios iguales.

## Qué necesita cada flujo

| Flujo | Alegra | Notion | Sheets | Gmail | Telegram |
|---|:---:|:---:|:---:|:---:|:---:|
| [Radar de cartera](n8n/alegra-receivables-aging-to-notion/) | Sí | Sí | | | |
| [Recordatorios de cobro](n8n/alegra-overdue-invoice-reminders/) | Sí | | | Sí | |
| [Alerta de reposición](n8n/alegra-low-stock-reorder-alert/) | Sí | Sí | | | Sí |
| [Facturación recurrente](n8n/alegra-monthly-recurring-billing-run/) | Sí | | Sí | Sí | |
| [Cotizaciones frías](n8n/alegra-stale-estimate-followup/) | Sí | | | Sí | |
| [Bienvenida a cliente nuevo](n8n/alegra-new-client-onboarding/) | Sí | Sí | | Sí | |
| [Calendario de pagos](n8n/alegra-payables-calendar/) | Sí | | Sí | Sí | |
| [Guardián de duplicadas](n8n/alegra-duplicate-bill-guard/) | Sí | | | | Sí |
| [Guardián de anomalías](n8n/alegra-invoice-anomaly-guard/) | Sí | | | | Sí |
| [Checklist de cierre](n8n/alegra-month-close-checklist/) | Sí | | Sí | Sí | |

---

## Alegra

**Tipo en n8n:** Basic Auth · **Nombre:** `Alegra API` · **Demora:** 2 minutos

| Campo | Qué va |
|---|---|
| **User** | El correo con el que entras a Alegra |
| **Password** | Tu **token** de la API. **No tu contraseña** |

El paso a paso completo, con dónde queda el token en Alegra y qué hacer si se filtra, está
en **[Obtener tu token de Alegra](OBTENER-TOKEN-ALEGRA.md)**.

**Permisos que da:** todo lo que puede hacer tu usuario en Alegra. Léelo como "acceso
total a la contabilidad".

---

## Notion

**Tipo en n8n:** Notion API · **Nombre:** `Notion account` · **Demora:** 5 minutos

### Cómo se saca

1. Entra a **notion.so/my-integrations**.
2. **New integration**. Ponle un nombre, por ejemplo `Alegra`.
3. Elige el espacio de trabajo donde tienes tus bases de datos.
4. En **Capabilities** deja marcado **Read content**, **Update content** e **Insert
   content**.
5. **Submit**. Copia el **Internal Integration Secret** (empieza por `ntn_`).
6. En n8n: **Credentials** → **Add credential** → **Notion API** → pega el secreto →
   nómbrala `Notion account`.

### El paso que todo el mundo olvida

> **Tienes que compartir la base de datos con la integración.**

Crear la integración no le da acceso a nada. Hay que invitarla a cada base:

1. Abre en Notion la base de datos que va a usar el flujo.
2. Arriba a la derecha, **•••** → **Connections** (en español, **Conexiones**) → **Connect
   to** → elige tu integración.

Si te saltas esto, el flujo falla con un error que dice que la base **no existe**. Existe:
la integración simplemente no la puede ver.

### Dónde saco el id de la base

Abre la base en el navegador y mira la URL:

```
notion.so/tuespacio/1a2b3c4d5e6f7890abcdef1234567890?v=...
                    └──────────── ese es el id ────────────┘
```

Es lo que va donde el flujo dice `REEMPLAZAR_DATABASE_ID`.

---

## Google Sheets

**Tipo en n8n:** Google Sheets OAuth2 API · **Nombre:** `Google Sheets account` ·
**Demora:** 3 minutos en n8n Cloud, 15 si tienes n8n instalado

### En n8n Cloud

1. **Credentials** → **Add credential** → **Google Sheets OAuth2 API**.
2. Botón **Sign in with Google**. Entra con tu cuenta y acepta.
3. Nómbrala `Google Sheets account`.

Eso es todo. n8n Cloud ya trae la app de Google configurada.

### Si tienes n8n instalado

Te toca crear tu propia app en Google Cloud: proyecto nuevo, habilitar la **Google Sheets
API**, crear credenciales **OAuth client ID** de tipo aplicación web, y pegar en
**Authorized redirect URI** la que n8n te muestra en la pantalla de la credencial. n8n
tiene la guía paso a paso en la misma pantalla, en **Docs**.

**Permisos que pide:** ver y editar tus hojas de cálculo.

### Dónde saco el id de la hoja

En la URL, entre `/d/` y `/edit`:

```
docs.google.com/spreadsheets/d/1AbCdEfGhIjKlMnOpQrStUvWxYz/edit
                               └────────── ese es el id ──────────┘
```

Es lo que va donde el flujo dice `REEMPLAZAR_SPREADSHEET_ID`.

> Cada flujo que usa Sheets te pide una pestaña con un nombre y unas columnas exactas. Está
> en el README del flujo. Las columnas van escritas **igual**, con y sin tilde como
> aparecen ahí: Google distingue.

---

## Gmail

**Tipo en n8n:** Gmail OAuth2 · **Nombre:** `Gmail account` · **Demora:** 3 minutos en
n8n Cloud

Mismo procedimiento que Google Sheets, pero eligiendo **Gmail OAuth2** y, si tienes n8n
instalado, habilitando la **Gmail API** en vez de la de Sheets.

**Permisos que pide:** leer, redactar y enviar correo desde tu cuenta.

> Dos de los flujos dejan el correo **en borradores** en vez de enviarlo. Es a propósito:
> así revisas antes de que salga. Cada README dice cómo cambiarlo a envío directo.

Si usas Google Workspace y tu organización bloquea las apps de terceros, el
administrador tiene que autorizarla. Es la razón más común de que este paso falle.

---

## Telegram

**Tipo en n8n:** Telegram API · **Nombre:** `Telegram account` · **Demora:** 2 minutos

Es la credencial más fácil de todas y no necesita ninguna cuenta de desarrollador.

### Crear el bot

1. En Telegram, busca **@BotFather** y ábrelo.
2. Escribe `/newbot`.
3. Te pide un nombre para mostrar. Puede ser cualquiera, por ejemplo `Alertas Alegra`.
4. Te pide un usuario. Tiene que terminar en `bot`, por ejemplo `alertas_alegra_bot`.
5. Te responde con el token. Se ve así: `1234567890:AAH...` (números, dos puntos, letras).
6. En n8n: **Credentials** → **Add credential** → **Telegram API** → pega el token →
   nómbrala `Telegram account`.

### Sacar el chat id

El bot necesita saber a quién escribirle. Ese destinatario tiene un número, el **chat id**.

1. Búscalo por su usuario en Telegram y **escríbele cualquier cosa**. Un "hola" sirve. Un
   bot no puede escribirte primero: tienes que abrir la conversación tú.
2. En Telegram, busca **@userinfobot**, escríbele y te responde con tu id. Es un número de
   varias cifras.
3. Ese número es el que va donde el flujo dice `REEMPLAZAR_CHAT_ID`.

### Si quieres que llegue a un grupo

1. Crea el grupo y **agrega tu bot** como miembro.
2. Agrega también **@userinfobot** al grupo; te dice el id del grupo. Los ids de grupo
   **empiezan con un guion**, por ejemplo `-1001234567890`. El guion va incluido.
3. Saca a `@userinfobot` del grupo cuando termines.

**Permisos que da:** el bot solo puede escribir en las conversaciones donde lo agregaste.
No ve tus otros chats.

---

## Errores frecuentes

| Qué ves | En qué servicio | Cómo lo arreglas |
|---|---|---|
| `401 Unauthorized` | Alegra | En **Password** va el token, no la contraseña |
| `Could not find database` / 404 | Notion | Comparte la base con la integración: **•••** → **Connections** |
| `path.database_id should be a valid uuid` | Notion | El `REEMPLAZAR_DATABASE_ID` quedó mal. Cópialo de la URL |
| `Requested entity was not found` | Google Sheets | El `REEMPLAZAR_SPREADSHEET_ID` quedó mal, o la hoja no es de esa cuenta |
| `The value "..." is not a valid column` | Google Sheets | La primera fila no coincide con la del README del flujo |
| `Insufficient permission` | Gmail / Sheets | Vuelve a conectar la credencial y acepta todos los permisos |
| `access_denied` al conectar | Gmail / Sheets | Tu Workspace bloquea apps de terceros. Habla con el administrador |
| `Bad Request: chat not found` | Telegram | Nunca le escribiste al bot, o el chat id está mal |
| `Forbidden: bot was blocked by the user` | Telegram | Desbloquéalo en la conversación |
| El nodo aparece sin credencial al importar | Cualquiera | La nombraste distinto. Mira la tabla de nombres exactos de arriba |

---

## Una cosa más sobre seguridad

Los `workflow.json` de este repositorio **no contienen ningún token**. Solo el nombre de la
credencial, que es un rótulo que n8n resuelve contra su propio almacén cifrado.

Eso quiere decir que puedes exportar un flujo y mandárselo a alguien sin filtrar nada. Pero
si alguna vez pegas un token dentro de un flujo "para no configurar la credencial", ese
archivo se vuelve un secreto y ya no se puede compartir. No lo hagas.

Antes de subir cualquier flujo a este repositorio corre:

```
node scripts/sanitize-workflow.js --check automatizaciones/n8n/*/workflow.json
```

Te avisa si algo se coló.
