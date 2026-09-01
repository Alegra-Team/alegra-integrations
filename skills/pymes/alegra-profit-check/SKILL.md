---
name: alegra-profit-check
description: >
  Te dice qué productos te dejan plata de verdad y cuáles se te comen el margen,
  cruzando lo que vendes contra lo que te cuesta. Úsala cuando vendas mucho pero
  no veas la ganancia, o antes de subir precios o dar un descuento.
  Trigger phrases: "qué producto me deja más plata", "cuál es mi margen", "por qué
  vendo mucho y no gano", "cuánto estoy perdiendo en descuentos", "qué productos
  no son rentables", "cómo va mi utilidad", "cuánto gano por producto".
allowed-tools: mcp__alegra-mcp__reports_get_profitability_by_product, mcp__alegra-mcp__reports_get_profitability_by_product_totals, mcp__alegra-mcp__reports_get_profit_and_loss, mcp__alegra-mcp__reports_get_sales_by_discount, mcp__alegra-mcp__currencies_getDefaultCurrency
metadata:
  audiencia: pymes
  requiere: MCP de Alegra conectado (solo consulta)
  grupos-mcp: reports, currencies
  autor: manuelnarvaez-casadiego
  proposito: Saber cuál de todo lo que vendes te deja plata de verdad
  fecha: 2026-09-01
  status: beta
---

# Chequeo de rentabilidad

## Qué hace por ti

Responde la pregunta más incómoda de un negocio: *vendo bastante, ¿por qué no me queda?*

Cruza la venta contra el costo producto por producto, te muestra el margen real de cada uno y te señala dónde se está yendo la ganancia: en un producto que vendes barato, en descuentos que se volvieron costumbre, o en gastos que crecieron más que las ventas.

## Para quién es

Para el dueño o el gerente. Quien decide precios, descuentos y qué vale la pena seguir vendiendo.

El momento típico: cuando cierras un buen mes de ventas y la cuenta bancaria no lo refleja. O antes de subirle el precio a algo.

## Qué necesitas

- El [MCP de Alegra conectado](../../../docs/conectar-mcp-alegra.md).
- Grupos habilitados en `mcp-groups`: `reports`, `currencies`.
- Productos con **costo registrado** en Alegra. Sin costo no hay margen que calcular: el reporte te va a mostrar 100% de utilidad, que es mentira.

## Cómo la usas

Escríbele a tu asistente:

- "¿Qué producto me deja más plata?"
- "¿Por qué vendo mucho y no me queda nada?"
- "¿Cuál es mi margen este mes?"
- "¿Cuánto estoy perdiendo en descuentos?"
- "¿Qué productos no me son rentables?"

## Qué te entrega

> **Rentabilidad de agosto de 2026 (COP)**
>
> Vendiste **$40.500.000** y te costó **$29.800.000**. Te quedó una utilidad bruta de **$10.700.000**: un margen del **26%**.
>
> **Dónde está la ganancia**
>
> | Producto | Venta | Costo | Utilidad | Margen |
> |---|---|---|---|---|
> | Pintura blanca galón | $5.400.000 | $2.900.000 | $2.500.000 | 46% |
> | Alambre negro kg | $3.000.000 | $1.900.000 | $1.100.000 | 37% |
> | Tubería PVC 2" | $4.800.000 | $3.400.000 | $1.400.000 | 29% |
> | Cemento gris 50kg | $12.600.000 | $10.900.000 | $1.700.000 | 13% |
> | Varilla 1/2" | $9.300.000 | $8.500.000 | $800.000 | 9% |
>
> **Aquí está tu problema:** el cemento y la varilla son el 54% de tus ventas y solo el 23% de tu ganancia. La pintura vende cinco veces menos y te deja casi lo mismo.
>
> **Descuentos:** diste **$1.900.000** en descuentos sobre 38 facturas. Eso es el 18% de tu utilidad bruta del mes, regalado.
>
> **Lo que aprendí de tu mes:** estás usando tu bodega y tu plata para mover producto pesado de margen bajo. No es que esté mal —jala clientes—, pero si le subes un 3% al cemento recuperas más que todo lo que te deja la pintura. Vale la pena revisar ese precio.

## Workflow

1. **Define el período.** Si no lo dicen, usa el mes actual. Dilo siempre.

2. **Trae la moneda** con `mcp__alegra-mcp__currencies_getDefaultCurrency`.

3. **El total primero.** Llama `mcp__alegra-mcp__reports_get_profitability_by_product_totals` con `from` y `to`. Devuelve `totalSold` (venta), `totalCost` (costo) y `profit` (utilidad).

   Calcula el **margen bruto**: `profit / totalSold × 100`. Ese es el número que resume el mes.

4. **El detalle por producto.** Llama `mcp__alegra-mcp__reports_get_profitability_by_product`. Cada fila trae `totalSold`, `totalCost`, `profit` y `profitPercentage`.

   - **Máximo 10 productos por llamada.** Usa `start` para paginar.
   - **Esta tool no ordena por margen ni por utilidad.** Solo por `itemName` o `reference`. Así que trae 2 o 3 páginas y **ordena tú** por lo que importe: utilidad en pesos para saber dónde está la plata, margen porcentual para saber dónde está el problema.
   - Di cuántos productos alcanzaste a mirar. No presentes 20 productos como si fueran todo el catálogo.

5. **Separa las dos preguntas.** Son distintas y la gente las confunde:
   - **Utilidad en pesos**: qué producto aporta más plata al negocio. Manda el volumen.
   - **Margen porcentual**: qué producto es más eficiente. Manda el precio.

   Un producto puede ser el número 1 en pesos y el último en margen. Eso es exactamente lo que hay que señalar.

6. **Descuentos.** Llama `mcp__alegra-mcp__reports_get_sales_by_discount` con `dateFrom` y `dateTo`. Devuelve `totalDiscount` y `totalDocuments`, más las facturas ordenadas de mayor a menor descuento.

   Compara el descuento total contra la utilidad bruta. Ese porcentaje es la frase que le cambia el día a alguien: *"regalaste el 18% de tu ganancia"*.

   Si `truncated` viene en `true`, hay más facturas con descuento de las que trajiste. Sube el `limit` (máximo 100) o dilo.

7. **Solo si preguntan por la utilidad final**, llama `mcp__alegra-mcp__reports_get_profit_and_loss` con `from`, `to` y `periodsToCompareCount: 1`. El margen bruto no es la ganancia: faltan los gastos de operación.

   Usa `comparisonType: "years"`, que es la opción más confiable. Presenta las cuentas grandes, no el árbol completo.

8. **Cierra con la palanca.** No basta con decir cuál margen es bajo. Di qué mueve la aguja: subir un precio, dejar de descontar, negociar un costo, o dejar de vender algo. Un dato de rentabilidad que no termina en una decisión de precio no sirvió.

**Reglas:**

- **Si un producto muestra 100% de margen, casi siempre es que no tiene costo registrado.** Dilo en vez de celebrarlo.
- **Si un producto muestra margen negativo**, avisa fuerte: estás vendiendo por debajo del costo.
- Nunca inventes costos ni márgenes.
- Aclara siempre si hablas de **utilidad bruta** (venta − costo) o **utilidad neta** (después de gastos). No son lo mismo y confundirlas lleva a decisiones malas.
- Muestra siempre la moneda y el período.
- No des consejo de precios como si conocieras el mercado. Muestra el número y la palanca; el precio lo pone quien conoce a sus clientes.

## Cómo interpretar los resultados

| Lo que ves | Qué significa | Qué hacer |
|---|---|---|
| Tu producto estrella tiene margen bajo | Estás moviendo volumen sin ganar | Sube el precio poco a poco o negocia el costo con tu proveedor |
| Un producto con margen negativo | Vendes por debajo del costo | Revisa el precio hoy, o el costo está mal cargado |
| Margen alto en algo que vende poco | Ahí hay espacio para crecer | Empújalo. Cada venta extra rinde el doble |
| Descuentos por encima del 10% de la utilidad | Los descuentos dejaron de ser excepción | Pon un tope y quién puede autorizarlos |
| Margen bruto bueno pero utilidad neta baja | El problema no son los productos, son los gastos | Mira el [Control de gastos](../alegra-expense-watch/) |
| Margen del 100% en varios productos | No tienen costo cargado en Alegra | Carga los costos. Sin eso el reporte no sirve |

## Errores frecuentes

| Síntoma | Causa | Solución |
|---|---|---|
| Todos los márgenes dan 100% | Los productos no tienen costo registrado | Registra el costo de cada producto en Alegra |
| El margen varía mucho mes a mes | El costo cambió o el método de costeo promedia distinto | Revisa las compras del período en Alegra |
| Solo ve 10 productos | Es el máximo por consulta | Pídele que traiga la siguiente página, o que filtre por nombre |
| No coincide con tu Estado de Resultados | La rentabilidad por producto es utilidad **bruta**, sin gastos | Para la utilidad final pide el Estado de Resultados |
| Los descuentos se ven muy bajos | Diste el descuento bajando el precio unitario, no como descuento | Registra los descuentos como descuento para poder medirlos |

## Límites

- Esta skill solo lee. No crea, no modifica ni borra nada en tu cuenta de Alegra.
- No cambia precios ni costos. Te muestra el número; la decisión es tuya.
- Trae máximo 10 productos por consulta de rentabilidad y 100 facturas con descuento.
- El margen depende de que los costos estén bien cargados en Alegra. Basura entra, basura sale.
- No reparte los gastos de operación entre productos. Para eso hace falta un costeo que Alegra no calcula solo.
- Los datos salen de tu cuenta de Alegra, pero la interpretación la hace un modelo de IA. Antes de cambiar precios, verifica en Alegra.
