---
name: alegra-tax-and-retentions
description: >
  Te arma el consolidado de IVA y retenciones del período, practicadas y
  recibidas, con el detalle de los documentos que las componen y las
  inconsistencias que conviene revisar antes de declarar.
  Trigger phrases: "cuánto IVA tengo que declarar", "consolidado de retenciones",
  "qué retenciones me practicaron", "retenciones que practiqué", "revisa los
  impuestos antes de declarar", "cuánto IVA generado y descontable",
  "detalle de retenciones del mes".
allowed-tools: mcp__alegra-mcp__reports_get_retentions_report, mcp__alegra-mcp__reports_get_retentions_detail, mcp__alegra-mcp__retentions_getRetentions, mcp__alegra-mcp__taxes_getTaxes, mcp__alegra-mcp__reports_get_general_sales_totals, mcp__alegra-mcp__expenses_list-bills, mcp__alegra-mcp__contacts_getContactByName, mcp__alegra-mcp__currencies_getDefaultCurrency
metadata:
  audiencia: contadores
  requiere: MCP de Alegra conectado (solo consulta)
  grupos-mcp: reports, retentions, taxes, gastos, contacts, currencies
  autor: manuelnarvaez-casadiego
  proposito: Llegar a la declaración con las cifras cuadradas y las dudas resueltas
  fecha: 2026-09-01
  status: beta
---

# Revisión de impuestos y retenciones

## Qué hace por ti

Consolida el IVA generado y descontable del período, y las retenciones en las dos direcciones: las que practicaste y las que te practicaron. Te da el total, el detalle documento por documento y las inconsistencias que suelen aparecer justo antes de declarar.

No llena el formulario. Te deja las cifras listas y revisadas para que lo llenes sin sorpresas.

## Para quién es

Para el contador que prepara declaraciones de IVA y retención en la fuente, propias o de sus clientes.

El momento típico: los días previos al vencimiento, cuando toca cuadrar cifras y hay que saber de dónde salió cada número.

## Qué necesitas

- El [MCP de Alegra conectado](../../../docs/conectar-mcp-alegra.md).
- Grupos habilitados en `mcp-groups`: `reports`, `retentions`, `taxes`, `gastos`, `contacts`, `currencies`.
- Impuestos y retenciones **configurados en Alegra** y aplicados en los documentos. Si la retención se registró como un descuento, no aparece en estos reportes.

## Cómo la usas

Escríbele a tu asistente:

- "¿Cuánto IVA tengo que declarar este bimestre?"
- "Dame el consolidado de retenciones de agosto"
- "¿Qué retenciones me practicaron este mes?"
- "Muéstrame el detalle de retenciones por tercero"
- "Revisa los impuestos antes de declarar"

## Qué te entrega

> **Impuestos y retenciones — agosto de 2026 (COP)**
>
> **IVA**
>
> | Concepto | Base | IVA |
> |---|---|---|
> | IVA generado (ventas) | $40.500.000 | $7.695.000 |
> | IVA descontable (compras) | $29.800.000 | $5.662.000 |
> | **A pagar** | | **$2.033.000** |
>
> **Retenciones practicadas** (las que tú le retuviste a terceros)
>
> | Concepto | Base | Retenido | Documentos |
> |---|---|---|---|
> | Retefuente servicios 4% | $8.400.000 | $336.000 | 14 |
> | Retefuente compras 2,5% | $12.100.000 | $302.500 | 9 |
> | ReteIVA 15% | $2.300.000 | $345.000 | 6 |
> | ReteICA 9,66×1000 | $6.800.000 | $65.688 | 11 |
> | **Total** | | **$1.049.188** | **40** |
>
> **Retenciones recibidas** (las que te practicaron a ti)
>
> | Concepto | Base | Retenido | Documentos |
> |---|---|---|---|
> | Retefuente 2,5% | $18.200.000 | $455.000 | 7 |
> | ReteIVA 15% | $3.458.000 | $518.700 | 4 |
> | **Total** | | **$973.700** | **11** |
>
> **Puntos a revisar antes de declarar**
>
> | Qué | Por qué |
> |---|---|
> | 3 facturas de compra sin retención aplicada, todas por encima de la base | Si el proveedor es sujeto de retención, faltó practicarla |
> | ReteICA con una sola tarifa | Si el cliente opera en varios municipios, la tarifa puede no ser la misma |
> | 2 terceros sin tipo de régimen registrado | Sin eso no se puede validar si aplicaba o no la retención |
>
> **Lo que aprendí de tu período:** las retenciones practicadas superan a las recibidas por $75.488. Es plata que sale, no que se recupera. Vale la pena confirmar que las tres facturas sin retención sean realmente exentas y no un olvido.

## Workflow

1. **Define el período.** IVA suele ser bimestral o cuatrimestral; retención en la fuente, mensual. Si no lo dicen, pregunta o asume el mes anterior y dilo.

2. **Trae la moneda** con `mcp__alegra-mcp__currencies_getDefaultCurrency`.

3. **Identifica el país antes que nada.** Las tools de retenciones **cambian de parámetros según el país** y equivocarse devuelve datos vacíos o incorrectos:

   | País | `type` en el reporte | `type` en el detalle |
   |---|---|---|
   | México | `retentions-in` (recibidas) / `retentions-out` (practicadas) | `retentions-in` / `retentions-out` |
   | Todos los demás | `onSales` (en ventas) / `onPurchases` (en compras) | `sales` / `bills` |

   **No traduzcas estos valores.** Van exactamente así.

4. **Consolidado de retenciones.** Llama `mcp__alegra-mcp__reports_get_retentions_report` con `dateFrom`, `dateTo` y el `type` correcto según la tabla.

   Corre las **dos direcciones**: practicadas y recibidas. Son declaraciones distintas y la gente las confunde.

   En México la respuesta trae `{ success, taxes, retentions }`: usa solo `retentions`.

5. **El detalle.** Llama `mcp__alegra-mcp__reports_get_retentions_detail` con `dateFrom`, `dateTo` y el `type` correspondiente.

   - Fuera de México es **paginado**: `page` (empieza en 1) y `limit` (por defecto 10). Trae varias páginas si hace falta y di cuántos documentos alcanzaste a revisar.
   - En México no pagina y devuelve `{ success, transactions }`.
   - Puedes filtrar por `customerId`, `retentionId`, `documentType` o `documentNumber`.

   El detalle es lo que permite responder "¿de dónde salió este número?" cuando la DIAN o el cliente pregunta.

6. **El catálogo, para validar tarifas.** `mcp__alegra-mcp__retentions_getRetentions` con `status: "ACTIVE"` lista las retenciones configuradas. `mcp__alegra-mcp__taxes_getTaxes` lista los impuestos.

   Sirve para ver si hay retenciones configuradas que nunca se usaron, o tarifas que no corresponden al período.

7. **IVA generado.** Llama `mcp__alegra-mcp__reports_get_general_sales_totals` con `from`, `to` y `groupBy: "month"`. Cada fila trae `beforeTaxes` (base), `tax` (IVA) y `creditNote`.

   **Las notas crédito restan.** Un IVA generado que no descuenta devoluciones queda inflado.

8. **IVA descontable.** Llama `mcp__alegra-mcp__expenses_list-bills` acotando el período con `date_afterOrNow` y `date_beforeOrNow`, con `fields: "totalTaxes,subTotal"` y `limit` hasta 200.

   Suma los impuestos de las compras. Excluye las facturas anuladas (`status` no debe incluir `void`).

9. **Busca las inconsistencias.** Esta es la parte que ahorra el susto:
   - Facturas de compra por encima de la base de retención **sin retención aplicada**
   - Terceros sin tipo de régimen o sin identificación completa
   - Una sola tarifa de ReteICA cuando el cliente opera en varios municipios
   - Retenciones configuradas en el catálogo que nunca se usaron
   - Bases que no cuadran con el valor del documento

   Preséntalas como **puntos a revisar**, no como errores. Muchas tienen explicación legítima.

10. **Cierra con el neto y con lo que hay que decidir.** Cuánto se paga, cuánto se recupera vía retenciones recibidas, y qué falta confirmar antes de presentar.

**Reglas:**

- **Nunca inventes bases, tarifas ni retenciones.** Si un reporte viene vacío, dilo.
- **No llenes formularios ni des asesoría tributaria.** Esta skill consolida y señala; la interpretación normativa y la firma son del contador.
- Separa siempre **practicadas** de **recibidas**. Van a declaraciones distintas.
- Confirma el país antes de correr las tools de retenciones. Un `type` equivocado devuelve vacío y parece que no hay datos.
- Muestra siempre la moneda y las fechas exactas del período.
- Si Alegra no tiene una retención configurada, no aparece. Ausencia de dato no es ausencia de obligación.

## Cómo interpretar los resultados

| Lo que ves | Qué significa | Qué hacer |
|---|---|---|
| Compras sobre la base sin retención | Puede haber faltado practicarla | Verifica el régimen del proveedor antes de asumir el error |
| Practicadas mucho mayores que recibidas | Estás reteniendo más de lo que te retienen | Normal si le compras a pequeños. Solo confírmalo |
| IVA descontable muy alto contra el generado | Compraste más de lo que vendiste, o hay compras mal clasificadas | Revisa que el IVA descontable sea de gastos que dan derecho |
| Una sola tarifa de ReteICA | El municipio se configuró una vez y no se revisó | Confirma dónde operó el cliente en el período |
| Retenciones configuradas sin uso | Catálogo desactualizado | Depúralo para que no se apliquen por error |
| Terceros sin régimen registrado | No se puede validar la retención | Completa la ficha del tercero en Alegra |

## Errores frecuentes

| Síntoma | Causa | Solución |
|---|---|---|
| El reporte viene vacío | El `type` no corresponde al país | Revisa la tabla de `type` por país en el workflow |
| Faltan retenciones que sí aplicaste | Se registraron como descuento, no como retención | Aplica la retención con su concepto en el documento |
| El IVA no coincide con tu papel de trabajo | No estás restando notas crédito | Descuenta `creditNote` del IVA generado |
| El detalle solo trae 10 documentos | Es el límite por página | Pide las páginas siguientes con `page` |
| Las bases no cuadran | Hay documentos en moneda extranjera | Revisa la tasa de cambio de esos documentos |

## Límites

- Esta skill solo lee. No crea, no modifica ni borra nada en tu cuenta de Alegra.
- **No presenta declaraciones ni llena formularios.** Consolida las cifras para que tú lo hagas.
- **No da asesoría tributaria.** No interpreta normas, no decide si algo es gravado o exento, no aplica conceptos de la DIAN.
- Solo ve lo registrado en Alegra. Si una retención no se aplicó en el documento, para la skill no existe.
- El detalle de retenciones se pagina de a 10 documentos fuera de México.
- Los datos salen de tu cuenta de Alegra, pero la interpretación la hace un modelo de IA. **Antes de presentar una declaración, verifica todas las cifras en Alegra.**
