# Alerta de reposición

**Cada mañana te dice qué se te va a acabar, antes de que se acabe.**

Revisa tu inventario en Alegra, lo cruza con lo que vendiste el último mes y calcula
cuántos días te alcanza cada producto al ritmo al que se está vendiendo. Arma el tablero
en Notion y, si hay algo crítico, te manda un solo mensaje por Telegram.

---

## Qué hace

1. Trae **todos** tus productos con inventario, no solo los primeros 30.
2. Trae las facturas de los últimos 30 días y cuenta cuántas unidades salieron de cada producto.
3. Divide lo que te queda entre lo que vendes al día. Eso son los **días de cobertura**.
4. Clasifica cada producto: **Agotado**, **Crítico** (te alcanza para 7 días o menos) o **Bajo** (por debajo del mínimo).
5. Escribe una fila por producto en tu base de Notion, lo más urgente arriba.
6. Si hay algo agotado o crítico, te manda un mensaje por Telegram. Si no hay nada, no te escribe.

También calcula **cuánto pedir** de cada uno y **cuánto te va a costar** reponerlo.

## Para quién es

Para ti si vendes producto físico y te has quedado sin existencias sin darte cuenta.
No tienes que acordarte de revisar el inventario: te llega.

---

## Qué necesitas

### 1. Una cuenta de n8n

En la nube o instalada en tu computador. Si nunca has usado n8n, empieza por
**[Empezar aquí](../../EMPEZAR-AQUI.md)**.

### 2. Tres credenciales en n8n

| Credencial | Tipo en n8n | Nómbrala exactamente | Cómo se saca |
|---|---|---|---|
| Alegra | **Basic Auth** | `Alegra API` | [Obtener tu token de Alegra](../../OBTENER-TOKEN-ALEGRA.md) |
| Notion | **Notion API** | `Notion account` | [Credenciales](../../CREDENCIALES.md#notion) |
| Telegram | **Telegram API** | `Telegram account` | [Credenciales](../../CREDENCIALES.md#telegram) |

> El nombre importa. Si las llamas distinto, al importar el flujo los nodos te van a
> aparecer sin credencial y tendrás que seleccionarlas a mano.

En la credencial de Alegra:
- **User** → el correo con el que entras a Alegra.
- **Password** → tu **token** de la API. No tu contraseña.

### 3. Una base de datos en Notion

Créala con estas columnas. El nombre y el tipo tienen que coincidir **exactamente**:

| Columna | Tipo |
|---|---|
| Producto | Title |
| Disponible | Number |
| Mínimo | Number |
| Sugerido pedir | Number |
| Vendido 30 días | Number |
| Días de cobertura | Number |
| Costo de reposición | Number |
| Estado | Select — con las opciones `Agotado`, `Crítico`, `Bajo` |
| Bodega | Text |
| Fecha de corte | Date |

**Comparte la base con tu integración de Notion.** Es el paso que todo el mundo olvida:
botón `···` arriba a la derecha → **Connections** → busca tu integración. Sin eso el
flujo falla con un error 404 que no explica nada.

### 4. Tu chat de Telegram

Necesitas el **chat ID** al que quieres que te escriba el bot. Está explicado en
[Credenciales](../../CREDENCIALES.md#telegram); son dos minutos.

---

## Cómo lo pones a correr

1. Descarga **[`workflow.json`](workflow.json)**.
2. En n8n: **Workflows** → **Import from File** → elige el archivo.
3. Abre el nodo **Guardar en Notion** y reemplaza `REEMPLAZAR_DATABASE_ID` por el id de
   tu base. Es el pedazo largo de la URL de Notion, entre la última barra y el `?`.
4. Abre el nodo **Avisar por Telegram** y reemplaza `REEMPLAZAR_CHAT_ID` por tu chat ID.
5. Revisa que los tres nodos con credencial la tengan seleccionada.
6. Dale a **Test workflow** para verlo correr una vez con tus datos reales.
7. Si te gusta cómo quedó, activa el flujo con el interruptor de arriba a la derecha.

Desde ahí corre solo, todos los días a las 6:30. Para cambiar la hora, abre el nodo
**Cada día a las 6:30**.

---

## Si tus productos no tienen mínimo configurado

Es lo más común, y conviene que lo sepas antes de correrlo: en Alegra el campo de
**stock mínimo** se configura por bodega y **casi nunca está diligenciado**. Llega vacío.

El flujo no se rompe por eso. Hace dos cosas:

- Cuando el producto no tiene mínimo, usa el número que pongas en `MINIMO_POR_DEFECTO`
  (viene en 5), dentro del nodo **Calcular qué reponer**.
- Y calcula los **días de cobertura**, que salen de cruzar lo que te queda con lo que
  vendiste el último mes. **Esa señal no depende de que hayas configurado nada**, y es la
  que de verdad te sirve.

Si un producto se vende rápido, aparece como Crítico aunque nunca le hayas puesto mínimo.
Si quieres afinar, ponle el mínimo real a tus productos en Alegra y el flujo lo usa
automáticamente en la siguiente corrida. La columna **Mínimo** en Notion te dice cuál
está usando.

---

## Cómo se ve el resultado

En Notion, ordenado por urgencia:

| Producto | Disponible | Mínimo | Sugerido pedir | Vendido 30 días | Días de cobertura | Costo de reposición | Estado |
|---|---|---|---|---|---|---|---|
| Tornillo 3/8 | 0 | 5 | 10 | 10 | 0 | 5.000 | Agotado |
| Cemento 50kg | 4 | 5 | 86 | 90 | 1 | 1.892.000 | Crítico |
| Martillo | 3 | 10 | 7 | 3 | 30 | 126.000 | Bajo |

Y en Telegram, un solo mensaje con lo urgente:

> **Tienes 1 producto(s) agotado(s)**
>
> • **Tornillo 3/8** — quedan 0, te alcanza para 0 día(s). Pedir 10 ($ 5.000)
> • **Cemento 50kg** — quedan 4, te alcanza para 1 día(s). Pedir 86 ($ 1.892.000)
>
> Reponer todo esto te cuesta cerca de $ 1.897.000.

Los productos en estado **Bajo** aparecen en Notion pero no en Telegram. La idea es que
el mensaje solo te interrumpa cuando de verdad hay que moverse.

---

## Cómo leer cada columna

**Días de cobertura.** Cuántos días te alcanza lo que tienes, si sigues vendiendo al
ritmo del último mes. Si dice vacío es que no vendiste nada de ese producto en 30 días.

**Sugerido pedir.** El mayor de dos números: lo que falta para llegar al mínimo, o lo que
necesitas para cubrir los próximos 30 días de venta. Nunca menos de 1.

**Costo de reposición.** El sugerido multiplicado por el costo unitario que tienes en
Alegra. Es un estimado para que sepas de cuánta plata estás hablando antes de llamar al
proveedor.

---

## Qué escribe en Alegra

**Nada.** Este flujo solo lee. No ajusta inventario, no crea órdenes de compra, no toca
tus productos.

Lo único que crea son filas en tu Notion y mensajes en tu Telegram.

---

## Cosas que vas a querer ajustar

Todo está arriba del nodo **Calcular qué reponer**, en el bloque marcado:

```js
const MINIMO_POR_DEFECTO = 5;    // se usa cuando el producto no tiene mínimo en Alegra
const DIAS_DE_VENTA = 30;        // ventana para medir qué tan rápido se vende
const COBERTURA_CRITICA = 7;     // por debajo de estos días, es crítico
const DIAS_A_CUBRIR = 30;        // para cuántos días quieres pedir
const MONEDA = 'COP';            // solo afecta cómo se ve la plata
```

**Si vendes cosas de rotación lenta**, sube `COBERTURA_CRITICA` a 15 o 20. Te va a avisar
con más anticipación.

**Si compras al proveedor cada 15 días**, baja `DIAS_A_CUBRIR` a 15 para no
sobreabastecerte.

**La ventana de ventas.** `DIAS_DE_VENTA` tiene que ir de la mano con el nodo **Traer
ventas del último mes**: si lo cambias a 60, cambia también ahí el `days: 30` por
`days: 60`.

**La hora.** Nodo `Cada día a las 6:30`.

**La moneda.** Cámbiala en `Calcular qué reponer` y también en `Armar el aviso`, que tiene
su propia línea `const MONEDA`.

**Solo un almacén.** Si manejas varias bodegas y solo te importa una, abre el nodo `Traer
productos con inventario` y agrega un parámetro `idWarehouse` con el id de esa bodega.

---

## Errores frecuentes

| Qué ves | Por qué pasa | Cómo lo arreglas |
|---|---|---|
| `401 Unauthorized` en un nodo de Alegra | Pusiste tu contraseña de Alegra en vez del token | En la credencial, **Password** va el token. Ver [Obtener tu token](../../OBTENER-TOKEN-ALEGRA.md) |
| `404` en el nodo de Notion | No compartiste la base con la integración | En Notion: `···` → **Connections** → agrega tu integración |
| `Could not find property` en Notion | El nombre de una columna no coincide | Cópialos tal cual de la tabla de arriba, con tildes |
| No llegó nada por Telegram | No había nada agotado ni crítico | Es lo esperado. Mira Notion, ahí sí está todo |
| El bot de Telegram no responde | No le has escrito primero | Abre el chat con tu bot y mándale cualquier mensaje. Telegram no deja que un bot escriba primero |
| Todos los productos dicen mínimo 5 | Ninguno tiene mínimo configurado en Alegra | Es normal. Ver la sección de arriba |
| La columna Días de cobertura sale vacía en todo | No hubo ventas en 30 días, o las facturas no traen el detalle de productos | El flujo sigue sirviendo con el mínimo. Revisa que sí tengas facturas del último mes |
| `error 903` de Alegra | Alguien subió el `limit` por encima de 30 | Déjalo en 30. Es el máximo que acepta Alegra |
| Se repiten las filas en Notion | Crea filas nuevas cada corrida | Es a propósito, para que veas el histórico. Filtra por **Fecha de corte** en tu vista de Notion |

---

## Límites

- Solo lee de Alegra. Lo único que escribe son filas en tu Notion y mensajes en tu Telegram.
- Los servicios y todo lo que no maneje inventario quedan por fuera. Es intencional.
- Hasta 1.200 productos y 1.200 facturas por corrida con la configuración que viene. Si
  tienes más, sube `maxRequests` en los dos nodos que traen datos de Alegra.
- Los días de cobertura asumen que vas a seguir vendiendo igual que el último mes. En
  temporada alta te va a quedar corto.
- El mensaje de Telegram lista máximo 20 productos. El resto está en Notion.
- Crea filas nuevas cada día; no actualiza las de ayer.

---

## Va bien con

- **[Radar de cartera en Notion](../alegra-receivables-aging-to-notion/)** — el mismo tablero, pero para lo que te deben.
- **[Recordatorios de cobro](../alegra-overdue-invoice-reminders/)** — para cobrar la plata con la que vas a reponer.
