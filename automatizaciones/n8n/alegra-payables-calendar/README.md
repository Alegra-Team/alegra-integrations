# Calendario de pagos a proveedores

**Cada lunes a las 7:00 te llega, ordenado por urgencia, todo lo que tienes que pagar en
los próximos 15 días.**

Las facturas de proveedor están en Alegra, pero para saber qué se vence esta semana toca
entrar, filtrar y sumar. Este flujo lo hace por ti y te deja dos cosas: una hoja de Google
que puedes filtrar y descargar, y un correo con el total por semana.

**No escribe nada en Alegra.** Solo lee.

---

## Qué hace

1. Cada lunes a las 7:00 trae **todas** tus facturas de proveedor abiertas. Paginando: si
   tienes 200, trae las 200, no las primeras 30.
2. Se queda con las que vencen en los próximos 15 días, más las que ya están vencidas.
3. Las ordena: primero lo más urgente.
4. Escribe una fila por factura en tu hoja de Google. Si la factura ya estaba, la
   actualiza en vez de duplicarla.
5. Te manda un correo con tres bloques: **ya vencidas**, **esta semana** y **próxima
   semana**, cada uno con su total.

## Para quién es

Para el contador o la persona de administración que maneja los pagos. Es la respuesta a
"¿cuánta plata necesito esta semana?" sin abrir Alegra.

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

### 3. Tu hoja de Google

Crea una hoja de cálculo con una pestaña llamada **`Pagos por vencer`** y esta primera
fila, escrita **igual**:

| Id en Alegra | Proveedor | Numero | Vence | Dias | Estado | Semana | Total | Pagado | Falta | Moneda | Actualizado |
|---|---|---|---|---|---|---|---|---|---|---|---|

**`Numero` y `Dias` van sin tilde**, tal como aparecen aquí. Google Sheets distingue.

La columna **`Id en Alegra`** es la llave: el flujo la usa para saber si una factura ya
está en la hoja. Si está, actualiza la fila; si no, agrega una nueva. Por eso puedes
correr el flujo todos los lunes sin que la hoja se llene de repetidos.

---

## Cómo lo pones a correr

1. Descarga **[`workflow.json`](workflow.json)**.
2. En n8n: **Workflows** → **Import from File** → elige el archivo.
3. Abre el nodo **Guardar el calendario** y reemplaza `REEMPLAZAR_SPREADSHEET_ID` por el
   id de tu hoja. Es el pedazo de la URL entre `/d/` y `/edit`:
   `docs.google.com/spreadsheets/d/`**`1AbC...XyZ`**`/edit`
4. Abre el nodo **Mandar el resumen** y reemplaza `REEMPLAZAR_CORREO_DESTINO` por tu
   correo.
5. Revisa que los cuatro nodos con credencial la tengan seleccionada.
6. Dale a **Execute Workflow** para probarlo ya, sin esperar al lunes.
7. Si la hoja y el correo se ven bien, **activa el flujo** con el interruptor de arriba a
   la derecha.

---

## Cómo se ve el resultado

**En tu hoja de Google:**

| Id en Alegra | Proveedor | Numero | Vence | Dias | Estado | Semana | Falta |
|---|---|---|---|---|---|---|---|
| 34 | Ferretería La 45 | FC-0034 | 2026-08-25 | -8 | Vencida | Vencidas | 350000 |
| 56 | Almacén Central | FC-0056 | 2026-09-02 | 0 | Vence hoy | Esta semana | 300000 |
| 12 | Distribuidora El Progreso | FC-0012 | 2026-09-05 | 3 | Esta semana | Esta semana | 1200000 |
| 78 | Papelería del Norte | FC-0078 | 2026-09-14 | 12 | Por vencer | Próxima semana | 890000 |

`Dias` en negativo quiere decir vencida. `-8` es "se venció hace 8 días".

**En tu correo:**

> **Esto es lo que tienes que pagar**
>
> En total **$ 2.740.000** repartidos en 4 facturas.
>
> **Ya vencidas — $ 350.000 (1)**
>
> | Proveedor | Factura | Vence | Cuándo | Falta pagar |
> |---|---|---|---|---|
> | Ferretería La 45 | FC-0034 | 2026-08-25 | 8 días vencida | $ 350.000 |
>
> **Esta semana — $ 1.500.000 (2)**
>
> | Proveedor | Factura | Vence | Cuándo | Falta pagar |
> |---|---|---|---|---|
> | Almacén Central | FC-0056 | 2026-09-02 | hoy | $ 300.000 |
> | Distribuidora El Progreso | FC-0012 | 2026-09-05 | en 3 días | $ 1.200.000 |
>
> **Próxima semana — $ 890.000 (1)**
>
> | Proveedor | Factura | Vence | Cuándo | Falta pagar |
> |---|---|---|---|---|
> | Papelería del Norte | FC-0078 | 2026-09-14 | en 12 días | $ 890.000 |

---

## Qué escribe en Alegra

**Nada.** Este flujo solo hace una consulta de lectura: `GET /bills?status=open`.

---

## Cosas que vas a querer ajustar

En el nodo **Armar el calendario de pagos**:

```js
const DIAS_HACIA_ADELANTE = 15;  // hasta cuántos días adelante mirar
const MONEDA = 'COP';
const INCLUIR_VENCIDAS = true;   // false si solo quieres lo que está por vencer
```

**El día y la hora.** En el nodo **Cada lunes a las 7:00**, el campo de expresión dice
`0 7 * * 1`. El `1` es lunes (0 es domingo). El `7` es la hora. Si lo quieres los viernes
a las 6 de la tarde: `0 18 * * 5`.

**El texto del correo** está en el nodo **Armar el correo del lunes**, en la variable
`mensaje`.

**Mandarlo a varias personas.** En el nodo **Mandar el resumen**, en **Send To**, separa
los correos con coma.

---

## Errores frecuentes

| Qué ves | Por qué pasa | Cómo lo arreglas |
|---|---|---|
| `401 Unauthorized` en el nodo de Alegra | Pusiste tu contraseña de Alegra en vez del token | En la credencial, **Password** va el token. Ver [Obtener tu token](../../OBTENER-TOKEN-ALEGRA.md) |
| `903` en el nodo de Alegra | Alguien cambió el `limit` a más de 30 | Alegra no acepta más de 30 por llamada. Déjalo en 30: el flujo pagina solo |
| La hoja no recibe nada y no hay error | No tienes facturas de proveedor abiertas que venzan en 15 días | Es lo esperado. Sube `DIAS_HACIA_ADELANTE` para ver más |
| `The value "..." is not a valid column` | La primera fila de la hoja no coincide | Compara con la tabla de arriba. `Numero` y `Dias` van **sin tilde** |
| Se duplican las filas cada lunes | La columna `Id en Alegra` no existe o está escrita distinto | Es la llave de coincidencia. Tiene que estar y llamarse igual |
| `Requested entity was not found` en Google Sheets | El `REEMPLAZAR_SPREADSHEET_ID` quedó mal | Copia otra vez el pedazo de la URL entre `/d/` y `/edit` |
| No llega el correo | Quedó el `REEMPLAZAR_CORREO_DESTINO` | Ábrelo en el nodo **Mandar el resumen** y pon tu correo |
| Solo trae 30 facturas | Se borró el bloque de paginación | Vuelve a importar el `workflow.json` |

---

## Límites

- Mira **facturas de proveedor** (`bills`), no gastos sueltos ni nóminas.
- Si no hay nada por vencer, **no manda correo**. El silencio quiere decir que estás al
  día, pero no te avisa de eso.
- La hoja acumula: las facturas que ya pagaste se quedan ahí con el último estado que
  tenían. Si quieres la hoja limpia, bórrala de vez en cuando y deja la primera fila.
- No considera anticipos ni retenciones aplicadas después de la consulta. El `Falta` sale
  del saldo que reporta Alegra.
- Las semanas se cuentan desde hoy, no desde el lunes calendario: "esta semana" son los
  próximos 6 días.

---

## Va bien con

- **[Radar de cartera en Notion](../alegra-receivables-aging-to-notion/)** — lo que te deben, del otro lado de la balanza.
- **[Guardián de facturas duplicadas](../alegra-duplicate-bill-guard/)** — para que no pagues dos veces la misma.
- **[Checklist de cierre de mes](../alegra-month-close-checklist/)** — lo que queda pendiente cuando cierras.
