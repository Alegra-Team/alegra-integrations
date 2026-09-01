---
name: alegra-payroll-review
description: >
  Revisa el estado de la nómina del período: qué se liquidó, qué quedó pendiente
  de pago y qué nómina electrónica falta por emitir. Úsala antes de cerrar el mes
  o cuando necesites saber si la nómina quedó completa.
  Trigger phrases: "revisa la nómina del mes", "qué nómina falta por emitir",
  "cuántos empleados activos tengo", "estado de la nómina electrónica", "qué
  períodos de nómina están abiertos", "quién entró y quién salió", "nómina
  pendiente de pago".
allowed-tools: mcp__alegra-mcp__payroll_list-settlement-periods, mcp__alegra-mcp__payroll_list-payrolls, mcp__alegra-mcp__payroll_list-payment-records, mcp__alegra-mcp__payroll_list-employees, mcp__alegra-mcp__payroll_get-employee, mcp__alegra-mcp__payroll_list-emission-periods, mcp__alegra-mcp__payroll_list-e-payrolls, mcp__alegra-mcp__payroll_get-employees-hirings-report, mcp__alegra-mcp__currencies_getDefaultCurrency
metadata:
  audiencia: contadores
  requiere: MCP de Alegra conectado (solo consulta) y nómina activa en Alegra
  grupos-mcp: payroll, currencies
  autor: manuelnarvaez-casadiego
  proposito: Cerrar el mes sabiendo que la nómina quedó liquidada, pagada y emitida
  fecha: 2026-09-01
  status: beta
---

# Revisión de nómina

## Qué hace por ti

Te dice en qué va la nómina del período en sus **tres momentos**, que son distintos y se confunden todo el tiempo:

1. **Liquidada** — se calculó el período.
2. **Pagada** — la plata salió y quedó registrada.
3. **Emitida** — la nómina electrónica se reportó a la autoridad.

Una nómina puede estar liquidada, pagada y **sin emitir**. Ese hueco es el que esta skill encuentra.

## Para quién es

Para el contador que responde por la nómina de uno o varios clientes, y para quien la administra dentro de la empresa.

El momento típico: los días previos al cierre del mes, o cuando se acerca la fecha límite de emisión de nómina electrónica.

## Qué necesitas

- El [MCP de Alegra conectado](../../../docs/conectar-mcp-alegra.md).
- Grupo habilitado en `mcp-groups`: `payroll` (y `currencies` para la moneda).
- **Nómina activa en Alegra.** Si la empresa no la usa, esta skill no tiene nada que leer y te lo dice.

## Cómo la usas

Escríbele a tu asistente:

- "Revisa la nómina de agosto"
- "¿Qué nómina electrónica me falta por emitir?"
- "¿Cuántos empleados activos tengo?"
- "¿Quedó alguna nómina sin pagar?"
- "¿Quién entró y quién salió este semestre?"

## Qué te entrega

> **Revisión de nómina — agosto de 2026 (COP)**
>
> **Período de liquidación 1–31 ago**
>
> | | |
> |---|---|
> | Empleados activos | 14 |
> | Nóminas liquidadas | 14 |
> | Nóminas pagadas | 12 |
> | Nómina electrónica emitida | 11 |
>
> **Lo que falta:**
>
> | Empleado | Liquidada | Pagada | Emitida |
> |---|---|---|---|
> | Ana Restrepo | Sí | **No** | No |
> | Julián Ospina | Sí | **No** | No |
> | Camilo Bedoya | Sí | Sí | **No** |
>
> **Movimiento de personal (últimos 6 meses)**
>
> 3 contrataciones, 1 retiro. El retiro de julio tiene nómina de tipo liquidación registrada.
>
> **Lo que aprendí de tu nómina:** el hueco no está en la liquidación —esa quedó completa para los 14— sino **después**. Dos personas quedaron sin registro de pago y **tres sin emitir la nómina electrónica**.
>
> Lo de la emisión es lo que corre contra reloj: tiene fecha límite y no depende de ti una vez pasa. Empieza por ahí.

## Workflow

1. **Define el período.** Si la persona no lo dice, usa el **mes anterior completo** si ya pasó el corte, o el mes en curso si estás a mitad. Dilo siempre en la respuesta.

2. **Trae la moneda** con `mcp__alegra-mcp__currencies_getDefaultCurrency`.

3. **Ubica el período de liquidación.** Llama `mcp__alegra-mcp__payroll_list-settlement-periods` con `year`, `month` y `limit`.

   - Si necesitas períodos viejos, pasa `enableHistory: true`.
   - **Máximo 100 por llamada.**
   - Si viene vacío, ese mes no tiene período de liquidación creado. Es un hallazgo, no un error: dilo.

   De aquí sacas las fechas exactas (`startDate`, `endDate`) que usan casi todas las llamadas siguientes.

4. **Trae las nóminas liquidadas.** Llama `mcp__alegra-mcp__payroll_list-payrolls` con `startDate`, `endDate` y `limit` (máximo 100).

   - `type` distingue `ordinary` de `termination` (liquidación de contrato). **Sepáralas en la respuesta**: una liquidación de contrato en el mes es un evento, no una nómina más.
   - `employeeId` filtra por persona, si te lo piden.
   - Pagina con los cursores `from` y `to`, no con `start`.

5. **Revisa los pagos.** Llama `mcp__alegra-mcp__payroll_list-payment-records` con `startDate` y `endDate` (ambos **obligatorios**). Cada registro trae un objeto `payment` con `status`, `paymentId` y `errorCode`.

   - Si hay `errorCode`, **no lo escondas**: es un pago que falló y alguien tiene que mirarlo.
   - Máximo 300 por llamada.
   - **Liquidada no es pagada.** Cruza esta lista contra la del paso 4 para encontrar quién quedó sin registro de pago.

6. **Empleados activos.** Llama `mcp__alegra-mcp__payroll_list-employees` con `status: "active"` y `limit` (máximo 100).

   Este número es tu denominador: si tienes 14 activos y 12 nóminas liquidadas, faltan 2 y hay que decir quiénes.

   Para el detalle de una persona, `mcp__alegra-mcp__payroll_get-employee`.

7. **Nómina electrónica: primero el resumen.** Llama `mcp__alegra-mcp__payroll_list-emission-periods` (no recibe parámetros). Te da los períodos de emisión con su resumen, que es la vista rápida de qué está al día y qué no.

   **Ojo:** el período de *emisión* no siempre coincide con el de *liquidación*. No los mezcles.

8. **Baja al detalle de lo pendiente.** Llama `mcp__alegra-mcp__payroll_list-e-payrolls` con `startDate` y `endDate` (**obligatorios**) del período de emisión.

   - `status` filtra por estado (`draft`, `active`, `canceled`, `replaced`, entre otros). Usa los valores que devuelva Alegra; no los inventes.
   - `draft` = no se ha emitido. Ese es el que importa.
   - `replaced` = se corrigió y se reemplazó. Normal, no lo reportes como problema.
   - En México, `frequency` es el código SAT (`"01"`–`"05"`). En Colombia es opcional.
   - Máximo 300 por llamada.

9. **Movimiento de personal.** Llama `mcp__alegra-mcp__payroll_get-employees-hirings-report` con `startDate` y `endDate`. Sin parámetros, toma los últimos 6 meses.

   Cruza los retiros con las nóminas de tipo `termination`: **un retiro sin liquidación registrada es un pendiente serio**.

10. **Arma la tabla de huecos.** Una fila por empleado con las tres columnas: liquidada, pagada, emitida. Ordena por gravedad: sin emitir primero (tiene fecha límite), luego sin pagar, luego sin liquidar.

    Si no hay huecos, dilo en una línea y no inventes hallazgos.

11. **Cierra con la prioridad y el porqué.** No basta con listar lo que falta: di cuál corre contra reloj. La emisión electrónica tiene fecha límite; el registro de un pago se puede poner al día mañana.

**Reglas:**

- **Nunca inventes un dato de nómina.** Salarios, aportes y descuentos son información sensible y una cifra mal dicha tiene consecuencias reales.
- **No calcules prestaciones, aportes ni retenciones.** Esta skill lee lo que Alegra ya liquidó; no rehace el cálculo.
- Muestra siempre el **nombre** del empleado, nunca solo el id.
- Distingue los tres estados —liquidada, pagada, emitida— en todas las respuestas. Es el aporte principal de la skill.
- Si un listado viene vacío, dilo. Vacío no es cero: puede ser que el período no exista o que la nómina no esté en uso.
- No compares salarios entre empleados ni opines sobre cuánto gana alguien. No es el trabajo de esta skill.
- Si la empresa no usa nómina en Alegra, dilo de una y no fuerces un informe.

## Cómo interpretar los resultados

| Lo que ves | Qué significa | Qué hacer |
|---|---|---|
| Empleados activos > nóminas liquidadas | Alguien quedó sin liquidar | Revisar si es un ingreso nuevo o un olvido |
| Nómina liquidada sin registro de pago | Se calculó pero no se registró la salida de plata | Confirmar si se pagó y no se registró, o si no se ha pagado |
| `payment.errorCode` con valor | El pago falló | Revisar el error en Alegra antes de reintentar |
| Nómina electrónica en `draft` | No se ha emitido | Emitir antes de la fecha límite. Es lo más urgente |
| Estado `replaced` | Se corrigió y reemplazó el documento | Normal. No es un pendiente |
| Retiro sin nómina `termination` | Falta la liquidación de contrato | Pendiente serio: tiene implicaciones laborales |
| Período de liquidación inexistente | El mes no se ha creado en nómina | Crearlo en Alegra antes de liquidar |
| Emisión al día pero pagos pendientes | Se reportó lo que no se ha pagado | Revisar. Reportar antes de pagar es válido, pero hay que cerrarlo |

## Errores frecuentes

| Síntoma | Causa | Solución |
|---|---|---|
| No aparece ningún período | La empresa no usa nómina en Alegra, o el mes no está creado | Verifica en Alegra que el módulo esté en uso |
| Faltan períodos viejos | Por defecto no se cargan los históricos | Pásale `enableHistory: true` |
| La nómina electrónica sale vacía | El período de emisión no es el mismo que el de liquidación | Consulta primero `list-emission-periods` |
| Faltan empleados en el listado | Filtraste por `status: "active"` y hay retirados con nómina en el mes | Consulta también los inactivos |
| El conteo se queda corto | Estás viendo solo la primera página | Pagina con los cursores `from` y `to` |
| Aparecen nóminas que no esperabas | Están mezcladas las ordinarias con las de liquidación | Separa por `type`: `ordinary` y `termination` |

## Límites

- Esta skill solo lee. No crea, no modifica ni borra nada en tu cuenta de Alegra. **No liquida, no paga y no emite nómina electrónica.**
- **No calcula prestaciones, aportes, retenciones ni liquidaciones de contrato.** Lee lo que Alegra ya liquidó.
- **No da asesoría laboral.** No interpreta normas ni decide qué le corresponde a un empleado.
- No se conecta con la DIAN ni con ninguna autoridad. El estado de emisión es el que está registrado en Alegra.
- No opina sobre salarios ni compara lo que gana una persona con otra.
- Máximo 100 empleados, 100 nóminas y 100 períodos por llamada; 300 registros de pago y nóminas electrónicas. Siempre te dice cuántos alcanzó a revisar.
- Los datos salen de tu cuenta de Alegra, pero la interpretación la hace un modelo de IA. Antes de pagar una nómina o emitir un documento, verifica en Alegra.
