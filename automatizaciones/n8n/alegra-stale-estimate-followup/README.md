# Seguimiento a cotizaciones frías

**Cada lunes te dice qué cotizaciones mandaste y nadie contestó. Y te deja convertir
cualquiera en factura sin salir del navegador.**

Una cotización que lleva tres semanas sin respuesta no está perdida: está esperando que
la llames. El problema es que nadie las tiene en una lista. Este flujo te la arma solo.

Trae dos cosas en un mismo archivo:

- **Cada lunes a las 8:00** te llega un correo con las cotizaciones que llevan más de 15
  días sin convertirse en factura, ordenadas de mayor a menor plata.
- **Un formulario** al que entras cuando el cliente por fin te dice que sí. Escribes el
  número de la cotización y te queda la factura **en borrador** en Alegra.

**Nada se emite solo.** La factura queda en borrador. Tú entras a Alegra, la revisas y la
emites.

---

## Qué hace

**La rama de arriba (cada lunes):**

1. Pide a Alegra todas las cotizaciones abiertas, paginando.
2. Descarta las que ya generaron factura.
3. Se queda con las de más de 15 días.
4. Las ordena por monto y te manda el correo. Si no hay ninguna fría, **no te manda nada**.

**La rama de abajo (el formulario):**

1. Escribes el número de la cotización.
2. El flujo la busca en Alegra y saca su cliente y sus líneas.
3. Arma la factura y la crea con `POST /invoices` en estado **borrador**.
4. La misma página del formulario te dice cómo quedó.

## Para quién es

Para ti si cotizas antes de vender: obras, servicios, mayoreo, cualquier cosa con
propuesta de por medio. Es el flujo que convierte "se me olvidó llamar a ese cliente" en
una lista de lunes por la mañana.

---

## Qué necesitas

### 1. Una cuenta de n8n

En la nube o instalada en tu computador. Si nunca has usado n8n, empieza por
**[Empezar aquí](../../EMPEZAR-AQUI.md)**.

### 2. Dos credenciales en n8n

| Credencial | Tipo en n8n | Nómbrala exactamente | Cómo se saca |
|---|---|---|---|
| Alegra | **Basic Auth** | `Alegra API` | [Obtener tu token de Alegra](../../OBTENER-TOKEN-ALEGRA.md) |
| Gmail | **Gmail OAuth2** | `Gmail account` | [Credenciales](../../CREDENCIALES.md#gmail) |

> El nombre importa. Si las llamas distinto, al importar el flujo los nodos te van a
> aparecer sin credencial y tendrás que seleccionarlas a mano.

En la credencial de Alegra:
- **User** → el correo con el que entras a Alegra.
- **Password** → tu **token** de la API. No tu contraseña.

### 3. Un correo donde recibir la lista

Cualquiera al que tengas acceso. Va en el nodo **Enviar la lista**.

---

## Cómo lo pones a correr

1. Descarga **[`workflow.json`](workflow.json)**.
2. En n8n: **Workflows** → **Import from File** → elige el archivo.
3. Abre el nodo **Enviar la lista** y reemplaza `REEMPLAZAR_CORREO_DESTINO` por tu correo.
4. Revisa que los tres nodos con credencial la tengan seleccionada.
5. Dale a **Test workflow**. Corre la rama de los lunes y te manda el correo con lo que
   tengas frío hoy. **Esta rama no escribe nada en Alegra**, así que puedes correrla las
   veces que quieras.
6. Cuando te cuadre, activa el flujo con el interruptor de arriba a la derecha.

Desde ahí la lista te llega sola cada lunes a las 8:00.

**El formulario necesita un paso más**, porque sí escribe en Alegra. Está abajo.

---

## El formulario: dos URLs, no una

Esta es la parte donde todo el mundo se estrella, así que va con detalle.

El nodo **Convertir una cotización** te da **dos direcciones distintas**:

| Cuál | Cuándo sirve | Dónde la ves |
|---|---|---|
| **Test URL** | Solo mientras tengas la pestaña de n8n abierta y le hayas dado **Test workflow** | En el nodo, pestaña **Parameters** |
| **Production URL** | Siempre, pero **solo si el flujo está activo** | En el mismo sitio, cuando el flujo ya está activo |

Si abres la de producción con el flujo apagado, la página no carga. Si guardas la de
prueba en favoritos, mañana no te va a servir. **La que guardas es la de producción**, y
el flujo tiene que quedar activo.

### Estrena el formulario en seco

El nodo **Crear la factura borrador** viene **desactivado a propósito**. Con él
desactivado, n8n deja pasar los datos sin llamar a Alegra, y la página del formulario te
responde:

> **Prueba en seco**
>
> No se creó nada en Alegra porque el nodo "Crear la factura borrador" está desactivado.
> Si lo activas, la cotización COT-101 de Ferretería La 45 se convertiría en una factura
> borrador de $1.800.000 con 2 línea(s).

Prueba con dos o tres cotizaciones reales. Cuando los montos y las líneas te den, clic
derecho en **Crear la factura borrador** → **Activate**. Desde ahí sí crea.

Ya activado, la respuesta cambia a:

> **Listo**
>
> La factura FV-2010 de Ferretería La 45 por $1.740.000 quedó creada en Alegra como
> borrador. Revísala allá y emítela cuando quieras.

---

## Cómo se ve el correo de los lunes

> **3 cotizaciones se están enfriando**
>
> Tienes **3 cotización(es)** que llevan más de 15 días sin convertirse en factura, por un
> total de **$7.650.000**.
>
> | | | | |
> |---|---|---|---|
> | COT-102 | Distribuidora El Progreso | **$4.800.000** | hace 22 días |
> | COT-101 | Ferretería La 45 | **$2.500.000** | hace 40 días |
> | COT-106 | Panadería El Trigal | **$350.000** | hace 16 días |
>
> Empieza por la de arriba: es la que más plata te representa.
>
> Para convertir una en factura borrador, abre el formulario de este mismo flujo y escribe
> su número.

Si hay una sola, el asunto dice **"Una cotización se está enfriando: COT-107"**.
Si no hay ninguna, **no te llega correo**. El silencio es la buena noticia.

---

## Qué escribe en Alegra

**Crea facturas en estado borrador, y solo cuando tú llenas el formulario.** La rama de
los lunes no escribe nada.

El cuerpo exacto que le manda a Alegra sale del nodo **Armar la factura desde la
cotización**, en el campo `factura`:

```json
{
  "client": { "id": "10" },
  "date": "2026-09-02",
  "dueDate": "2026-10-02",
  "status": "draft",
  "paymentForm": "CREDIT",
  "paymentMethod": "CASH",
  "items": [
    { "id": "1", "name": "Arriendo local", "price": 1200000, "quantity": 1 },
    { "id": "2", "name": "Administración", "price": 300000, "quantity": 2, "discount": 10, "tax": { "id": "3" } }
  ],
  "anotation": "Creada desde la cotización COT-101. Queda en borrador."
}
```

`"status": "draft"` es lo que garantiza que quede en borrador. **No lo cambies a `open`**
si quieres seguir revisando antes de emitir.

Los descuentos y los impuestos que traiga la cotización se copian tal cual. Las líneas sin
producto, con precio en cero o con cantidad en cero se dejan por fuera.

El nodo tiene los reintentos automáticos apagados a propósito. Un reintento sobre una
factura ya creada te dejaría dos.

**La cotización no se marca ni se cierra.** Alegra no tiene una acción para eso desde la
API, así que si quieres dejarla en "aceptada", entras y la cambias tú.

---

## Cosas que vas a querer ajustar

En el nodo **Buscar las frías**:

```js
const DIAS_PARA_ENFRIARSE = 15;   // desde cuántos días sin respuesta te avisa
const MONTO_MINIMO = 0;           // ignora las cotizaciones por debajo de este monto
const MONEDA = 'COP';
```

Si cotizas mucho y de a poquito, sube `MONTO_MINIMO` para que la lista no se llene de
cosas de $50.000.

En el nodo **Armar la factura desde la cotización**:

```js
const FORMA_DE_PAGO = 'CREDIT';   // CREDIT = le das plazo. CASH = paga de contado
const METODO_DE_PAGO = 'CASH';
const DIAS_PARA_PAGAR = 30;       // plazo de la factura que se crea
```

**El día y la hora.** Nodo `Cada lunes a las 8:00`. Es una expresión cron: `0 8 * * 1`.
El `1` es lunes; el `8`, la hora. Para los viernes a las 5 de la tarde: `0 17 * * 5`.

**El texto del correo.** Está en el nodo `Buscar las frías`.

---

## Errores frecuentes

| Qué ves | Por qué pasa | Cómo lo arreglas |
|---|---|---|
| `401 Unauthorized` en un nodo de Alegra | Pusiste tu contraseña de Alegra en vez del token | En la credencial, **Password** va el token. Ver [Obtener tu token](../../OBTENER-TOKEN-ALEGRA.md) |
| No llegó correo el lunes | No tenías ninguna cotización fría | Es lo esperado. El flujo calla cuando no hay nada |
| La página del formulario no carga | Estás usando la URL de producción con el flujo apagado | Activa el flujo, o usa la Test URL con **Test workflow** corriendo |
| La respuesta dice "Prueba en seco" | El nodo de creación sigue desactivado | Es lo esperado la primera vez. Clic derecho → **Activate** |
| `No encontré ninguna cotización con el número X` | Lo escribiste distinto a como está en Alegra | Cópialo tal cual, con prefijo y ceros. `COT-0042`, no `42` |
| `La cotización X no tiene un cliente asociado` | Se guardó sin cliente en Alegra | Ábrela en Alegra, asígnale el cliente y vuelve a intentar |
| `La cotización X no tiene ítems que se puedan facturar` | Sus líneas no tienen producto o van en cero | Revisa las líneas en Alegra |
| Una cotización ya convertida sigue apareciendo | Tu cuenta no está devolviendo el detalle de facturas de la cotización | El flujo prefiere avisarte de más antes que dejarte perder una venta. Súbele `DIAS_PARA_ENFRIARSE` |
| `error 903` de Alegra | Alguien subió el `limit` por encima de 30 | Déjalo en 30. Es el máximo que acepta Alegra |

---

## Límites

- Mira solo las cotizaciones en estado **abierto**. Las que ya rechazaste no aparecen.
- Para saber si una cotización se convirtió, se apoya en el detalle de facturas que Alegra
  devuelve con `fields=invoices`. Si tu cuenta no lo devuelve, el flujo la trata como no
  convertida: te avisa de más, nunca de menos.
- El formulario convierte **una cotización a la vez**. No sabe hacer lotes.
- Copia el precio de la cotización, no de la lista de precios de Alegra. Si subiste
  precios desde que cotizaste, la factura sale con el precio viejo — que suele ser lo
  correcto, porque es lo que le prometiste al cliente.
- No aplica retenciones. Si las necesitas, agrégalas a mano al borrador.
- Hasta 1.200 cotizaciones revisadas por corrida. Si manejas más, sube `maxRequests` en
  `Traer cotizaciones abiertas`.
- Las facturas quedan en borrador. Emitirlas sigue siendo tuyo, a propósito.

---

## Va bien con

- **[Facturación recurrente del mes](../alegra-monthly-recurring-billing-run/)** — para los clientes que ya te compran fijo.
- **[Recordatorios de cobro](../alegra-overdue-invoice-reminders/)** — para cobrar lo que emitiste.
