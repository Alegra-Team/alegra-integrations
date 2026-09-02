# Registrar un webhook de Alegra

**Flujo auxiliar.** No hace nada por sí solo: sirve para conectar otros flujos con Alegra.

Tres de las automatizaciones se disparan cuando pasa algo en Alegra —una factura nueva, un
cliente nuevo—. Para que eso funcione hay que decirle a Alegra a qué dirección avisar, y
eso hoy solo se hace por API. Este flujo te evita abrir una terminal: llenas un formulario
y listo.

**No lo actives.** Se usa a mano, una vez por cada flujo que quieras conectar.

---

## Cómo se usa

1. Descarga **[`workflow.json`](workflow.json)** e impórtalo en n8n.
2. Abre el nodo **Registrar en Alegra** y selecciona tu credencial `Alegra API`.
   Si no la tienes, ve a [Obtener tu token de Alegra](../../OBTENER-TOKEN-ALEGRA.md).
3. **Activa primero el flujo que quieres conectar** (el guardián de duplicados, por
   ejemplo). Sin activarlo no existe su dirección de producción.
4. En ese flujo, abre el nodo del webhook y copia la **Production URL**.
5. Vuelve a este flujo y dale a **Execute Workflow**. n8n te abre un formulario.
6. Pega la dirección, elige el evento y envía.

El formulario te responde si quedó registrado o qué falló, en español.

El paso a paso con capturas y las dudas frecuentes está en
**[Conectar los webhooks de Alegra](../../CONECTAR-WEBHOOKS-ALEGRA.md)**.

---

## Qué evento usa cada flujo

| Flujo | Evento |
|---|---|
| [Bienvenida a un cliente nuevo](../alegra-new-client-onboarding/) | `new-client` |
| [Guardián de facturas duplicadas](../alegra-duplicate-bill-guard/) | `new-bill` |
| [Guardián de anomalías en facturas](../alegra-invoice-anomaly-guard/) | `new-invoice` **y** `edit-invoice` |

El guardián de anomalías necesita **dos** registros, uno por cada evento, apuntando a la
misma dirección. Corre este flujo dos veces.

## Los 12 eventos disponibles

Alegra avisa de cuatro cosas, en tres momentos cada una:

| | Se creó | Se editó | Se borró |
|---|---|---|---|
| Factura de venta | `new-invoice` | `edit-invoice` | `delete-invoice` |
| Factura de proveedor | `new-bill` | `edit-bill` | `delete-bill` |
| Contacto | `new-client` | `edit-client` | `delete-client` |
| Producto o servicio | `new-item` | `edit-item` | `delete-item` |

No hay eventos de pagos, cotizaciones ni nómina. Para eso se usan los flujos por horario.

---

## Qué necesitas

| Credencial | Tipo en n8n | Nómbrala exactamente |
|---|---|---|
| Alegra | **Basic Auth** | `Alegra API` |

Y algo que no es una credencial pero es igual de necesario: **tu n8n tiene que ser
alcanzable desde internet**. Alegra le va a hacer una llamada a tu dirección, y si n8n
está corriendo solo en tu computador (`localhost`), no la puede alcanzar. n8n Cloud sirve
de una; si lo tienes instalado, necesita un dominio público.

---

## Qué escribe en Alegra

Hace un `POST /webhooks/subscriptions` con dos datos: el evento y la dirección. **No toca
tu contabilidad.** Solo registra a dónde avisar.

Para dejar de recibir avisos hay que borrar la suscripción, y eso no lo hace este flujo.

---

## Errores frecuentes

| Qué ves | Por qué pasa | Cómo lo arreglas |
|---|---|---|
| `Esa es la URL de prueba` | Copiaste la de la pestaña **Test URL** | Usa la de **Production URL**. La de prueba solo vive mientras tienes el flujo abierto escuchando |
| `Esa URL no parece la de un webhook de n8n` | Pegaste la del editor, no la del webhook | La correcta lleva `/webhook/` en la mitad y sale del nodo del webhook |
| `La credencial de Alegra no sirvió` | Pusiste tu contraseña en vez del token | En la credencial, **Password** va el token. Ver [Obtener tu token](../../OBTENER-TOKEN-ALEGRA.md) |
| `Alegra no lo aceptó` | Ya habías registrado ese evento con esa misma dirección | Alegra no acepta duplicados. Si ya lo tenías, está bien: no hagas nada |
| Quedó registrado pero el flujo nunca se dispara | El flujo destino no está activo, o n8n no es alcanzable desde internet | Actívalo y confirma que tu n8n tiene dirección pública |

---

## Límites

- Solo registra. No lista lo que ya tienes registrado ni borra suscripciones.
- No hay forma de saber desde aquí qué webhooks tienes activos. Si tienes dudas, vuelve a
  registrar el mismo: si Alegra lo rechaza, es que ya estaba.
- La dirección de producción de un flujo cambia si cambias el `path` del nodo del webhook.
  Si lo cambias, toca registrar la nueva.
