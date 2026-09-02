# Empezar aquí

**En 15 minutos vas a tener tu primera automatización de Alegra corriendo sola.**

No necesitas saber programar. No hay que escribir código en ningún paso. Si sabes usar
Alegra, puedes con esto.

---

## Qué vamos a hacer

1. Entender qué es n8n y elegir cuál usar.
2. Sacar tu token de Alegra.
3. Importar tu primer flujo.
4. Conectar las credenciales.
5. Correrlo a mano para ver que funciona.
6. Activarlo.

---

## 1. Qué es n8n

Es una herramienta donde armas cadenas de pasos: *"todos los días a las 7, consulta esto
en Alegra, ordénalo y mándamelo por correo"*. Cada paso es un cuadrito, y los cuadritos se
conectan con flechas.

Aquí no vas a armar nada desde cero: las 10 automatizaciones ya están hechas. Tú las
importas, les conectas tu cuenta y las prendes.

### Cuál usar

| | n8n Cloud | n8n instalado |
|---|---|---|
| Qué es | Una cuenta en `n8n.io`, como cualquier servicio web | Un programa corriendo en tu computador o servidor |
| Qué tienes que instalar | Nada | Node.js o Docker |
| Cuesta | Sí, tiene plan de prueba gratis | No, pero necesitas quién lo mantenga |
| Sirve para los 7 flujos por horario | Sí | Sí |
| Sirve para los 3 flujos por webhook | Sí | Solo si tiene un dominio público |

**Si esta es tu primera vez, usa n8n Cloud.** Entra a `n8n.io`, crea la cuenta y sigue.

Si prefieres instalarlo, la forma más corta es con Node.js:

```
npx n8n
```

Te queda corriendo en `http://localhost:5678`. Sirve perfecto para los siete flujos por
horario. Para los de webhook necesitas que Alegra pueda alcanzarlo desde internet, y
`localhost` no se puede — eso está explicado en
[Conectar los webhooks de Alegra](CONECTAR-WEBHOOKS-ALEGRA.md).

---

## 2. Saca tu token de Alegra

En Alegra: tu nombre arriba a la derecha → **Configuración** → **API**. Ahí copias dos
cosas, el **usuario** (tu correo) y el **token**.

> El token **no es tu contraseña de Alegra**. Es una cadena larga aparte. Confundir los dos
> es el error número uno.

El detalle completo está en **[Obtener tu token de Alegra](OBTENER-TOKEN-ALEGRA.md)**.
Ábrelo, sácalo y vuelve.

---

## 3. Elige tu primer flujo

Empieza por uno **que no escriba nada en Alegra** y que no dependa de webhooks. Estos tres
son los más fáciles:

| Si te interesa | Empieza por | Necesitas |
|---|---|---|
| Saber quién te debe y cuánto | [Radar de cartera en Notion](n8n/alegra-receivables-aging-to-notion/) | Alegra + Notion |
| Saber qué tienes que pagar | [Calendario de pagos](n8n/alegra-payables-calendar/) | Alegra + Sheets + Gmail |
| Que no se te acabe el inventario | [Alerta de reposición](n8n/alegra-low-stock-reorder-alert/) | Alegra + Notion + Telegram |

Si no tienes Notion ni Google Sheets, el más rápido de todos es el
[Guardián de anomalías](n8n/alegra-invoice-anomaly-guard/): solo necesita Alegra y
Telegram, y la credencial de Telegram se saca en dos minutos. Pero es de webhook, así que
requiere n8n Cloud.

**La lista completa de los 10 está en [el índice](README.md).**

---

## 4. Impórtalo

1. Descarga el `workflow.json` del flujo que elegiste.
2. En n8n: **Workflows** → la flechita al lado de **Create Workflow** → **Import from
   File**.

El detalle, con las capturas de qué botón es cada uno, está en
**[Cómo importar un flujo](COMO-IMPORTAR.md)**.

---

## 5. Conecta las credenciales

Cada flujo necesita entre dos y tres. La de Alegra la vas a usar en todos; las demás
dependen del flujo.

Los nombres tienen que ser **exactos**:

| Servicio | Nómbrala |
|---|---|
| Alegra | `Alegra API` |
| Notion | `Notion account` |
| Google Sheets | `Google Sheets account` |
| Gmail | `Gmail account` |
| Telegram | `Telegram account` |

Cada una con su paso a paso en **[Credenciales](CREDENCIALES.md)**.

---

## 6. Reemplaza los marcadores

Con el flujo abierto, `Ctrl+F` (o `Cmd+F`) y busca `REEMPLAZAR`. Son los datos que solo tú
tienes: el id de tu base de Notion, el de tu hoja, tu correo, tu chat de Telegram.

El README del flujo te dice en qué nodo está cada uno y de dónde se saca.

---

## 7. Córrelo a mano

Botón **Execute Workflow**, abajo. El flujo corre una vez, ahí mismo.

Los nodos se ponen verdes si funcionaron. Después ve a mirar el resultado de verdad: tu
Notion, tu hoja, tu correo.

**Este paso no se salta.** Es donde se descubre que faltaba una columna en la hoja o que
el chat id estaba mal.

---

## 8. Actívalo

Interruptor de arriba a la derecha. Ya está: corre solo.

Si es un flujo por webhook, falta registrarlo en Alegra:
**[Conectar los webhooks de Alegra](CONECTAR-WEBHOOKS-ALEGRA.md)**.

---

## Si algo falla, mira esto

| Qué ves | Qué es | Dónde está la respuesta |
|---|---|---|
| `401 Unauthorized` en Alegra | Pusiste la contraseña en vez del token | [Obtener tu token](OBTENER-TOKEN-ALEGRA.md) |
| `903` en Alegra | Alguien subió el `limit` por encima de 30 | Déjalo en 30. Los flujos paginan solos |
| Notion dice que la base no existe | No compartiste la base con la integración | [Credenciales → Notion](CREDENCIALES.md#notion) |
| Google Sheets no encuentra la hoja | El id quedó mal | [Credenciales → Google Sheets](CREDENCIALES.md#google-sheets) |
| `chat not found` en Telegram | Nunca le escribiste al bot | [Credenciales → Telegram](CREDENCIALES.md#telegram) |
| El flujo corre pero no pasa nada | Quedó un `REEMPLAZAR_` sin cambiar | [Cómo importar](COMO-IMPORTAR.md) |
| Lo activé y nunca se dispara | Es de webhook y falta registrarlo | [Conectar los webhooks](CONECTAR-WEBHOOKS-ALEGRA.md) |
| Nada de lo anterior | | Abre la pestaña **Executions**, haz clic en la corrida roja y mira el nodo que se rompió |

Cada flujo tiene además su propia tabla de errores en su README, con los casos específicos
de ese flujo.

---

## Tres cosas que conviene saber desde el principio

**Nada se emite sin que tú lo revises.** Los tres flujos que crean facturas las dejan en
**borrador**, y además vienen con el nodo de escritura apagado para que la primera corrida
sea en seco.

**Ningún archivo trae tokens.** Los `workflow.json` solo guardan el *nombre* de la
credencial. Puedes exportar un flujo y compartirlo sin filtrar nada tuyo.

**Alegra entrega máximo 30 registros por consulta.** Todos los flujos están hechos para
pedir página por página hasta traerlo todo. Si alguna vez ves que solo trae 30, es que se
borró ese bloque: vuelve a importar el archivo.

---

## Y ahora qué

- **[Las 10 automatizaciones](README.md)** — el índice completo
- **[Cómo importar un flujo](COMO-IMPORTAR.md)**
- **[Obtener tu token de Alegra](OBTENER-TOKEN-ALEGRA.md)**
- **[Credenciales](CREDENCIALES.md)**
- **[Conectar los webhooks de Alegra](CONECTAR-WEBHOOKS-ALEGRA.md)**
