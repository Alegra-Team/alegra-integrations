---
name: alegra-bank-reconciliation-audit
description: >
  Te muestra el estado de las conciliaciones bancarias, qué movimientos quedaron
  sin conciliar y dónde está la diferencia entre el saldo del banco y el saldo
  contable. Úsala antes de cerrar el mes o cuando una cuenta no cuadra.
  Trigger phrases: "revisa la conciliación bancaria", "qué movimientos están sin
  conciliar", "por qué no cuadra el banco", "estado de las conciliaciones",
  "diferencia entre el banco y la contabilidad", "conciliaciones pendientes",
  "auditoría bancaria".
allowed-tools: mcp__alegra-mcp__banks_getBanks, mcp__alegra-mcp__banks_getBanksById, mcp__alegra-mcp__banks_getReconciliations, mcp__alegra-mcp__banks_getReconciliationById, mcp__alegra-mcp__banks_getTransactions, mcp__alegra-mcp__reports_get_trial_balance, mcp__alegra-mcp__currencies_getDefaultCurrency
metadata:
  audiencia: contadores
  requiere: MCP de Alegra conectado (solo consulta)
  grupos-mcp: banks, reports, currencies
  autor: manuelnarvaez-casadiego
  proposito: Encontrar dónde está la diferencia antes de que la busque el revisor
  fecha: 2026-09-01
  status: beta
---

# Auditoría de conciliación bancaria

## Qué hace por ti

Revisa cuenta por cuenta el estado de las conciliaciones, te dice cuáles quedaron en borrador o abiertas, qué movimientos no se conciliaron y de qué tamaño es la diferencia entre el saldo bancario y el contable.

La conciliación es el punto donde la contabilidad toca la realidad. Esta skill te dice dónde no se están tocando.

## Para quién es

Para el contador que cierra el mes, o para quien revisa la contabilidad de un cliente y necesita saber si el banco está cuadrado.

El momento típico: antes del cierre. O cuando una cuenta no cuadra y hay que encontrar dónde se rompió.

## Qué necesitas

- El [MCP de Alegra conectado](../../../docs/conectar-mcp-alegra.md).
- Grupos habilitados en `mcp-groups`: `banks`, `reports`, `currencies`.
- Conciliaciones bancarias **en uso en Alegra**. Si nunca se ha conciliado, la skill te lo dirá, que ya es un hallazgo.

## Cómo la usas

Escríbele a tu asistente:

- "Revisa la conciliación bancaria de agosto"
- "¿Qué movimientos quedaron sin conciliar?"
- "¿Por qué no cuadra la cuenta de Bancolombia?"
- "¿Tengo conciliaciones pendientes?"
- "¿Cuál es la diferencia entre el banco y la contabilidad?"

## Qué te entrega

> **Auditoría de conciliación — agosto de 2026 (COP)**
>
> **Estado por cuenta**
>
> | Cuenta | Saldo en Alegra | Última conciliación | Estado |
> |---|---|---|---|
> | Bancolombia Ahorros | $15.200.000 | 31 ago | Conciliada |
> | Davivienda Corriente | $8.400.000 | 31 jul | **Borrador, sin cerrar** |
> | Caja general | $3.200.000 | — | Nunca conciliada |
> | Tarjeta de crédito | −$4.100.000 | 31 ago | Conciliada |
>
> **El hallazgo principal**
>
> Davivienda Corriente tiene la conciliación de agosto en **borrador**. Mientras no se cierre, el saldo contable de esa cuenta no está validado contra el extracto. Son $8.400.000 sin respaldo de conciliación.
>
> **Movimientos sin conciliar en Davivienda (agosto)**
>
> | Fecha | Tipo | Concepto | Monto |
> |---|---|---|---|
> | 14 ago | Salida | Pago proveedor FC-8821 | $2.100.000 |
> | 22 ago | Entrada | Abono cliente | $1.800.000 |
> | 29 ago | Salida | Comisión bancaria | $48.000 |
> | 31 ago | Salida | Retención GMF | $16.400 |
>
> Los dos últimos son el clásico: comisiones y GMF que el banco cobra y que nadie registra hasta que aparece la diferencia.
>
> **Contra la contabilidad**
>
> El balance de prueba muestra $23.600.000 en cuentas de bancos. La suma de los saldos de las cuentas en Alegra da $23.600.000. **Cuadra.**
>
> **Lo que aprendí de tus cuentas:** Caja general nunca se ha conciliado y tiene $3.200.000. No es urgente como el borrador de Davivienda, pero es un saldo que nadie ha validado nunca contra un arqueo.

## Workflow

1. **Define el período y la fecha de corte.** Si no lo dicen, usa el mes anterior completo. Dilo siempre.

2. **Trae la moneda** con `mcp__alegra-mcp__currencies_getDefaultCurrency`.

3. **Lista las cuentas.** Llama `mcp__alegra-mcp__banks_getBanks` con `includeBalance: true`, `status: "active"` y `fields: "lastMovementDate"`.

   - Máximo 30 cuentas por llamada.
   - **Separa por tipo**: `bank`, `cash` y `credit-card`. Una tarjeta de crédito es un pasivo, no un activo. Nunca la sumes con las demás.
   - `lastMovementDate` ya te dice si una cuenta está muerta o activa.

4. **Estado de las conciliaciones.** Llama `mcp__alegra-mcp__banks_getReconciliations` por cada cuenta con `account_id`, `order_field: "date"`, `order_direction: "DESC"` y `fields: "balance"`.

   El campo `status` es el corazón de esta skill:

   | Estado | Qué significa | Qué tan grave |
   |---|---|---|
   | `open` | Conciliación abierta, en curso | Normal si es del período actual |
   | `draft` | Quedó en borrador y nunca se cerró | **Alto.** El saldo no está validado |
   | `process` | En procesamiento | Espera a que termine |

   Máximo 30 conciliaciones por llamada.

5. **Detecta lo que no aparece.** Una cuenta **sin ninguna conciliación** es un hallazgo tan importante como una en borrador. Dilo explícitamente; el reporte no la va a listar sola.

6. **El detalle.** Llama `mcp__alegra-mcp__banks_getReconciliationById` con el `id` de la conciliación que interese. Trae las transacciones incluidas.

7. **Los movimientos del período.** Llama `mcp__alegra-mcp__banks_getTransactions` con `bankAccountId`, `dateFrom` y `dateTo`.

   - Máximo 30 movimientos por llamada. Usa `start` para paginar y **di cuántos alcanzaste a revisar** contra el total.
   - Puedes filtrar por `type: "in"` o `type: "out"`.
   - Trae transacciones, asientos contables y ajustes por diferencia en cambio: los tres cuentan para conciliar.

8. **Cruza contra la contabilidad.** Llama `mcp__alegra-mcp__reports_get_trial_balance` con `from` y `to` del período, y `accountName` con el nombre de la cuenta de bancos.

   Compara el saldo contable contra la suma de saldos de las cuentas bancarias en Alegra. Si no cuadran, esa es la noticia principal y va de primera.

9. **Señala los sospechosos habituales.** Son casi siempre los mismos:
   - Comisiones bancarias y cuotas de manejo sin registrar
   - GMF o impuestos financieros que el banco descuenta
   - Cheques girados que el beneficiario no ha cobrado
   - Consignaciones en tránsito de los últimos días del mes
   - Rendimientos financieros no registrados
   - Movimientos duplicados

10. **Cierra con la prioridad.** Ordena los hallazgos por lo que hay que resolver primero: conciliaciones en borrador, después cuentas nunca conciliadas, después movimientos sueltos.

**Reglas:**

- **Nunca inventes movimientos, saldos ni conciliaciones.** Si una cuenta no tiene conciliaciones, dilo tal cual.
- **No concilies nada.** Esta skill señala; la conciliación se hace en Alegra.
- Separa siempre las tarjetas de crédito. Su saldo es deuda y sumarlo con los bancos da un número sin sentido.
- Di siempre cuántos movimientos revisaste contra el total. "No encontré nada raro" en 30 de 300 movimientos no es una conclusión.
- Muestra siempre la moneda y la fecha de corte.
- No afirmes que hay un error si lo que ves es una partida conciliatoria normal. Un cheque sin cobrar no es un error.

## Cómo interpretar los resultados

| Lo que ves | Qué significa | Qué hacer |
|---|---|---|
| Conciliación en `draft` | Se empezó y nunca se cerró | Ciérrala antes del cierre contable. Ese saldo no está validado |
| Cuenta sin conciliaciones | Nunca se ha validado contra el extracto | Concilia al menos el último período |
| Diferencia igual a una comisión bancaria | Falta registrar el cobro del banco | Registra el gasto financiero |
| Salidas registradas que el banco no muestra | Cheques girados sin cobrar | Es una partida conciliatoria normal. Solo hazle seguimiento |
| Entradas que el banco no muestra | Consignaciones en tránsito | Normal a fin de mes. Confirma que entren en los primeros días |
| El balance no coincide con la suma de cuentas | Hay asientos a la cuenta de bancos sin movimiento bancario | Revisa los asientos manuales del período |

## Errores frecuentes

| Síntoma | Causa | Solución |
|---|---|---|
| No aparecen conciliaciones | Nunca se ha conciliado en Alegra | Es un hallazgo, no un error de la skill |
| Solo ves 30 movimientos | Es el máximo por consulta | Pide la siguiente página o filtra por tipo de movimiento |
| El saldo total se ve raro | Sumaste la tarjeta de crédito con los bancos | Sepáralas. La tarjeta es pasivo |
| La diferencia no aparece por ningún lado | Está en un período anterior | Amplía el rango de fechas hacia atrás |
| Faltan movimientos que sí ves en el extracto | No están registrados en Alegra | Ese es exactamente el hallazgo. Regístralos |

## Límites

- Esta skill solo lee. No concilia, no crea ni modifica nada en tu cuenta de Alegra.
- **No lee el extracto del banco.** Solo ve lo registrado en Alegra. La comparación contra el extracto físico la haces tú.
- Trae máximo 30 cuentas, 30 conciliaciones y 30 movimientos por consulta.
- No detecta fraude. Señala diferencias e inconsistencias; interpretarlas es criterio profesional.
- No reemplaza el papel de trabajo de conciliación.
- Los datos salen de tu cuenta de Alegra, pero la interpretación la hace un modelo de IA. Antes de cerrar, verifica en Alegra.
