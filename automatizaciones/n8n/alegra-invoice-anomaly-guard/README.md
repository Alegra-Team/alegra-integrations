# Guardián de anomalías en facturas

**Cada factura de venta que creas o editas pasa por seis revisiones. Si algo no cuadra, te
llega un mensaje. Si todo está bien, no te llega nada.**

Los errores de facturación no se ven el día que pasan: se ven en el cierre, cuando ya hay
que corregir con nota crédito. Un descuento del 60% que alguien puso por afán, un cliente
sin NIT, una factura que vale diez veces lo que ese cliente compra siempre.

Este flujo los ve en el momento.

**No cambia nada en Alegra.** Solo te avisa.

---

## Qué hace

1. Alegra le avisa que creaste o editaste una factura de venta.
2. El flujo le pregunta a Alegra la factura completa. **No confía en lo que le llegó**:
   vuelve a consultar.
3. Trae el historial de facturas de ese cliente, paginando.
4. Aplica seis reglas.
5. Si alguna dispara, te manda un mensaje de Telegram con la lista de lo que encontró.

### Las seis reglas

| # | Qué revisa | Cuándo dispara |
|---|---|---|
| 1 | Identificación del cliente | El cliente no tiene identificación registrada |
| 2 | Descuento | Alguna línea tiene un descuento sobre tu tope (por defecto, 20%) |
| 3 | Monto contra el historial | La factura vale 3 veces o más lo que ese cliente suele comprar |
| 4 | Cliente nuevo | Es su primera factura y ya pasa de $ 5.000.000 |
| 5 | Contenido | La factura no tiene ítems, o quedó en cero |
| 6 | Fechas | La fecha de vencimiento es anterior a la de emisión |

La regla 3 solo se aplica si el cliente ya tiene **al menos 3 facturas anteriores**. Con
menos, un promedio no significa nada. Las facturas anuladas no entran en el promedio, ni
la factura que se está revisando.

## Para quién es

Para el contador o el jefe de facturación. Es el control de calidad que uno haría a mano
si tuviera tiempo de revisar factura por factura.

---

## Qué necesitas

### 1. Una cuenta de n8n accesible desde internet

**Tiene que estar donde Alegra la pueda alcanzar**: n8n Cloud, o n8n instalado en un
servidor con dominio. Si lo tienes solo en tu computador, Alegra no le va a poder avisar y
este flujo no funciona.

Si nunca has usado n8n, empieza por **[Empezar aquí](../../EMPEZAR-AQUI.md)**.

### 2. Dos credenciales en n8n

| Credencial | Tipo en n8n | Nómbrala exactamente | Cómo se saca |
|---|---|---|---|
| Alegra | **Basic Auth** | `Alegra API` | [Obtener tu token de Alegra](../../OBTENER-TOKEN-ALEGRA.md) |
| Telegram | **Telegram API** | `Telegram account` | [Credenciales](../../CREDENCIALES.md#telegram) |

> El nombre importa. Si las llamas distinto, al importar el flujo los nodos te van a
> aparecer sin credencial y tendrás que seleccionarlas a mano.

En la credencial de Alegra:
- **User** → el correo con el que entras a Alegra.
- **Password** → tu **token** de la API. No tu contraseña.

### 3. Tu chat de Telegram

Necesitas el **token del bot** (se lo pides a `@BotFather`) y el **chat id** del lugar
donde quieres el aviso. El paso a paso está en
**[Credenciales](../../CREDENCIALES.md#telegram)**.

**Háblale al bot primero.** Un bot de Telegram no puede escribirte si tú no le has
escrito antes.

---

## Cómo lo pones a correr

1. Descarga **[`workflow.json`](workflow.json)**.
2. En n8n: **Workflows** → **Import from File** → elige el archivo.
3. Abre el nodo **Avisar por Telegram** y reemplaza `REEMPLAZAR_CHAT_ID` por tu chat id.
4. Abre el nodo **Revisar la factura** y ajusta los cuatro umbrales a tu negocio. Los
   valores que trae son un punto de partida, no una recomendación.
5. Revisa que los tres nodos con credencial la tengan seleccionada.
6. **Activa el flujo** con el interruptor de arriba a la derecha. Sin esto la URL de
   producción del webhook no existe.
7. Abre el nodo **Cuando creas o editas una factura** y copia la **Production URL**.
8. Registra esa URL en Alegra **para los dos eventos**: `new-invoice` y `edit-invoice`.
   Son dos registros con la misma URL. El paso a paso, sin terminal, está en
   **[Conectar webhooks de Alegra](../../CONECTAR-WEBHOOKS-ALEGRA.md)**.
9. Crea una factura con un descuento del 50% a propósito y mira que llegue el aviso.

> Si solo quieres el aviso al crear, registra únicamente `new-invoice`. Es lo más común al
> empezar: `edit-invoice` dispara cada vez que alguien toca una factura y puede volverse
> ruidoso.

---

## Las dos URLs del webhook

| Cuál | Cuándo sirve | Para qué la usas |
|---|---|---|
| **Test URL** | Solo mientras tengas la pestaña abierta y le hayas dado **Listen for test event** | Para probar una vez, viendo los datos entrar |
| **Production URL** | Siempre, pero **solo si el flujo está activo** | La que registras en Alegra |

Si registras la de prueba en Alegra, mañana el flujo no dispara y no vas a saber por qué.
**La que va en Alegra es la de producción, y el flujo tiene que quedar activo.**

### La URL es pública

Cualquiera que la adivine puede llamarla. No es tan grave como suena — el flujo solo lee
un id y le vuelve a preguntar a Alegra, así que con un id falso simplemente falla — pero
si quieres bajarle el riesgo, cambia el campo **Path** del nodo por algo menos obvio que
`alegra-factura-venta`. Si lo cambias, vuelve a registrar la URL nueva en Alegra.

No la publiques ni la mandes por chat.

---

## Cómo se ve el resultado

**En Telegram:**

> **Revisa esta factura**
>
> **FV-0450** — Cliente sin datos
> $ 2.000.000 · 2026-08-28 · open
>
> • El cliente no tiene identificación registrada.
> • Descuento del 60% en "Servicio". Tu tope es 20%.
> • Vale 6.5 veces lo que este cliente suele comprar ($ 310.000 en promedio de 4 facturas).
> • La fecha de vencimiento (2026-08-01) es anterior a la de emisión (2026-08-28).
>
> No se cambió nada. Ábrela en Alegra si algo no cuadra.

**Si la factura está bien, no llega nada.** El silencio es la respuesta buena.

---

## Qué escribe en Alegra

**Nada.** Este flujo solo hace dos consultas de lectura: `GET /invoices/:id` y
`GET /invoices?client_id=...`.

---

## Cosas que vas a querer ajustar

En el nodo **Revisar la factura**:

```js
const DESCUENTO_MAXIMO = 20;        // porcentaje de descuento que ya te parece mucho
const VECES_SOBRE_EL_PROMEDIO = 3;  // 3 = avisa si la factura vale 3 veces lo normal
const MINIMO_HISTORIAL = 3;         // facturas anteriores que hacen falta para comparar
const TOPE_CLIENTE_NUEVO = 5000000; // monto alto para un cliente sin historial
const MONEDA = 'COP';
```

**Si te avisa demasiado:** sube `DESCUENTO_MAXIMO` y `VECES_SOBRE_EL_PROMEDIO`.
**Si sientes que se le escapan cosas:** bájalos.

**Quitar una regla.** Cada una es un bloque numerado con su comentario dentro del mismo
nodo. Borra el bloque entero y listo.

**Agregar una regla tuya.** Copia la forma de las que están:
`if (condición) { alertas.push('lo que le vas a decir'); }`

**Avisar por correo en vez de Telegram.** Cambia el nodo **Avisar por Telegram** por uno
de Gmail. El mensaje viene en HTML, así que se ve bien en los dos.

---

## Errores frecuentes

| Qué ves | Por qué pasa | Cómo lo arreglas |
|---|---|---|
| No pasa nada al crear una factura | El webhook no está registrado en Alegra, o registraste la URL de prueba | Ver [Conectar webhooks](../../CONECTAR-WEBHOOKS-ALEGRA.md). Usa la **Production URL** |
| No pasa nada y n8n está en tu computador | Alegra no puede alcanzar tu máquina | Este flujo necesita n8n en la nube o en un servidor con dominio |
| Avisa cada vez que alguien toca una factura | Registraste `edit-invoice` | Es lo esperado. Si molesta, deja solo `new-invoice` |
| `Bad Request: chat not found` en Telegram | El chat id está mal, o nunca le escribiste al bot | Ábrele el chat al bot y mándale un mensaje. Después verifica el chat id |
| `401 Unauthorized` en un nodo de Alegra | Pusiste tu contraseña de Alegra en vez del token | En la credencial, **Password** va el token. Ver [Obtener tu token](../../OBTENER-TOKEN-ALEGRA.md) |
| `No encontré el id de la factura en lo que mandó Alegra` | Llegó algo que no era el evento esperado | Abre la ejecución en n8n: el error trae lo que llegó. Verifica que registraste `new-invoice` |
| Siempre avisa "primera factura de este cliente" | El cliente de verdad no tiene historial, o el monto tope está muy bajo | Sube `TOPE_CLIENTE_NUEVO` |
| Nunca avisa por monto | El cliente no llega a 3 facturas anteriores | Es lo esperado. Baja `MINIMO_HISTORIAL` si quieres comparar antes |

---

## Límites

- Solo revisa **facturas de venta**. Las cotizaciones, remisiones y facturas de proveedor
  no pasan por aquí.
- La regla del monto compara contra el **promedio simple** de las facturas del cliente. Un
  negocio con mucha variación normal va a recibir falsos avisos: súbele
  `VECES_SOBRE_EL_PROMEDIO`.
- No compara el precio de venta contra el costo del ítem. Eso exigiría una consulta más
  por cada línea de la factura.
- Trae hasta 1.200 facturas del cliente para el promedio. Si tienes uno con más, las más
  viejas quedan fuera.
- Con `edit-invoice` registrado, una factura que ya avisaste vuelve a avisar cada vez que
  la editas. **No lleva memoria de lo que ya te dijo.**

---

## Va bien con

- **[Guardián de facturas duplicadas](../alegra-duplicate-bill-guard/)** — el mismo control, pero del lado de las compras.
- **[Radar de cartera en Notion](../alegra-receivables-aging-to-notion/)** — para lo que pasa después de emitir.
- **[Checklist de cierre de mes](../alegra-month-close-checklist/)** — el repaso al final.
