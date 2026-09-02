# Guardián de facturas duplicadas

**Cada vez que registras una factura de proveedor, te avisa por Telegram si ya habías
registrado una igual.**

La misma factura entra dos veces más seguido de lo que uno cree: llega por correo y por
WhatsApp, la registra el auxiliar y después la registras tú, o el proveedor la reenvía con
otro número. Cuando te das cuenta, ya la pagaste dos veces.

Este flujo te avisa en el momento, no en el cierre de mes.

**No borra ni cambia nada en Alegra.** Solo te avisa.

---

## Qué hace

1. Alegra le avisa que registraste una factura de proveedor.
2. El flujo le pregunta a Alegra la factura completa. **No confía en lo que le llegó**:
   vuelve a consultar.
3. Trae **todas** las facturas de ese mismo proveedor, paginando.
4. Busca coincidencias con dos reglas.
5. Si encuentra alguna, te manda un mensaje de Telegram con los datos de las dos.

### Las dos reglas

| Regla | Qué revisa |
|---|---|
| **Mismo número** | Otra factura del mismo proveedor con el mismo número. Compara ignorando guiones, espacios y mayúsculas: `FC 001` y `fc-001` son la misma |
| **Mismo monto, fechas cercanas** | Otra del mismo proveedor por el mismo valor (±1%) registrada dentro de 5 días |

Las facturas **anuladas no cuentan**. Tampoco se compara consigo misma.

## Para quién es

Para el contador o quien registra las compras. Es el control que uno hace de memoria y se
le olvida cuando hay afán.

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

Necesitas dos cosas: el **token del bot** (se lo pides a `@BotFather`) y el **chat id**
del lugar donde quieres el aviso. Las dos están en
**[Credenciales](../../CREDENCIALES.md#telegram)**, con el paso a paso.

**Háblale al bot primero.** Un bot de Telegram no puede escribirte si tú no le has
escrito antes. Abre el chat con tu bot y mándale cualquier cosa.

---

## Cómo lo pones a correr

1. Descarga **[`workflow.json`](workflow.json)**.
2. En n8n: **Workflows** → **Import from File** → elige el archivo.
3. Abre el nodo **Avisar por Telegram** y reemplaza `REEMPLAZAR_CHAT_ID` por tu chat id.
4. Revisa que los tres nodos con credencial la tengan seleccionada.
5. **Activa el flujo** con el interruptor de arriba a la derecha. Sin esto la URL de
   producción del webhook no existe.
6. Abre el nodo **Cuando registras una factura de proveedor** y copia la
   **Production URL**.
7. Registra esa URL en Alegra para el evento `new-bill`. El paso a paso, sin terminal,
   está en **[Conectar webhooks de Alegra](../../CONECTAR-WEBHOOKS-ALEGRA.md)**.
8. Registra en Alegra una factura de proveedor que ya exista, a propósito, y mira que
   llegue el aviso.

---

## Las dos URLs del webhook

Aquí es donde todo el mundo se estrella, así que va con detalle.

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
`alegra-factura-proveedor-nueva`. Si lo cambias, vuelve a registrar la URL nueva en
Alegra.

No la publiques ni la mandes por chat.

---

## Cómo se ve el resultado

**En Telegram:**

> **Ojo: esta factura ya estaba**
>
> Acabas de registrar **FC-1023** de **Distribuidora El Progreso**
> por $ 1.450.000, con fecha 2026-08-28.
>
> Se parece a estas 2:
> • **FC1023** del 2026-03-01 por $ 300.000 — tiene el mismo número
> • **FC-0600** del 2026-08-29 por $ 1.450.000 — tiene el mismo monto y se registró con 1 día de diferencia
>
> No se borró nada. Entra a Alegra y decide cuál dejas.

Cuando la coincidencia es solo por monto, el título cambia a **"Revisa esta factura antes
de pagarla"**, que es menos alarmante.

**Si no se parece a ninguna, no llega nada.** El silencio es la respuesta buena.

---

## Qué escribe en Alegra

**Nada.** Este flujo solo hace dos consultas de lectura: `GET /bills/:id` y
`GET /bills?client_id=...`.

---

## Cosas que vas a querer ajustar

En el nodo **Buscar coincidencias**:

```js
const DIAS_DE_MARGEN = 5;        // ventana para buscar el mismo monto
const TOLERANCIA_MONTO = 0.01;   // 0.01 = 1% de diferencia todavía cuenta como igual
const MONEDA = 'COP';
```

Si te está avisando demasiado, baja `DIAS_DE_MARGEN` a 2 o pon `TOLERANCIA_MONTO` en 0
para exigir el monto exacto.

**Avisar por correo en vez de Telegram.** Cambia el nodo **Avisar por Telegram** por uno
de Gmail. El mensaje viene en HTML, así que se ve bien en los dos.

**Avisar también en otro canal.** El nodo **¿Se parece a alguna?** tiene una salida
libre: conecta ahí un segundo nodo y te llega por los dos lados.

---

## Errores frecuentes

| Qué ves | Por qué pasa | Cómo lo arreglas |
|---|---|---|
| No pasa nada al registrar una factura | El webhook no está registrado en Alegra, o registraste la URL de prueba | Ver [Conectar webhooks](../../CONECTAR-WEBHOOKS-ALEGRA.md). Usa la **Production URL** |
| No pasa nada y n8n está en tu computador | Alegra no puede alcanzar tu máquina | Este flujo necesita n8n en la nube o en un servidor con dominio |
| `Bad Request: chat not found` en Telegram | El chat id está mal, o nunca le escribiste al bot | Ábrele el chat al bot y mándale un mensaje. Después verifica el chat id |
| `Forbidden: bot was blocked by the user` | Bloqueaste el bot | Desbloquéalo desde Telegram |
| `401 Unauthorized` en un nodo de Alegra | Pusiste tu contraseña de Alegra en vez del token | En la credencial, **Password** va el token. Ver [Obtener tu token](../../OBTENER-TOKEN-ALEGRA.md) |
| `No encontré el id de la factura en lo que mandó Alegra` | Llegó algo que no era el evento esperado | Abre la ejecución en n8n: el error trae lo que llegó. Verifica que registraste `new-bill` |
| `La factura ... no trae proveedor` | La factura quedó sin proveedor en Alegra | Complétala en Alegra. Sin proveedor no hay con qué comparar |
| Avisa por facturas que no son duplicadas | Los umbrales están muy amplios | Baja `DIAS_DE_MARGEN` y `TOLERANCIA_MONTO` |
| Se registró dos veces el mismo evento | Alegra rechaza duplicados de evento + URL | No pasa nada, el segundo registro simplemente no se crea |

---

## Límites

- Solo compara contra facturas **del mismo proveedor**. Si la misma factura la registraste
  con dos proveedores distintos (por ejemplo, uno duplicado en tu lista de contactos), no
  la detecta.
- Solo se dispara con facturas **creadas**. Si editas una vieja y la dejas igual a otra,
  no pasa nada.
- Trae hasta 1.200 facturas del proveedor. Si tienes uno con más, las más viejas quedan
  fuera de la comparación.
- No revisa los ítems de la factura, solo número, monto y fecha.
- **No borra nada.** La decisión es tuya, siempre.

---

## Va bien con

- **[Calendario de pagos a proveedores](../alegra-payables-calendar/)** — para no pagar lo que este flujo marcó.
- **[Guardián de anomalías en facturas](../alegra-invoice-anomaly-guard/)** — el mismo control, pero del lado de las ventas.
