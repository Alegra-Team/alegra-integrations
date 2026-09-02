# Facturación recurrente del mes

**El día 1 te deja creadas, en borrador, las facturas de todos tus clientes fijos.**

Tú tienes una lista en Google Sheets con a quién le facturas lo mismo todos los meses.
El flujo la lee, revisa quién ya tiene factura, crea las que faltan **como borrador** en
Alegra y te manda un correo con qué hizo.

**Nada se emite solo.** Las facturas quedan en borrador. Tú entras a Alegra, las revisas
y las emites.

---

## Qué hace

1. Lee tu hoja de clientes fijos en Google Sheets.
2. Junta las filas de un mismo cliente en **una sola factura**. Si a alguien le facturas
   tres cosas, le llega una factura con tres líneas, no tres facturas.
3. Le pregunta a Alegra quiénes ya tienen factura este mes, para no duplicarle a nadie.
4. Crea las que faltan con `POST /invoices` en estado **borrador**.
5. Te manda un correo con lo que creó, lo que omitió y por qué.

Si corres el flujo dos veces el mismo mes, la segunda vez no crea nada. Esa es la
protección principal contra duplicados.

## Para quién es

Para ti si tienes clientes de cuota fija: arriendos, mantenimientos, planes mensuales,
iguala de servicios. El día 1 dejas de perder la mañana copiando la factura del mes
pasado.

---

## Qué necesitas

### 1. Una cuenta de n8n

En la nube o instalada en tu computador. Si nunca has usado n8n, empieza por
**[Empezar aquí](../../EMPEZAR-AQUI.md)**.

### 2. Tres credenciales en n8n

| Credencial | Tipo en n8n | Nómbrala exactamente | Cómo se saca |
|---|---|---|---|
| Alegra | **Basic Auth** | `Alegra API` | [Obtener tu token de Alegra](../../OBTENER-TOKEN-ALEGRA.md) |
| Google Sheets | **Google Sheets OAuth2** | `Google Sheets account` | [Credenciales](../../CREDENCIALES.md#google-sheets) |
| Gmail | **Gmail OAuth2** | `Gmail account` | [Credenciales](../../CREDENCIALES.md#gmail) |

> El nombre importa. Si las llamas distinto, al importar el flujo los nodos te van a
> aparecer sin credencial y tendrás que seleccionarlas a mano.

En la credencial de Alegra:
- **User** → el correo con el que entras a Alegra.
- **Password** → tu **token** de la API. No tu contraseña.

### 3. Tu hoja de clientes fijos

Crea una hoja de cálculo en Google Sheets. La pestaña se tiene que llamar
**`Clientes fijos`** y la fila 1 lleva estos títulos, escritos igual:

| Cliente ID | Cliente | Producto ID | Producto | Precio | Cantidad | Días para pagar | Activo |
|---|---|---|---|---|---|---|---|
| 10 | Ferretería La 45 | 1 | Arriendo local | 1200000 | 1 | 15 | Sí |
| 10 | Ferretería La 45 | 2 | Administración | 300000 | 1 | 15 | Sí |
| 20 | Distribuidora El Progreso | 3 | Plan mensual | 800000 | 2 | 30 | Sí |
| 40 | Cliente en pausa | 5 | Servicio | 100000 | 1 | 30 | No |

Qué va en cada columna:

- **Cliente ID** — el id del cliente en Alegra. Abre el contacto en Alegra y míralo al
  final de la URL. Es el número que amarra todo.
- **Cliente** — el nombre. Solo se usa para que el correo se entienda; no se manda a Alegra.
- **Producto ID** — el id del producto o servicio en Alegra, igual que arriba.
- **Producto** — el nombre que quieres que aparezca en la línea de la factura.
- **Precio** — sin puntos ni signo de peso. `1200000`, no `$1.200.000`.
- **Cantidad** — cuántas unidades. Si es un servicio, va `1`.
- **Días para pagar** — el plazo. Si lo dejas vacío, usa 30.
- **Activo** — `Sí` para incluirlo. Cualquier otra cosa lo deja por fuera **sin que
  tengas que borrar la fila**. Así pausas un cliente y lo vuelves a prender el otro mes.

**Dos filas con el mismo `Cliente ID` se convierten en una sola factura con dos líneas.**

Las filas incompletas (sin cliente, sin producto o sin precio) se ignoran solas.

### 4. Un correo donde recibir el resumen

Cualquiera al que tengas acceso. Va en el nodo **Enviar el resumen**.

---

## Cómo lo pones a correr

1. Descarga **[`workflow.json`](workflow.json)**.
2. En n8n: **Workflows** → **Import from File** → elige el archivo.
3. Abre el nodo **Traer los clientes fijos** y reemplaza `REEMPLAZAR_SPREADSHEET_ID` por
   el id de tu hoja. Es el pedazo largo de la URL, entre `/d/` y `/edit`.
4. Abre el nodo **Enviar el resumen** y reemplaza `REEMPLAZAR_CORREO_DESTINO` por tu correo.
5. Revisa que los nodos con credencial la tengan seleccionada.
6. Dale a **Test workflow**. **En esta primera corrida no se crea nada en Alegra**: el
   nodo que crea las facturas viene desactivado a propósito.
7. Lee el correo que te llegó. Dice exactamente qué *habría* creado.
8. Si te cuadra, clic derecho en el nodo **Crear la factura borrador** → **Activate**.
9. Vuelve a darle **Test workflow**. Ahora sí crea los borradores.
10. Entra a Alegra y revísalos. Si todo bien, activa el flujo con el interruptor de arriba
    a la derecha.

Desde ahí corre solo, el día 1 de cada mes a las 7:00.

---

## La prueba en seco

Es la parte más importante de este flujo, así que vale la pena insistir.

El nodo **Crear la factura borrador** viene **desactivado**. Con él desactivado, n8n deja
pasar los datos sin llamar a Alegra, y el correo que te llega dice:

> **Facturación de septiembre de 2026 — prueba en seco, 2 pendiente(s)**
>
> Esto es una prueba en seco: el nodo que crea las facturas está desactivado, así que en
> Alegra no se creó nada.
>
> Si lo activas, se crearían **2 borrador(es)** por un total de **$3.100.000**:
>
> | | |
> |---|---|
> | Distribuidora El Progreso (1 línea(s)) | $1.600.000 |
> | Ferretería La 45 (2 línea(s)) | $1.500.000 |
>
> Se omitieron **1** porque ya tenían factura este mes:
>
> | | |
> |---|---|
> | Almacén Central | $450.000 |

Corre en seco hasta que los números te den. Solo entonces activas el nodo.

---

## Cómo se ve cuando ya está andando

> **Facturación de septiembre de 2026 — 2 borrador(es) listos**
>
> Ya quedaron creados **2 borrador(es)** en Alegra, por un total de **$3.100.000**.
> Revísalos y emítelos cuando quieras.
>
> | | |
> |---|---|
> | FV-1050 — Ferretería La 45 | $1.500.000 |
> | FV-1051 — Distribuidora El Progreso | $1.600.000 |
>
> Se omitieron **1** porque ya tenían factura este mes:
>
> | | |
> |---|---|
> | Almacén Central | $450.000 |
>
> Ninguna de estas facturas está emitida. Quedan en borrador en Alegra hasta que tú las revises.

Y si no había nada por hacer, el asunto dice **"todo al día"**.

---

## Qué escribe en Alegra

**Crea facturas en estado borrador.** Es lo único que escribe.

El cuerpo exacto que le manda a Alegra lo puedes ver en el nodo **Decidir a quién
facturar**, en el campo `factura`. Se ve así:

```json
{
  "client": { "id": "20" },
  "date": "2026-09-01",
  "dueDate": "2026-10-01",
  "status": "draft",
  "paymentForm": "CREDIT",
  "paymentMethod": "CASH",
  "items": [{ "id": "3", "name": "Plan mensual", "price": 800000, "quantity": 2 }],
  "anotation": "Facturación recurrente de septiembre de 2026. Creada como borrador."
}
```

`"status": "draft"` es lo que garantiza que quede en borrador. **No lo cambies a `open`**
si quieres seguir revisando antes de emitir.

El nodo tiene los reintentos automáticos apagados a propósito. Un reintento sobre una
factura ya creada te dejaría dos.

---

## Cosas que vas a querer ajustar

Todo está arriba del nodo **Decidir a quién facturar**:

```js
const FORMA_DE_PAGO = 'CREDIT';   // CREDIT = le das plazo. CASH = paga de contado
const METODO_DE_PAGO = 'CASH';    // cómo esperas que te pague
const DIAS_PARA_PAGAR = 30;       // se usa si la fila no trae "Días para pagar"
const MONEDA = 'COP';             // solo afecta cómo se ve la plata en el correo
```

**El día y la hora.** Nodo `El día 1 de cada mes`. Si facturas el 5, cambia
`triggerAtDayOfMonth` a 5.

**Impuestos.** Si tus productos ya tienen el impuesto configurado en Alegra, se aplica
solo. Si necesitas forzar uno, agrega `tax: { id: 'ID_DEL_IMPUESTO' }` dentro de cada
línea, en el nodo `Decidir a quién facturar`.

**Numeración.** Usa la numeración que tengas por defecto en Alegra. Para forzar otra,
agrega `numberTemplate: { id: 'ID_DE_LA_NUMERACION' }` al objeto `factura`.

**El texto del correo.** Está en el nodo `Armar el resumen`.

---

## Errores frecuentes

| Qué ves | Por qué pasa | Cómo lo arreglas |
|---|---|---|
| `401 Unauthorized` en un nodo de Alegra | Pusiste tu contraseña de Alegra en vez del token | En la credencial, **Password** va el token. Ver [Obtener tu token](../../OBTENER-TOKEN-ALEGRA.md) |
| No se creó ninguna factura y el correo dice "prueba en seco" | El nodo de creación sigue desactivado | Es lo esperado en la primera corrida. Clic derecho → **Activate** |
| `400` de Alegra al crear | El `Cliente ID` o el `Producto ID` no existen | Verifícalos en Alegra, al final de la URL del contacto o del producto |
| `Sheet not found` | La pestaña no se llama `Clientes fijos` | Renómbrala, o cambia el nombre en el nodo `Traer los clientes fijos` |
| Una fila no se facturó y no dice por qué | Le falta cliente, producto o precio, o `Activo` no dice `Sí` | Revisa esa fila. Las incompletas se ignoran en silencio a propósito |
| El precio salió en cero | Lo escribiste con puntos o con `$` | En la hoja va el número pelado: `1200000` |
| Un cliente quedó con dos facturas | Le creaste una a mano antes de que corriera el flujo, con fecha del mes anterior | El flujo mira las facturas del mes en curso. Revisa la fecha de la que hiciste a mano |
| `error 903` de Alegra | Alguien subió el `limit` por encima de 30 | Déjalo en 30. Es el máximo que acepta Alegra |

---

## Límites

- Solo revisa duplicados **dentro del mes en curso**, y por cliente. Si a un cliente le
  facturas dos cosas distintas en el mes, la segunda la va a omitir.
- Todas las líneas de un cliente van en una sola factura. No sabe partir en varias.
- No aplica descuentos ni retenciones. Si los necesitas, agrégalos a mano al borrador.
- Toma el precio de tu hoja, no de la lista de precios de Alegra.
- Hasta 1.200 facturas revisadas por corrida. Si emites más de eso al mes, sube
  `maxRequests` en `Traer facturas de este mes`.
- Las facturas quedan en borrador. Emitirlas sigue siendo tuyo, a propósito.

---

## Va bien con

- **[Recordatorios de cobro](../alegra-overdue-invoice-reminders/)** — para cobrar lo que emitiste con este.
- **[Radar de cartera en Notion](../alegra-receivables-aging-to-notion/)** — para ver cómo va quedando la cartera.
