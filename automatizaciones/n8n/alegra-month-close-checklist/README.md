# Checklist de cierre de mes

**El día 1 de cada mes te llega la lista de todo lo que quedó pendiente del mes que
acaba de cerrar, con qué hacer con cada cosa.**

Cerrar un mes es siempre lo mismo: revisar qué facturas quedaron sin cobrar, qué
borradores nunca se emitieron, qué le debes a tus proveedores y a qué cliente le falta
la identificación. Este flujo arma esa lista solo, la deja en una hoja de Google donde
puedes ir marcando lo que ya revisaste, y te la manda por correo.

**No escribe nada en Alegra.** Solo lee.

---

## Qué hace

1. El día 1 a las 7:00 calcula cuál es el mes que acaba de cerrar. Si corre el 1 de
   septiembre, revisa **agosto**.
2. Hace tres consultas a Alegra al tiempo, todas paginando: ventas sin cobrar, ventas en
   borrador y compras sin pagar.
3. Junta las tres y arma el checklist con cinco revisiones:

   | Tipo | Qué encontró | Qué hacer |
   |---|---|---|
   | **Borrador sin emitir** | Una factura de venta del mes que quedó en borrador | Emítela o bórrala: en borrador no cuenta para el mes |
   | **Cliente sin identificación** | Le facturaste a alguien sin NIT ni cédula registrada | Complétale la identificación antes de reportar |
   | **Venta sin cobrar** | Una factura del mes con saldo pendiente | Cóbrala o provisiónala antes de cerrar |
   | **Compra sin pagar** | Una factura de proveedor del mes que todavía debes | Págala o déjala causada con su fecha real |
   | **Venta vieja sin cobrar** | Algo que quedó colgado de meses anteriores | Ya lleva más de un mes: decide si la cobras o la castigas |

4. Escribe una fila por pendiente en tu hoja de Google. Si ya estaba, la actualiza en vez
   de duplicarla.
5. Te manda el correo con todo agrupado por tipo.

**Si no quedó nada pendiente, el correo llega igual** diciendo que está todo al día. Así
sabes que el flujo corrió y no que se cayó en silencio.

## Para quién es

Para el contador o la persona que cierra los meses. Reemplaza la media hora de revisar
listados en Alegra buscando qué quedó suelto.

---

## Qué necesitas

### 1. Una cuenta de n8n

Este flujo corre por horario, así que **sirve igual en n8n Cloud o instalado en tu
computador**. No necesita que nadie lo alcance desde internet.

Si nunca has usado n8n, empieza por **[Empezar aquí](../../EMPEZAR-AQUI.md)**.

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

La misma credencial `Alegra API` la usan los tres nodos de consulta.

### 3. Tu hoja de Google

Crea una hoja de cálculo con una pestaña llamada **`Cierre de mes`** y esta primera fila,
escrita **igual**:

| Clave | Mes | Tipo | Documento | Contacto | Fecha | Vence | Dias | Monto | Que hacer | Revisado |
|---|---|---|---|---|---|---|---|---|---|---|

**`Dias` y `Que hacer` van sin tilde**, tal como aparecen aquí. Google Sheets distingue.

La columna **`Clave`** es la llave: mezcla el mes, el tipo de pendiente y el id del
documento. Si vuelves a correr el flujo del mismo mes, actualiza las filas en vez de
duplicarlas. Y como la clave lleva el mes adentro, los meses viejos se quedan quietos: la
hoja te va quedando como el histórico de tus cierres.

La columna **`Revisado`** llega en `No`. Es tuya para marcarla en `Sí` a medida que
resuelves. El flujo solo la escribe la primera vez que crea la fila; si la corres otra
vez la vuelve a poner en `No`, así que márcala cuando ya no vayas a reejecutar el mes.

---

## Cómo lo pones a correr

1. Descarga **[`workflow.json`](workflow.json)**.
2. En n8n: **Workflows** → **Import from File** → elige el archivo.
3. Abre el nodo **Guardar el checklist** y reemplaza `REEMPLAZAR_SPREADSHEET_ID` por el id
   de tu hoja. Es el pedazo de la URL entre `/d/` y `/edit`:
   `docs.google.com/spreadsheets/d/`**`1AbC...XyZ`**`/edit`
4. Abre el nodo **Mandar el checklist** y reemplaza `REEMPLAZAR_CORREO_DESTINO` por tu
   correo.
5. Revisa que los cinco nodos con credencial la tengan seleccionada.
6. Dale a **Execute Workflow** para probarlo ya, sin esperar al día 1. Te va a revisar el
   mes pasado.
7. Si la hoja y el correo se ven bien, **activa el flujo** con el interruptor de arriba a
   la derecha.

---

## Cómo se ve el resultado

**En tu hoja de Google:**

| Clave | Mes | Tipo | Documento | Contacto | Monto | Que hacer | Revisado |
|---|---|---|---|---|---|---|---|
| 2026-08-Borrador sin emitir-5 | 2026-08 | Borrador sin emitir | FV-0105 | Papelería del Norte | 600000 | Emítela o bórrala… | No |
| 2026-08-Cliente sin identificación-93 | 2026-08 | Cliente sin identificación | FV-0103 | Cliente de mostrador | 0 | Complétale la identificación… | No |
| 2026-08-Venta sin cobrar-1 | 2026-08 | Venta sin cobrar | FV-0101 | Ferretería La 45 | 1200000 | Cóbrala o provisiónala… | No |
| 2026-08-Compra sin pagar-6 | 2026-08 | Compra sin pagar | FC-0201 | Transportes Unidos | 950000 | Págala o déjala causada… | No |
| 2026-08-Venta vieja sin cobrar-4 | 2026-08 | Venta vieja sin cobrar | FV-0044 | Almacén Central | 3000000 | Ya lleva más de un mes… | No |

**En tu correo:**

> **Cierre de agosto de 2026**
>
> Quedaron **5 cosas** por revisar antes de dar el mes por cerrado.
>
> **Borrador sin emitir (1)**
> Emítela o bórrala: en borrador no cuenta para el mes
>
> | Documento | Contacto | Fecha | Monto |
> |---|---|---|---|
> | FV-0105 | Papelería del Norte | 2026-08-15 | $ 600.000 |
>
> **Venta sin cobrar (1)**
> Cóbrala o provisiónala antes de cerrar
>
> | Documento | Contacto | Fecha | Monto |
> |---|---|---|---|
> | FV-0101 | Ferretería La 45 | 2026-08-15 | $ 1.200.000 |

Y cuando no quedó nada:

> **Cierre de agosto de 2026: no quedó nada pendiente**
>
> Revisamos tus ventas, tus borradores y tus compras de agosto de 2026 y no encontramos
> nada suelto. Puedes cerrar tranquilo.

---

## Qué escribe en Alegra

**Nada.** Este flujo solo hace tres consultas de lectura:

- `GET /invoices?status=open`
- `GET /invoices?status=draft`
- `GET /bills?status=open`

---

## Cosas que vas a querer ajustar

En el nodo **Armar el checklist**:

```js
const MONEDA = 'COP';
const INCLUIR_MESES_ANTERIORES = true; // false para ver solo el mes que cerró
```

En el nodo **Armar el correo del cierre**:

```js
const MAXIMO_POR_BLOQUE = 10; // cuántas filas muestra el correo por cada tipo
```

Si un tipo tiene más de 10, el correo te dice cuántas quedaron por fuera. La hoja sí las
trae todas.

**El día y la hora.** En el nodo **El día 1 de cada mes** puedes cambiar el día del mes y
la hora. Si prefieres correrlo el día 5, cuando ya llegaron las facturas de los
proveedores, pon `5` en **Trigger at Day of Month**.

**Qué revisa.** Las cinco revisiones están una debajo de otra en el nodo **Armar el
checklist**, numeradas y con comentario. Puedes comentar la que no te sirva o copiar el
bloque para agregar la tuya.

**Mandarlo a varias personas.** En el nodo **Mandar el checklist**, en **Send To**, separa
los correos con coma.

---

## Errores frecuentes

| Qué ves | Por qué pasa | Cómo lo arreglas |
|---|---|---|
| `401 Unauthorized` en un nodo de Alegra | Pusiste tu contraseña de Alegra en vez del token | En la credencial, **Password** va el token. Ver [Obtener tu token](../../OBTENER-TOKEN-ALEGRA.md) |
| `903` en un nodo de Alegra | Alguien cambió el `limit` a más de 30 | Alegra no acepta más de 30 por llamada. Déjalo en 30: el flujo pagina solo |
| Llega el correo de "todo al día" y sabes que hay pendientes | Los documentos no tienen fecha dentro del mes que cerró | El flujo filtra por la **fecha de la factura**, no por cuándo la registraste |
| `The value "..." is not a valid column` | La primera fila de la hoja no coincide | Compara con la tabla de arriba. `Dias` y `Que hacer` van **sin tilde** |
| Se duplican las filas al reejecutar | La columna `Clave` no existe o está escrita distinto | Es la llave de coincidencia. Tiene que estar y llamarse igual |
| `Requested entity was not found` en Google Sheets | El `REEMPLAZAR_SPREADSHEET_ID` quedó mal | Copia otra vez el pedazo de la URL entre `/d/` y `/edit` |
| No llega el correo | Quedó el `REEMPLAZAR_CORREO_DESTINO` | Ábrelo en el nodo **Mandar el checklist** y pon tu correo |
| El `Revisado` que marcaste volvió a `No` | Reejecutaste el flujo del mismo mes | Marca `Sí` cuando ya no vayas a reejecutar, o pon la marca en una columna aparte |
| Solo trae 30 documentos | Se borró el bloque de paginación de algún nodo | Vuelve a importar el `workflow.json` |

---

## Límites

- Revisa **facturas de venta, borradores y facturas de proveedor**. No mira asientos
  contables, nóminas, ni el estado del período contable en Alegra.
- No cierra nada ni bloquea el período. Es una lista de tareas, no el cierre en sí.
- La revisión de identificación solo mira los clientes que facturaste **ese mes**. Un
  cliente sin NIT al que no le facturaste no aparece.
- **Venta vieja sin cobrar** trae todo lo anterior al mes que cerró, sin tope de
  antigüedad. Si arrastras cartera de hace años, esa lista va a ser larga la primera vez.
  Ponlo en `false` si te estorba.
- Los montos salen del saldo que reporta Alegra en el momento de la consulta. Un pago
  registrado después no se refleja hasta la siguiente corrida.

---

## Va bien con

- **[Calendario de pagos a proveedores](../alegra-payables-calendar/)** — lo que hay que pagar antes de que se venza.
- **[Radar de cartera en Notion](../alegra-receivables-aging-to-notion/)** — el detalle de lo que te deben, todos los días.
- **[Guardián de anomalías en facturas](../alegra-invoice-anomaly-guard/)** — para que el mes no cierre con facturas raras.
