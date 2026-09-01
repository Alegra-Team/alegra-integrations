---
name: alegra-inventory-guard
description: >
  Te dice qué productos tienes que reponer ya, cuáles están quietos ocupando
  plata en la bodega y dónde está cada cosa. Úsala antes de hacer un pedido a
  proveedor o cuando sospeches que tienes inventario muerto.
  Trigger phrases: "qué tengo que reponer", "qué productos se me están acabando",
  "cuánto stock tengo de", "qué inventario está quieto", "cómo está mi bodega",
  "qué productos tengo en cero", "qué me falta pedir".
allowed-tools: mcp__alegra-mcp__itemsStock_get_item_stock, mcp__alegra-mcp__itemsStock_get_item_stock_summary, mcp__alegra-mcp__items_getItems, mcp__alegra-mcp__warehouses_getWarehouses, mcp__alegra-mcp__reports_get_sales_by_item, mcp__alegra-mcp__currencies_getDefaultCurrency
metadata:
  audiencia: pymes
  requiere: MCP de Alegra conectado (solo consulta)
  grupos-mcp: items, reports, currencies
  autor: manuelnarvaez-casadiego
  proposito: Pedir lo que se va a vender y dejar de pedir lo que no rota
  fecha: 2026-09-01
  status: beta
---

# Guardián de inventario

## Qué hace por ti

Cruza lo que tienes en bodega con lo que se está vendiendo. De ahí salen dos listas que importan: **lo que hay que reponer ya** y **lo que está quieto comiéndose tu plata**.

El inventario es plata parada. Esta skill te dice cuál de esa plata está trabajando y cuál no.

## Para quién es

Para el dueño, el de compras o quien maneja la bodega.

El momento típico: antes de hacer el pedido al proveedor, o cuando notas que el depósito está lleno pero siempre falta lo que el cliente pide.

## Qué necesitas

- El [MCP de Alegra conectado](../../../docs/conectar-mcp-alegra.md).
- Grupos habilitados en `mcp-groups`: `items`, `reports`, `currencies`.
- Productos con **control de inventario activado** en Alegra. Un producto tipo servicio no tiene stock que cuidar.

## Cómo la usas

Escríbele a tu asistente:

- "¿Qué productos se me están acabando?"
- "¿Qué tengo que pedirle al proveedor esta semana?"
- "¿Cuánto stock me queda de cemento gris?"
- "¿Qué inventario tengo quieto?"
- "¿Qué productos están en cero o en negativo?"

## Qué te entrega

> **Inventario al 1 de septiembre de 2026**
>
> **Repón ya (5 productos por debajo de 10 unidades)**
>
> | Producto | Stock | Bodega | Vendiste (30 días) | Te dura |
> |---|---|---|---|---|
> | Cemento gris 50kg | 8 | Bodega principal | 420 und | menos de 1 día |
> | Varilla 1/2" | 4 | Bodega principal | 310 und | menos de 1 día |
> | Pintura blanca galón | 9 | Punto de venta | 180 und | 1 día |
> | Tubería PVC 2" | 6 | Bodega principal | 240 und | 1 día |
> | Alambre negro kg | 7 | Bodega principal | 600 und | menos de 1 día |
>
> Los tres primeros son tus productos más vendidos. Si no pides hoy, mañana estás diciendo "no hay".
>
> **En cero (3 productos)**
>
> Silicona transparente, Broca 8mm, Cinta aislante — todos en Bodega principal.
>
> **Stock negativo (1 producto)**
>
> Guantes de carnaza: −12 en Bodega principal. Un stock negativo significa que vendiste algo que el sistema no tenía registrado. Revisa si falta entrar una compra o hay un ajuste pendiente.
>
> **Lo que aprendí de tu bodega:** tienes en cero justo los productos que más vendes, mientras el depósito está lleno. Tu problema no es cuánto inventario tienes, es cuál. Vale la pena poner un punto de reorden a los cinco de arriba.

## Workflow

1. **Trae las bodegas** con `mcp__alegra-mcp__warehouses_getWarehouses` (`status: "active"`). Necesitas los nombres para poder decir dónde está cada cosa.

   **Siempre muestra el nombre de la bodega, nunca el id.** Un id no le dice nada a nadie.

2. **Elige la condición de stock según lo que pidieron.** Llama `mcp__alegra-mcp__itemsStock_get_item_stock_summary` con `stockCondition`:

   | Si preguntan por | Usa |
   |---|---|
   | Qué reponer, qué se está acabando | `LOW_STOCK` (con `stockThreshold` si dieron un número) |
   | Qué está en cero, qué se agotó | `ZERO_STOCK` |
   | Qué está en negativo, qué está descuadrado | `NEGATIVE_STOCK` |
   | Todo lo que hay, panorama general | `CURRENT_STOCK` |

   Si la pregunta es "qué tengo que pedir" sin más contexto, corre `LOW_STOCK` y `ZERO_STOCK`, y presenta las dos listas.

3. **Respeta la paginación.** Máximo 30 registros por llamada (`limit`), con `start` para avanzar.

   - **No traigas más de 2 páginas.** Si `metadata.total` es mayor a lo que trajiste, dilo ("hay 84 productos en esta condición, te muestro los 30 más relevantes").
   - Si una página viene vacía pero `metadata.total` es mayor a cero, pasa a la siguiente sin comentarlo. Son productos borrados que el reporte filtra.

4. **Un producto puntual** se consulta con `mcp__alegra-mcp__itemsStock_get_item_stock` usando el `itemId`. Para encontrar el id, busca antes con `mcp__alegra-mcp__items_getItems` usando `query` o `reference`.

   Esta tool acepta `documentDate`: sirve para responder "¿cuánto tenía a fin del mes pasado?".

5. **Cruza con la venta.** Aquí está el valor real de la skill. Llama `mcp__alegra-mcp__reports_get_sales_by_item` con los últimos 30 días y `optionalParams: {order_field: "totalItems", order_direction: "DESC"}`.

   Con eso calculas **cuánto le dura** cada producto: stock actual dividido por la venta diaria promedio (unidades vendidas ÷ 30).

   Un producto con 8 unidades que vende 400 al mes es una urgencia. Un producto con 8 unidades que vende 2 al mes no es nada.

6. **Ordena por urgencia, no por cantidad.** Primero lo que se acaba antes, no lo que tiene menos unidades. Presenta máximo 10 productos por lista.

7. **Marca el inventario quieto.** Si un producto tiene stock y **no aparece** en el reporte de ventas del período, es plata parada. Dilo como un bloque aparte.

8. **Explica el stock negativo.** No es un error de la skill: significa que se facturó una salida sin que la entrada estuviera registrada. La causa casi siempre es una compra sin registrar o un ajuste de inventario pendiente.

9. **Cierra con el patrón.** Si lo que falta es justo lo que más vende, si el depósito está lleno de lo que no rota, si una bodega concentra todos los faltantes: eso es lo accionable.

**Reglas:**

- **Nunca inventes cantidades ni productos.** Si el reporte viene vacío, dilo.
- Siempre el nombre de la bodega, nunca el id.
- Si un producto está en varias bodegas, muestra el desglose. El total sirve para comprar, el desglose sirve para vender.
- No recomiendes cuánto pedir en unidades exactas si no conoces el tiempo de entrega del proveedor. Di cuánto le dura y deja la decisión.
- No confundas "stock cero" con "producto sin control de inventario". Si el producto no maneja stock, no aparece en estos reportes y eso es normal.

## Cómo interpretar los resultados

| Lo que ves | Qué significa | Qué hacer |
|---|---|---|
| Tus más vendidos en stock bajo | Vas a perder ventas esta semana | Pide hoy. Es el faltante que más caro te sale |
| Mucho stock de lo que no rota | Plata parada en la bodega | Promoción, descuento o dejar de reponerlo |
| Stock negativo | Vendiste algo que el sistema no tenía | Registra la compra o el ajuste de inventario que falta |
| Todo concentrado en una bodega | El punto de venta se queda sin nada que mostrar | Revisa las transferencias entre bodegas |
| Muchos productos en cero | Te estás quedando corto sistemáticamente | Sube el punto de reorden de los que más rotan |
| Stock alto y ventas altas | Estás abasteciendo bien | Sano. Solo vigila que no crezca más rápido que la venta |

## Errores frecuentes

| Síntoma | Causa | Solución |
|---|---|---|
| Un producto no aparece | No tiene control de inventario activado en Alegra | Actívalo en la ficha del producto si quieres seguirle el stock |
| El stock no coincide con la bodega física | Faltan compras, ajustes o transferencias por registrar | Haz un conteo físico y registra el ajuste en Alegra |
| Solo muestra 30 productos | Es el máximo por consulta | Pídele que filtre por bodega o por condición de stock |
| Aparecen filas sin nombre | Son productos borrados o entradas contables | El reporte los excluye solo. No es un error |
| No calcula cuánto le dura | No hay ventas en el período que consultó | Pídele que mire un período más largo |

## Límites

- Esta skill solo lee. No crea, no modifica ni borra nada en tu cuenta de Alegra.
- No hace pedidos ni genera órdenes de compra. Te dice qué pedir; pedirlo lo haces tú.
- No conoce los tiempos de entrega de tus proveedores ni tus cantidades mínimas de pedido.
- Trae máximo 30 productos por consulta de stock y 10 por consulta de ventas.
- El stock que ve es el registrado en Alegra. Si tu bodega física no coincide, el problema no es la skill.
- Los datos salen de tu cuenta de Alegra, pero la interpretación la hace un modelo de IA. Antes de un pedido grande, verifica en Alegra.
