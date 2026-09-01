---
name: alegra-cash-radar
description: >
  Te dice cuánta plata tienes hoy en caja y bancos, cuánta entró y salió en el
  período, y cuánto tienes por cobrar y por pagar. Úsala cuando necesites decidir
  un pago, una compra o una inversión sin abrir Alegra ni cuadrar nada a mano.
  Trigger phrases: "cómo está mi caja", "cuánta plata tengo", "cómo va el flujo
  de caja", "me alcanza para pagar la nómina", "cuánto entró y cuánto salió este
  mes", "cuál es mi saldo en bancos", "puedo hacer esta compra".
allowed-tools: mcp__alegra-mcp__reports_get_cash_flow, mcp__alegra-mcp__banks_getBanks, mcp__alegra-mcp__banks_getTransactions, mcp__alegra-mcp__reports_get_receivables_summary, mcp__alegra-mcp__reports_get_payables_summary, mcp__alegra-mcp__currencies_getDefaultCurrency
metadata:
  audiencia: pymes
  requiere: MCP de Alegra conectado (solo consulta)
  grupos-mcp: reports, banks, currencies
  autor: manuelnarvaez-casadiego
  proposito: Decidir pagos y compras con la caja real a la vista, en 30 segundos
  fecha: 2026-09-01
  status: beta
---

# Radar de caja

## Qué hace por ti

Te da la foto completa de tu plata en una sola respuesta: cuánto tienes hoy en caja y bancos, cuánto entró y cuánto salió en el período, y cuánto está pendiente de entrar y de salir.

Es la pregunta que te haces antes de cada decisión de plata — *"¿me alcanza?"* — respondida con tus datos reales en lugar de con tu intuición.

## Para quién es

Para quien tiene un negocio y decide sobre la plata: dueño, gerente o administrador.

El momento típico es el lunes en la mañana, o justo antes de comprometerse con un pago grande, una compra de inventario o una contratación.

## Qué necesitas

- El [MCP de Alegra conectado](../../../docs/conectar-mcp-alegra.md).
- Grupos habilitados en `mcp-groups`: `reports`, `banks`, `currencies`.
- Tener tus cuentas de banco y efectivo registradas en Alegra, con los movimientos al día. Si no registras los pagos, el radar te va a mostrar más plata de la que tienes.

## Cómo la usas

Escríbele a tu asistente:

- "¿Cómo está mi caja este mes?"
- "¿Cuánta plata tengo disponible hoy?"
- "¿Me alcanza para pagar la nómina de este mes?"
- "¿Cuánto entró y cuánto salió en agosto?"
- "Compárame el flujo de caja de este mes contra el pasado"

## Qué te entrega

> **Radar de caja — 1 al 31 de agosto de 2026 (COP)**
>
> **Tienes hoy: $18.400.000**
>
> | Cuenta | Tipo | Saldo |
> |---|---|---|
> | Bancolombia Ahorros | Banco | $15.200.000 |
> | Caja general | Efectivo | $3.200.000 |
>
> **Se movió así en el mes**
>
> | Concepto | Monto |
> |---|---|
> | Saldo inicial | $12.800.000 |
> | Entradas | $34.600.000 |
> | Salidas | $29.000.000 |
> | **Saldo del período** | **+$5.600.000** |
>
> **Lo que está pendiente**
>
> | Concepto | Monto | Documentos |
> |---|---|---|
> | Por cobrar a clientes | $22.300.000 | 14 facturas |
> | Por pagar a proveedores | $9.700.000 | 6 facturas |
>
> **En resumen:** cerraste agosto con $5.600.000 más de los que empezaste. Tienes $18.400.000 disponibles ahora mismo y, si cobras todo lo pendiente y pagas todo lo que debes, quedarías con $31.000.000.
>
> Ojo con esto: tienes 2,3 veces más por cobrar que por pagar. La plata está, pero está en manos de tus clientes. Si necesitas liquidez ya, el camino es cobrar, no pedir prestado.

## Workflow

1. **Define el período.** Si la persona no lo dice, usa el mes en curso (del día 1 a hoy) y **avísale explícitamente qué rango usaste**. Si dice "hoy" o "ahora", usa igualmente el mes en curso para el movimiento, pero deja claro que los saldos son a la fecha.

2. **Trae la moneda.** Llama `mcp__alegra-mcp__currencies_getDefaultCurrency` una vez y usa ese símbolo en toda la respuesta. Nunca muestres cifras sin moneda.

3. **Saldos actuales.** Llama `mcp__alegra-mcp__banks_getBanks` con `includeBalance: true` y `status: "active"`. Arma la tabla de cuentas con su tipo (`bank`, `cash`, `credit-card`) y su saldo. Suma los saldos para el total disponible.

   - Las cuentas tipo `credit-card` son deuda, no plata disponible. **No las sumes al disponible**: muéstralas aparte y réstalas del neto si la persona pregunta por su posición real.

4. **Movimiento del período.** Llama `mcp__alegra-mcp__reports_get_cash_flow` con `dateFrom` y `dateTo`. La respuesta trae cinco secciones fijas; toma el `balance` del período de cada una:
   - `INITIAL_CASH_AND_BANKS_BALANCE` → saldo inicial
   - `INCOME` → entradas
   - `EXPENSES` → salidas
   - `BALANCE_OF_THE_PERIOD` → saldo del período
   - `FINAL_BALANCE_IN_CASH_AND_BANKS` → saldo final

5. **Lo pendiente.** Llama en paralelo:
   - `mcp__alegra-mcp__reports_get_receivables_summary` con `asOf` = hoy → usa `missingAmount` y `totalDocuments`
   - `mcp__alegra-mcp__reports_get_payables_summary` con `asOf` = hoy → usa `missingAmount` y `totalDocuments`

6. **Si preguntan "¿me alcanza para X?"** compara el disponible del paso 3 contra el monto X. Responde con un sí o un no claro **primero**, y después el detalle. Si queda ajustado (menos del 20% de margen), dilo.

7. **Si piden comparar contra otro período**, repite el paso 4 con el rango anterior y muestra la variación en monto y en porcentaje.

8. **Cierra con una lectura, no con una tabla.** Dos o tres frases sobre qué significa: si la caja creció o se encogió, si la relación cobrar/pagar está sana, y qué es lo que más conviene hacer.

**Reglas:**

- **Nunca inventes cifras.** Si una herramienta devuelve vacío o cero, dilo tal cual: "el reporte de flujo de caja viene en cero para ese período".
- Si **todo** viene en cero, no lo presentes como si el negocio no tuviera movimiento. Avisa que probablemente el período está mal o la cuenta no tiene datos, y sugiere verificar.
- Muestra siempre el período consultado y la moneda.
- Solo si la persona pide el detalle de una cuenta específica, llama `mcp__alegra-mcp__banks_getTransactions` con el `bankAccountId` de esa cuenta. Trae máximo 30 movimientos, así que si hay más, dilo.

## Cómo interpretar los resultados

| Lo que ves | Qué significa | Qué hacer |
|---|---|---|
| Saldo del período positivo | Entró más de lo que salió | Vas bien. Revisa si el excedente está quieto o trabajando |
| Saldo del período negativo pero saldo final alto | Estás consumiendo colchón | Sostenible por un rato, no para siempre. Mira qué salida creció |
| Por cobrar mucho mayor que por pagar | Tu plata está en manos de tus clientes | Prioriza cobrar antes de buscar financiación. Usa la skill de cobros |
| Por pagar mayor que disponible + por cobrar | Vas a quedar corto | Alerta seria. Negocia plazos con proveedores ya |
| Entradas altas pero saldo bajo | Estás cobrando y gastando al mismo ritmo | Revisa gastos con la skill de control de gastos |

## Errores frecuentes

| Síntoma | Causa | Solución |
|---|---|---|
| Todo viene en cero | El período no tiene movimientos, o estás conectado a otra cuenta | Confirma en qué cuenta de Alegra estás y prueba con un mes que sí tenga ventas |
| "No tengo acceso a esa herramienta" | Falta un grupo en `mcp-groups` | Agrega `reports`, `banks` y `currencies`, y reinicia tu asistente |
| El saldo no coincide con tu banco | En Alegra faltan movimientos por registrar, o hay pagos sin conciliar | Concilia en Alegra. El radar lee lo que está registrado, no lo que pasó de verdad |
| El disponible se ve inflado | Se sumó una tarjeta de crédito | Las cuentas `credit-card` son deuda. Pídele que las muestre aparte |
| Solo ves 30 cuentas o 30 movimientos | Es el máximo por consulta | Pide filtrar por nombre o por tipo de cuenta |

## Límites

- Esta skill solo lee. No crea, no modifica ni borra nada en tu cuenta de Alegra.
- **No proyecta el futuro.** Te muestra lo que hay y lo que está comprometido, no lo que va a pasar. Un "por cobrar" alto no garantiza que vayas a cobrarlo.
- Solo ve lo que está registrado en Alegra. Si tienes una cuenta bancaria por fuera, o pagos sin registrar, no aparecen.
- El detalle de movimientos trae máximo 30 registros por cuenta.
- Los datos salen de tu cuenta de Alegra, pero la interpretación la hace un modelo de IA. Antes de una decisión de plata grande, verifica las cifras en Alegra.
