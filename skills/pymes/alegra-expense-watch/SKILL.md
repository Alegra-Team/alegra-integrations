---
name: alegra-expense-watch
description: >
  Te dice cuánto le debes a cada proveedor, qué facturas se vencen esta semana y
  en qué se te está yendo la plata. Úsala antes de programar pagos o cuando los
  gastos crecieron y no sabes por qué.
  Trigger phrases: "cuánto le debo a mis proveedores", "qué tengo que pagar esta
  semana", "en qué se me va la plata", "cuánto gasté este mes", "qué facturas de
  compra están vencidas", "cuánto le debo a", "qué pagos tengo pendientes".
allowed-tools: mcp__alegra-mcp__reports_get_payables, mcp__alegra-mcp__reports_get_payables_summary, mcp__alegra-mcp__expenses_list-bills, mcp__alegra-mcp__expenses_list-purchase-orders, mcp__alegra-mcp__expenses_list-outgoing-payments, mcp__alegra-mcp__contacts_getContactByName, mcp__alegra-mcp__currencies_getDefaultCurrency
metadata:
  audiencia: pymes
  requiere: MCP de Alegra conectado (solo consulta)
  grupos-mcp: reports, gastos, contacts, currencies
  autor: manuelnarvaez-casadiego
  proposito: Programar pagos sabiendo qué es urgente y qué puede esperar
  fecha: 2026-09-01
  status: beta
---

# Control de gastos

## Qué hace por ti

Te arma el mapa de lo que debes: cuánto, a quién y para cuándo. Y te dice en qué se está yendo la plata, para que veas si el gasto creció por algo puntual o porque se te soltó la mano.

Es la otra mitad de la caja. Sin esto, saber cuánto tienes no te dice si te alcanza.

## Para quién es

Para el dueño, el administrador o quien programa los pagos.

El momento típico: cuando te sientas a decidir qué pagar esta semana, o cuando ves que la plata se fue y no sabes en qué.

## Qué necesitas

- El [MCP de Alegra conectado](../../../docs/conectar-mcp-alegra.md).
- Grupos habilitados en `mcp-groups`: `reports`, `gastos`, `contacts`, `currencies`.
- Facturas de compra con **fecha de vencimiento** registrada. Sin eso no hay urgencia que ordenar.

## Cómo la usas

Escríbele a tu asistente:

- "¿Qué tengo que pagar esta semana?"
- "¿Cuánto le debo a mis proveedores?"
- "¿Cuánto le debo a Distribuciones del Sur?"
- "¿En qué se me fue la plata este mes?"
- "¿Qué facturas de compra ya están vencidas?"

## Qué te entrega

> **Cuentas por pagar al 1 de septiembre de 2026 (COP)**
>
> Debes **$9.700.000** en 11 facturas. De eso, **$3.400.000 ya están vencidos**.
>
> **Se vence esta semana**
>
> | Proveedor | Factura | Monto | Vence | Estado |
> |---|---|---|---|---|
> | Distribuciones del Sur | FC-8821 | $2.100.000 | 28 ago | Vencida hace 4 días |
> | Cementos del Caribe | FC-9014 | $1.300.000 | 30 ago | Vencida hace 2 días |
> | Transportes Rápido | FC-9102 | $840.000 | 3 sep | En 2 días |
> | Papelería Central | FC-9110 | $320.000 | 5 sep | En 4 días |
>
> Con **$4.560.000** cubres todo lo que se vence esta semana, incluido lo atrasado.
>
> **A quién le debes más**
>
> | Proveedor | Total | Facturas |
> |---|---|---|
> | Distribuciones del Sur | $4.200.000 | 4 |
> | Cementos del Caribe | $2.900.000 | 3 |
> | Transportes Rápido | $1.400.000 | 2 |
>
> **Lo que aprendí de tus cuentas:** el 73% de lo que debes está en dos proveedores. Eso te da poder de negociación —son tus clientes más grandes vistos al revés—. Vale la pena pedirles plazo o descuento por pronto pago.

## Workflow

1. **Fecha de corte.** Hoy por defecto. Si piden otra, úsala y dilo.

2. **Trae la moneda** con `mcp__alegra-mcp__currencies_getDefaultCurrency`.

3. **El total primero.** Llama `mcp__alegra-mcp__reports_get_payables_summary` con `asOf` = fecha de corte. Devuelve `missingAmount` (lo que debes) y `totalDocuments` (cuántas facturas).

4. **El detalle.** Llama `mcp__alegra-mcp__reports_get_payables` con `asOf`. Cada fila trae `billNumber`, `supplierName`, `missingAmount`, `totalPayed`, `total`, `date`, `dueDate`, `phone`.

   - **Devuelve máximo 20 facturas y no hay forma de pedir la página siguiente desde el MCP.** Compara con `metadata.total`: si hay más, dilo ("te muestro 20 de 34"). Para ver el resto, filtra por proveedor con `customerId`.

5. **Calcula la urgencia** de cada factura: `dueDate` menos la fecha de corte.
   - Negativo → **vencida**. Va de primera y di cuántos días lleva.
   - De 0 a 7 días → **esta semana**.
   - Más de 7 días → **puede esperar**.

   Presenta los tres bloques por separado. Meter todo en una sola lista es lo que hace que uno pague lo que no era.

6. **Agrupa por proveedor.** Cuatro facturas del mismo proveedor son **un** pago, no cuatro. Suma y muestra el consolidado.

7. **Di cuánto necesitas.** Suma lo vencido más lo de esta semana. Ese número —"con $4.560.000 quedas al día"— es lo que convierte la lista en una decisión.

8. **Si preguntan en qué se les fue la plata**, llama `mcp__alegra-mcp__expenses_list-bills` acotando el período con `date_afterOrNow` (desde) y `date_beforeOrNow` (hasta), más `order_field: "date"` y `limit` hasta 200.

   Agrupa por proveedor y compara contra el período anterior. Un gasto que creció es una pregunta; un gasto nuevo que apareció es otra.

9. **Si preguntan por un proveedor puntual**, resuelve su id con `mcp__alegra-mcp__contacts_getContactByName` y vuelve a llamar `reports_get_payables` con `customerId`. También puedes filtrar directo con `provider_name` en `expenses_list-bills`.

10. **Órdenes de compra, solo si preguntan por compromisos futuros.** `mcp__alegra-mcp__expenses_list-purchase-orders` con `status` abierto muestra lo que ya te comprometiste a comprar pero aún no te han facturado. Es plata que va a salir aunque todavía no aparezca como deuda.

11. **Pagos ya hechos.** `mcp__alegra-mcp__expenses_list-outgoing-payments` con `from` y `to` responde "¿cuánto salió este mes?". Máximo 30 registros.

12. **Cierra con el patrón.** Concentración en pocos proveedores, gastos que crecen más rápido que las ventas, facturas que siempre se pagan tarde: eso es lo accionable.

**Reglas:**

- **Nunca inventes montos, proveedores ni fechas.** Si el reporte viene vacío, di que no hay cuentas por pagar registradas.
- Muestra siempre la moneda y la fecha de corte.
- **`missingAmount` es lo que debes.** `total` es el valor original de la factura. No los confundas.
- No recomiendes dejar de pagar algo. Muestra el orden y el monto; la decisión de a quién pagar primero tiene contexto que la skill no ve.
- Si una factura está vencida hace mucho, dilo sin dramatizar. Puede ser un acuerdo que no está registrado.

## Cómo interpretar los resultados

| Lo que ves | Qué significa | Qué hacer |
|---|---|---|
| Mucha deuda concentrada en 2 o 3 proveedores | Tienes poder de negociación | Pide plazo o descuento por pronto pago |
| Facturas vencidas hace más de 30 días | Tu relación con ese proveedor se está desgastando | Llama antes de que te corten el crédito o el despacho |
| Gastos creciendo más rápido que las ventas | El margen se está apretando | Cruza con el [Chequeo de rentabilidad](../alegra-profit-check/) |
| Todo se vence el mismo día del mes | Tus vencimientos están apilados | Negocia fechas escalonadas para no ahogar la caja |
| Muchas facturas pequeñas de proveedores distintos | Estás comprando disperso | Consolida proveedores y negocia mejor precio |
| Órdenes de compra abiertas grandes | Ya te comprometiste con plata que aún no aparece como deuda | Tenlo en cuenta antes de comprometer más |

## Errores frecuentes

| Síntoma | Causa | Solución |
|---|---|---|
| Aparece una factura que ya pagaste | El pago no está registrado en Alegra | Registra el pago y vuelve a consultar |
| Solo ves 20 facturas | Es el máximo del reporte y no tiene página siguiente | Filtra por proveedor para ver el resto |
| No calcula urgencia | Las facturas de compra no tienen fecha de vencimiento | Registra el plazo al cargar la factura del proveedor |
| Los montos no cuadran | Confundiste `total` con `missingAmount` | Lo que debes es `missingAmount` |
| No aparecen gastos menores | Van como gastos, no como facturas de compra | Pídele que mire los pagos de salida del período |

## Límites

- Esta skill solo lee. No crea, no modifica ni borra nada en tu cuenta de Alegra.
- **No paga nada ni programa pagos.** Te dice qué pagar; pagarlo lo haces tú.
- El reporte de cuentas por pagar trae máximo 20 facturas y no permite paginar. Filtra por proveedor si necesitas más.
- No sabe de acuerdos hechos por fuera de Alegra. Si negociaste un plazo por teléfono y no lo registraste, la skill no lo sabe.
- No clasifica gastos por categoría contable. Agrupa por proveedor, que es lo que sirve para pagar.
- Los datos salen de tu cuenta de Alegra, pero la interpretación la hace un modelo de IA. Antes de programar pagos, verifica en Alegra.
