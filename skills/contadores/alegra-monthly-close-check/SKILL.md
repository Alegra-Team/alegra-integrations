---
name: alegra-monthly-close-check
description: >
  Te dice si el período está listo para cerrar: en qué estado va el cierre, qué
  lo está bloqueando y qué falta cuadrar en el balance de prueba. Úsala antes de
  cerrar el mes o cuando un cierre se quedó trabado.
  Trigger phrases: "puedo cerrar el mes", "qué falta para cerrar", "qué bloquea
  el cierre", "está cerrado agosto", "qué períodos tengo cerrados", "el cierre se
  quedó trabado", "revisa el balance antes de cerrar".
allowed-tools: mcp__alegra-mcp__accounting_getAccountingPeriodStatus, mcp__alegra-mcp__accounting_getPeriodClosingStatus, mcp__alegra-mcp__accounting_getPeriodClosingBlockingReasons, mcp__alegra-mcp__accounting_listClosedPeriods, mcp__alegra-mcp__reports_get_trial_balance, mcp__alegra-mcp__reports_get_receivables_summary, mcp__alegra-mcp__reports_get_payables_summary, mcp__alegra-mcp__currencies_getDefaultCurrency
metadata:
  audiencia: contadores
  requiere: MCP de Alegra conectado (solo consulta)
  grupos-mcp: accounting, reports, currencies
  autor: manuelnarvaez-casadiego
  proposito: Saber si el período está listo para cerrar antes de intentarlo
  fecha: 2026-09-01
  status: beta
---

# Chequeo de cierre mensual

## Qué hace por ti

Te dice en un solo lugar si el período está listo para cerrar: si ya está cerrado o abierto, si hay un proceso de cierre corriendo o fallido, qué lo está bloqueando y qué quedó descuadrado en el balance de prueba.

Es el checklist que igual ibas a hacer, hecho en 30 segundos.

## Para quién es

Para el contador o quien responde por el cierre contable, propio o de sus clientes.

El momento típico: los primeros días del mes, antes de intentar el cierre. O cuando el cierre se quedó trabado y no sabes en qué paso.

## Qué necesitas

- El [MCP de Alegra conectado](../../../docs/conectar-mcp-alegra.md).
- Grupos habilitados en `mcp-groups`: `accounting`, `reports`, `currencies`.
- La contabilidad de Alegra en uso, con el catálogo de cuentas configurado.

## Cómo la usas

Escríbele a tu asistente:

- "¿Puedo cerrar agosto?"
- "¿Qué falta para cerrar el mes?"
- "¿Qué está bloqueando el cierre?"
- "¿Qué períodos tengo cerrados este año?"
- "Revísame el balance de prueba antes de cerrar"

## Qué te entrega

> **Chequeo de cierre — agosto de 2026 (COP)**
>
> El período está **abierto**. Hay una ejecución de cierre en estado `error`, detenida en el paso `inventory`.
>
> **Estado**
>
> | Punto | Estado |
> |---|---|
> | Período contable | Abierto |
> | Proceso de cierre | Error en el paso `inventory` (ejecución 4821) |
> | Períodos cerrados de 2026 | Enero a julio |
> | Balance de prueba | Cuadrado: débitos $184.320.000 = créditos $184.320.000 |
>
> **Lo que hay que resolver primero**
>
> La ejecución de cierre falló en inventario. Mientras esa ejecución siga en error, no vas a poder correr otro cierre para el mismo período. Ese es el bloqueo real, no el balance.
>
> **Puntos de revisión antes de intentar de nuevo**
>
> | Cuenta | Saldo | Por qué mirarla |
> |---|---|---|
> | Clientes nacionales | $22.300.000 | El auxiliar de cartera dice $22.300.000. Cuadra |
> | Proveedores nacionales | $9.700.000 | El auxiliar de CxP dice $9.700.000. Cuadra |
> | Cuentas por cobrar a socios | $4.100.000 | Sin movimiento en 6 meses. Confirma si sigue siendo real |
> | Anticipos por legalizar | $1.850.000 | Suele quedar sin depurar en el cierre |
>
> **Lo que aprendí de tu cierre:** los seis meses anteriores cerraron sin errores. Este falló en inventario, que suele significar costos sin calcular o movimientos de bodega sin registrar. Ahí es donde vale la pena mirar primero.

## Workflow

1. **Define el período.** Si no lo dicen, usa el mes anterior completo: es el que normalmente se está cerrando. Dilo siempre ("agosto de 2026").

2. **Trae la moneda** con `mcp__alegra-mcp__currencies_getDefaultCurrency`.

3. **Estado del período.** Llama `mcp__alegra-mcp__accounting_getAccountingPeriodStatus` con `period` (año, YYYY) y `month` (1-12).

   Devuelve `status` (`open` / `closed`) e `isClosed`. Esto responde la pregunta literal: ¿está cerrado o no?

4. **Estado del proceso de cierre.** Llama `mcp__alegra-mcp__accounting_getPeriodClosingStatus` con el mismo `period` y `month`.

   Es distinto del anterior: aquí ves si hay una **ejecución** del pipeline corriendo, procesada o fallida, y en qué paso va (`categories`, `contacts`, `inventory`, `journal`, `syncClickHouse`, `syncJournals`).

   - Si `status` es `unknown`, no hay período ni historial para ese mes. Dilo tal cual, no lo interpretes como un error.
   - Un cierre anual aparece en el historial con fecha `YYYY-12-31`.

5. **Bloqueos.** Llama `mcp__alegra-mcp__accounting_getPeriodClosingBlockingReasons` con `period` y `month`.

   Por defecto revisa las ejecuciones en `in_process` y `error`, que son las que impiden arrancar otro cierre. Cada bloqueo trae `type`, `executionId`, `status`, `currentStep` y `message`.

   - **Este es el bloqueo real.** Si hay una ejecución trabada, no importa qué tan bien esté el balance: primero se resuelve eso.
   - Si la lista viene vacía, dilo: no hay ejecuciones trabadas.

6. **Contexto del año.** Llama `mcp__alegra-mcp__accounting_listClosedPeriods` con `period`. Devuelve solo los períodos cerrados.

   Sirve para detectar el error más común: **intentar cerrar un mes cuando el anterior sigue abierto.** Si ves un hueco en la secuencia, señálalo.

7. **Balance de prueba.** Llama `mcp__alegra-mcp__reports_get_trial_balance` con `from` y `to` del período.

   Devuelve el árbol de cuentas con `totalDebit`, `totalCredit`, el saldo según la naturaleza de la cuenta y `previousTotals` (saldos anteriores a `from`).

   - **Verifica la partida doble**: total de débitos igual a total de créditos. Si no cuadra, esa es la noticia y va de primera.
   - Presenta las **cuentas grandes y las sospechosas**, no el árbol completo. Un contador no necesita que le lean el catálogo.
   - Usa `accountName` si preguntan por una cuenta puntual.

8. **Cruces rápidos.** Compara el balance contra los auxiliares:
   - `mcp__alegra-mcp__reports_get_receivables_summary` con `asOf` = fin del período, contra la cuenta de clientes.
   - `mcp__alegra-mcp__reports_get_payables_summary` con `asOf` = fin del período, contra la cuenta de proveedores.

   Una diferencia entre el auxiliar y la cuenta contable es la señal más útil que le puedes dar a un contador antes de cerrar.

9. **Señala lo que suele quedar colgado.** Cuentas puente, anticipos por legalizar, cuentas por cobrar a socios, saldos sin movimiento en varios meses. No afirmes que están mal: di que valen una revisión y por qué.

10. **Cierra con el veredicto.** Una frase clara: *"puedes cerrar"*, *"puedes cerrar pero revisa X"*, o *"no puedes cerrar hasta resolver Y"*. Un checklist sin conclusión no ahorra tiempo.

**Reglas:**

- **Nunca digas que un período está cerrado si no lo verificaste.** Es un dato con consecuencias.
- **Esta skill no cierra ni reabre nada.** Si preguntan cómo cerrar, explica que la acción va en Alegra, no aquí.
- Distingue siempre **estado del período** (abierto/cerrado) de **estado de la ejecución** (en proceso, procesado, con error). La gente los confunde y son cosas distintas.
- Nunca inventes cuentas, saldos ni ejecuciones. Si un reporte viene vacío, dilo.
- No firmes conclusiones contables. Señalas puntos de revisión; el criterio profesional es de quien firma.
- Muestra siempre la moneda y las fechas exactas del período.

## Cómo interpretar los resultados

| Lo que ves | Qué significa | Qué hacer |
|---|---|---|
| Ejecución en `error` | El pipeline de cierre falló y bloquea nuevos intentos | Resuelve la causa del paso que falló antes de reintentar |
| Ejecución en `in_process` | Hay un cierre corriendo ahora mismo | Espera a que termine. No lances otro |
| Hueco en los períodos cerrados | Estás saltando un mes | Cierra en orden. El anterior primero |
| Débitos distintos de créditos | La contabilidad no cuadra | Busca el asiento descuadrado antes de cualquier otra cosa |
| El auxiliar no coincide con la cuenta | Hay documentos sin contabilizar o mal contabilizados | Revisa el auxiliar de esa cuenta en el período |
| Falla en el paso `inventory` | Costos sin calcular o movimientos de bodega pendientes | Revisa ajustes y transferencias de inventario del mes |

## Errores frecuentes

| Síntoma | Causa | Solución |
|---|---|---|
| `status: unknown` | No hay período ni historial para ese mes | Confirma el año y el mes. Puede ser un período que nunca se tocó |
| Dice abierto pero tú lo cerraste | Cerraste el año, no el mes | El cierre anual aparece con fecha 31 de diciembre |
| El balance no cuadra por centavos | Diferencias de redondeo o de tasa de cambio | Revisa las cuentas en moneda extranjera |
| No aparecen bloqueos pero no puedes cerrar | El bloqueo está en el período anterior | Revisa la secuencia completa del año |
| Los saldos no coinciden con tu papel de trabajo | Estás mirando otro rango de fechas | Confirma `from` y `to`, y si incluye asientos de cierre |

## Límites

- Esta skill solo lee. No cierra, no reabre ni modifica nada en tu cuenta de Alegra.
- No hace asientos de ajuste ni de reclasificación.
- No reemplaza tu papel de trabajo ni tu criterio profesional. Te señala dónde mirar.
- No revisa la conciliación bancaria. Para eso está la [Auditoría de conciliación bancaria](../alegra-bank-reconciliation-audit/).
- No revisa impuestos ni retenciones. Para eso está la [Revisión de impuestos y retenciones](../alegra-tax-and-retentions/).
- Los datos salen de tu cuenta de Alegra, pero la interpretación la hace un modelo de IA. Antes de cerrar el período, verifica en Alegra.
