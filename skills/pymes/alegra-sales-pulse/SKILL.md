---
name: alegra-sales-pulse
description: >
  Te dice cómo van las ventas comparadas con el período anterior, qué se está
  vendiendo, quién te está comprando y cuánto vale tu venta promedio. Úsala
  cuando quieras saber si el mes va bien o mal, y por qué.
  Trigger phrases: "cómo van las ventas", "cuánto vendí este mes", "qué es lo que
  más se vende", "cuáles son mis mejores clientes", "cómo vamos contra el mes
  pasado", "cuál es mi ticket promedio", "por qué bajaron las ventas".
allowed-tools: mcp__alegra-mcp__reports_get_general_sales_totals, mcp__alegra-mcp__reports_get_sales_by_item, mcp__alegra-mcp__reports_get_sales_by_item_totals, mcp__alegra-mcp__reports_get_sales_by_client, mcp__alegra-mcp__reports_get_sales_by_client_totals, mcp__alegra-mcp__reports_get_sales_by_seller, mcp__alegra-mcp__currencies_getDefaultCurrency
metadata:
  audiencia: pymes
  requiere: MCP de Alegra conectado (solo consulta)
  grupos-mcp: reports, currencies
  autor: manuelnarvaez-casadiego
  proposito: Saber si el mes va bien o mal, y sobre todo por qué
  fecha: 2026-09-01
  status: beta
---

# Pulso de ventas

## Qué hace por ti

Te da el número de ventas del período **con su comparación** contra el período anterior. Y después te dice qué lo explica: qué producto jaló, qué cliente dejó de comprar, si vendiste más veces o simplemente más caro.

Un total de ventas solo te dice cuánto. Esta skill te dice por qué.

## Para quién es

Para el dueño, el gerente comercial o quien responde por la meta del mes.

El momento típico: a mitad de mes, cuando quieres saber si vas a llegar; o el primer día del mes, para entender qué pasó con el anterior.

## Qué necesitas

- El [MCP de Alegra conectado](../../../docs/conectar-mcp-alegra.md).
- Grupos habilitados en `mcp-groups`: `reports`, `currencies`.
- Para el análisis por vendedor, necesitas tener vendedores asignados a las facturas en Alegra.

## Cómo la usas

Escríbele a tu asistente:

- "¿Cómo van las ventas este mes?"
- "¿Cuánto vendí en agosto contra julio?"
- "¿Cuáles son mis 10 productos más vendidos del trimestre?"
- "¿Quiénes son mis mejores clientes este año?"
- "¿Por qué bajaron las ventas?"

## Qué te entrega

> **Ventas de agosto de 2026 (COP)**
>
> Vendiste **$48.200.000**, un **12% más** que julio ($43.100.000).
>
> | | Agosto | Julio | Cambio |
> |---|---|---|---|
> | Ventas (sin IVA) | $40.500.000 | $36.200.000 | +12% |
> | Facturas | 132 | 141 | −6% |
> | Ticket promedio | $365.000 | $306.000 | +19% |
> | Descuentos | $1.900.000 | $980.000 | +94% |
>
> **Lo que jaló:** vendiste **menos veces pero más caro**. El ticket promedio subió 19%. Eso normalmente es bueno, pero ojo: los descuentos casi se duplicaron, así que parte de esa venta grande la estás pagando tú.
>
> **Top 5 productos**
>
> | Producto | Unidades | Venta |
> |---|---|---|
> | Cemento gris 50kg | 420 | $12.600.000 |
> | Varilla 1/2" | 310 | $9.300.000 |
> | Pintura blanca galón | 180 | $5.400.000 |
> | Tubería PVC 2" | 240 | $4.800.000 |
> | Alambre negro kg | 600 | $3.000.000 |
>
> **Top 3 clientes**
>
> | Cliente | Compras | Facturas |
> |---|---|---|
> | Constructora del Valle | $8.900.000 | 12 |
> | Ferretería La 45 | $6.100.000 | 22 |
> | Almacén Central | $4.300.000 | 9 |
>
> **Lo que aprendí de tu mes:** el 40% de tus ventas está en dos productos de construcción pesada. Si a Constructora del Valle se le acaba la obra, se te cae un quinto del mes. Vale la pena mirar qué otro cliente puede comprar ese mismo cemento.

## Workflow

1. **Define el período.** Si la persona no lo dice, usa el mes actual hasta hoy. Dilo siempre en la respuesta ("agosto de 2026, del 1 al 31").

   Calcula también el **período anterior comparable**: mismo número de días, período inmediatamente anterior. Si comparas un mes en curso, compara contra los mismos días del mes pasado, no contra el mes completo.

2. **Trae la moneda** con `mcp__alegra-mcp__currencies_getDefaultCurrency`.

3. **Totales del período.** Llama `mcp__alegra-mcp__reports_get_general_sales_totals` con `from`, `to` y `groupBy`:
   - `day` si el período es un mes o menos
   - `month` si son varios meses
   - `year` si son varios años

   Cada fila trae `beforeTaxes`, `tax`, `total`, `discount`, `creditNote`.

   - **Suma las filas** para el total del período.
   - **`creditNote` resta.** Son devoluciones. La venta neta es `total` menos `creditNote`.

4. **Repite la llamada para el período anterior** y calcula la variación porcentual. Sin comparación no hay pulso, solo un número suelto.

5. **Calcula el ticket promedio**: venta neta dividida por el número de facturas. Compáralo también. Es lo que distingue "vendí más porque vinieron más clientes" de "vendí más porque cada uno compró más".

6. **Top productos.** Llama `mcp__alegra-mcp__reports_get_sales_by_item` con `from`, `to` y `optionalParams: {order_field: "total", order_direction: "DESC"}`.

   - **Máximo 10 productos por llamada.** Si necesitas más, usa `start` para paginar.
   - Para el total general de productos, usa `mcp__alegra-mcp__reports_get_sales_by_item_totals`.

7. **Top clientes.** Llama `mcp__alegra-mcp__reports_get_sales_by_client` con `order_field: "total"`, `order_direction: "DESC"`. Aquí `order_field` y `order_direction` van **al nivel de arriba**, no dentro de `optionalParams`. También máximo 10.

8. **Vendedores, solo si los tiene.** Llama `mcp__alegra-mcp__reports_get_sales_by_seller`. Si viene vacío, no lo menciones: significa que no asigna vendedor a las facturas y sacar el tema no le sirve de nada.

9. **Explica el movimiento.** No dejes la variación sin causa. Mira, en este orden:
   - ¿Cambió el número de facturas o el ticket promedio? (volumen vs. valor)
   - ¿Hay un producto que explica buena parte del cambio?
   - ¿Hay un cliente que compró mucho más o mucho menos?
   - ¿Subieron los descuentos? ¿Subieron las notas crédito?

10. **Cierra con lo que se puede hacer algo.** Concentración en pocos clientes, un producto que se está apagando, descuentos que se comen el crecimiento. Un dato que no cambia una decisión no vale la pena decirlo.

**Reglas:**

- Nunca inventes cifras. Si un reporte viene vacío, dilo.
- Muestra siempre la moneda y las fechas exactas del período.
- Distingue **venta antes de impuestos** (`beforeTaxes`) de **venta total** (`total`). Para comparar desempeño usa `beforeTaxes`: el IVA no es tuyo.
- Cuando un porcentaje salga de una base muy pequeña, dilo. "Subió 300%" sobre $200.000 no es una noticia.
- Si el período aún está en curso, avisa que el número no está cerrado.

## Cómo interpretar los resultados

| Lo que ves | Qué significa | Qué hacer |
|---|---|---|
| Ventas suben, ticket promedio sube, facturas bajan | Vendes menos veces pero más grande | Sano si el margen aguanta. Revisa que no sea un solo cliente grande |
| Ventas suben, ticket promedio baja | Estás creciendo por volumen | Revisa que el costo de atender cada venta no se te coma la ganancia |
| Ventas planas, descuentos subiendo | Estás comprando la venta | Revisa la política de descuentos antes de que sea costumbre |
| Un cliente con más del 20% de tus ventas | Riesgo de concentración | Si se va, se te cae el mes. Diversifica antes de necesitarlo |
| Notas crédito subiendo | Devoluciones o errores de facturación | Averigua si es calidad, despacho o facturación mal hecha |
| Top de productos siempre igual | Tu catálogo largo no está vendiendo | Mira qué productos no rotan y decide si vale la pena tenerlos |

## Errores frecuentes

| Síntoma | Causa | Solución |
|---|---|---|
| Los totales no cuadran con lo que esperabas | Estás comparando `total` (con IVA) contra un número tuyo sin IVA | Usa `beforeTaxes` para desempeño comercial |
| Solo muestra 10 productos o 10 clientes | Es el máximo por consulta | Pídele la siguiente página, o que filtre por nombre de producto |
| El mes en curso se ve muy por debajo | Estás comparando 15 días contra un mes completo | Pídele que compare períodos del mismo número de días |
| No aparecen vendedores | Las facturas no tienen vendedor asignado en Alegra | Asigna vendedor al facturar si quieres medir por persona |
| Las ventas se ven infladas | No está restando notas crédito | Pídele la venta neta, descontando `creditNote` |

## Límites

- Esta skill solo lee. No crea, no modifica ni borra nada en tu cuenta de Alegra.
- Trae máximo 10 productos y 10 clientes por consulta.
- No proyecta ventas futuras ni pone metas. Te muestra lo que pasó y por qué.
- No sabe de márgenes. Para saber qué producto deja plata de verdad, usa el [Chequeo de rentabilidad](../alegra-profit-check/).
- Solo ve lo facturado en Alegra. Ventas por fuera del sistema no existen para esta skill.
- Los datos salen de tu cuenta de Alegra, pero la interpretación la hace un modelo de IA. Antes de una decisión comercial grande, verifica en Alegra.
