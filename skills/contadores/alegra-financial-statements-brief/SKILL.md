---
name: alegra-financial-statements-brief
description: >
  Toma el balance general, el estado de resultados y el flujo de caja de un
  período y te los explica en lenguaje de negocio, con las variaciones que
  importan y los indicadores clave. Úsala para preparar el informe que le
  entregas a tu cliente.
  Trigger phrases: "arma el informe financiero", "explícame el balance",
  "cómo le fue al cliente este mes", "resúmeme el estado de resultados",
  "qué le digo a mi cliente", "análisis de los estados financieros",
  "cómo van los indicadores".
allowed-tools: mcp__alegra-mcp__reports_get_general_balance, mcp__alegra-mcp__reports_get_profit_and_loss, mcp__alegra-mcp__reports_get_cash_flow, mcp__alegra-mcp__reports_get_trial_balance, mcp__alegra-mcp__reports_get_receivables_summary, mcp__alegra-mcp__reports_get_payables_summary, mcp__alegra-mcp__currencies_getDefaultCurrency
metadata:
  audiencia: contadores
  requiere: MCP de Alegra conectado (solo consulta)
  grupos-mcp: reports, currencies
  autor: manuelnarvaez-casadiego
  proposito: Entregarle al cliente un informe que entienda y pueda usar
  fecha: 2026-09-01
  status: beta
---

# Informe financiero para tu cliente

## Qué hace por ti

Trae los tres estados —situación financiera, resultados y flujo de caja—, saca las variaciones y los indicadores, y los redacta en lenguaje que tu cliente entiende sin saber contabilidad.

Tú ya sabes leer un balance. Lo que toma tiempo es traducirlo. Esta skill hace la traducción; la revisión y la firma siguen siendo tuyas.

## Para quién es

Para el contador que entrega informes a sus clientes, o para el que lleva la contabilidad de una empresa y tiene que presentar resultados a gerencia.

El momento típico: después del cierre, cuando toca sentarse a redactar el informe del mes.

## Qué necesitas

- El [MCP de Alegra conectado](../../../docs/conectar-mcp-alegra.md).
- Grupos habilitados en `mcp-groups`: `reports`, `currencies`.
- El período **cerrado o al menos cuadrado**. Un informe sobre un mes sin cerrar tiene fecha de vencimiento corta.

## Cómo la usas

Escríbele a tu asistente:

- "Arma el informe financiero de agosto"
- "Explícame el balance en lenguaje de negocio"
- "¿Cómo le fue a la empresa este trimestre contra el anterior?"
- "¿Qué le digo a mi cliente sobre estos resultados?"
- "Resúmeme el estado de resultados en cinco puntos"

## Qué te entrega

> **Informe financiero — agosto de 2026 (COP)**
>
> **En una frase:** el negocio vendió más que en julio y ganó más, pero la plata no entró: casi todo el crecimiento está en cartera.
>
> **Resultados**
>
> | | Agosto | Julio | Variación |
> |---|---|---|---|
> | Ingresos | $40.500.000 | $36.200.000 | +12% |
> | Costo de ventas | $29.800.000 | $27.100.000 | +10% |
> | **Utilidad bruta** | **$10.700.000** | **$9.100.000** | **+18%** |
> | Gastos de operación | $7.900.000 | $6.300.000 | +25% |
> | **Utilidad neta** | **$2.800.000** | **$2.800.000** | **0%** |
>
> La utilidad bruta creció 18%, pero los gastos de operación crecieron 25%. El resultado final quedó igual que el mes pasado. Ahí está la historia del mes.
>
> **Situación financiera al 31 de agosto**
>
> | | Monto | % del activo |
> |---|---|---|
> | Activo corriente | $44.900.000 | 71% |
> | Activo no corriente | $18.400.000 | 29% |
> | **Total activo** | **$63.300.000** | 100% |
> | Pasivo corriente | $21.600.000 | 34% |
> | Pasivo no corriente | $8.200.000 | 13% |
> | **Patrimonio** | **$33.500.000** | 53% |
>
> **Indicadores**
>
> | Indicador | Valor | Lectura |
> |---|---|---|
> | Razón corriente | 2,08 | Por cada peso que debe a corto plazo tiene $2,08. Holgado |
> | Endeudamiento | 47% | Menos de la mitad del activo es deuda. Manejable |
> | Margen bruto | 26% | Estable frente a julio (25%) |
> | Margen neto | 7% | Cayó desde el 8% de julio. Los gastos se lo comieron |
>
> **Flujo de caja**
>
> Entró $31.200.000, salió $34.800.000. El período cerró en **−$3.600.000**. El saldo final en caja y bancos quedó en $18.400.000.
>
> **Vendió más y le entró menos.** La cartera subió a $22.300.000. El crecimiento del mes está en facturas, no en el banco.
>
> **Para conversar con el cliente:**
>
> 1. El mes fue bueno en ventas y neutro en utilidad. Los gastos de operación se comieron el crecimiento.
> 2. La caja se está apretando porque la cartera crece más rápido que el recaudo.
> 3. La estructura financiera está sana: buena liquidez y endeudamiento manejable. El problema es de operación, no de solvencia.

## Workflow

1. **Define el período y el comparativo.** Si no lo dicen, usa el mes anterior completo contra el mes previo. Dilo siempre con fechas exactas.

2. **Trae la moneda** con `mcp__alegra-mcp__currencies_getDefaultCurrency`.

3. **Estado de resultados.** Llama `mcp__alegra-mcp__reports_get_profit_and_loss` con `from`, `to`, `periodsToCompareCount: 1` e `includeComparativeAnalysis: true`.

   - `comparisonType: "years"` es la opción más confiable. Úsala salvo que el comparativo pedido sea explícitamente mensual o trimestral.
   - Devuelve el árbol de cuentas de `income`, `cost`, `productionCost` y `expense`, con análisis vertical, horizontal y variaciones.
   - Usa `includeZeroBalanceAccounts: false` para que el informe no cargue cuentas en cero.

4. **Situación financiera.** Llama `mcp__alegra-mcp__reports_get_general_balance` con `date` = último día del período, `includeComparativeAnalysis: true`, `periodsCount: 1`, `analysisType: "both"` y `filterZeroBalance: true`.

   Devuelve los árboles de activo, pasivo y patrimonio con los totales por sección.

5. **Flujo de caja.** Llama `mcp__alegra-mcp__reports_get_cash_flow` con `dateFrom` y `dateTo`. Vienen cinco secciones fijas: saldo inicial, entradas, salidas, resultado del período y saldo final.

6. **Calcula los indicadores.** Sin esto es un volcado de cifras, no un informe:

   | Indicador | Cómo | Qué dice |
   |---|---|---|
   | Razón corriente | Activo corriente ÷ pasivo corriente | Si puede pagar lo de corto plazo |
   | Endeudamiento | Pasivo total ÷ activo total | Cuánto del negocio es de terceros |
   | Margen bruto | Utilidad bruta ÷ ingresos | Si el precio aguanta el costo |
   | Margen neto | Utilidad neta ÷ ingresos | Cuánto queda al final |
   | Rotación de cartera | Cartera ÷ ventas × días del período | Cuántos días tarda en cobrar |

   Cada indicador va con su **lectura en una frase**. Un número sin lectura no le sirve a nadie que no sea contador.

7. **Cruza los tres estados.** Ahí está el valor del informe. Las preguntas que valen:
   - ¿La utilidad se convirtió en caja? Si creció la utilidad y bajó la caja, la respuesta está en cartera o inventario.
   - ¿El crecimiento del activo viene de patrimonio o de deuda?
   - ¿Los gastos crecieron más rápido que los ingresos?

   Usa `mcp__alegra-mcp__reports_get_receivables_summary` y `mcp__alegra-mcp__reports_get_payables_summary` con `asOf` = fin del período para respaldar la explicación de cartera y proveedores.

8. **Escribe en lenguaje de negocio.** Esta es la parte que la skill aporta:
   - Nada de "el activo corriente asciende a". Mejor: "por cada peso que debe a corto plazo tiene $2,08".
   - Menciona la cuenta contable solo si el cliente la necesita para actuar.
   - Todo porcentaje va con su cifra absoluta, y al revés.

9. **Cierra con 3 puntos para conversar con el cliente.** No más de tres. Un informe que dice diez cosas no dice ninguna.

10. **Si el período no está cerrado**, dilo al principio del informe. Las cifras pueden cambiar.

**Reglas:**

- **Nunca inventes cifras, cuentas ni variaciones.** Si un reporte viene vacío, dilo.
- **No firmes ni certifiques nada.** Esta skill redacta un borrador; la revisión, el criterio y la firma son del contador.
- Muestra siempre la moneda, la fecha de corte y el período comparado.
- Distingue **utilidad bruta** de **utilidad neta** en cada mención. Confundirlas es el error más común de un informe apurado.
- Si una variación sale de una base muy pequeña, dilo. "Subió 400%" sobre $50.000 no es una noticia.
- No des consejo de inversión ni tributario. Explicas los estados; las recomendaciones tienen contexto que la skill no ve.

## Cómo interpretar los resultados

| Lo que ves | Qué significa | Qué decirle al cliente |
|---|---|---|
| Utilidad sube, caja baja | El crecimiento está en cartera o inventario | "Ganaste en el papel; falta cobrarlo" |
| Margen bruto estable, margen neto cayendo | Los gastos de operación crecieron | "El problema no es el precio, es el gasto" |
| Razón corriente por debajo de 1 | No alcanza para lo de corto plazo | Alerta de liquidez. Es lo primero del informe |
| Endeudamiento por encima del 70% | El negocio es mayormente de terceros | Revisar antes de tomar más deuda |
| Rotación de cartera creciendo | Cada vez tarda más en cobrar | Cruzar con el [Asistente de cobros](../../pymes/alegra-collections-assistant/) |
| Patrimonio cayendo con utilidad positiva | Hubo retiros o distribución de utilidades | Confirmar que quedó bien registrado |

## Errores frecuentes

| Síntoma | Causa | Solución |
|---|---|---|
| El balance no cuadra | Hay asientos descuadrados en el período | Corre primero el [Chequeo de cierre mensual](../alegra-monthly-close-check/) |
| Variaciones enormes sin explicación | El período anterior está incompleto | Confirma que el comparativo tenga movimiento real |
| El reporte demora mucho | El período es largo o el catálogo es grande | Acorta el rango o pide `forceSummary` |
| No aparecen cuentas que esperabas | Están en cero y las filtraste | Pide el reporte sin filtrar saldos en cero |
| La utilidad no coincide con el balance | Falta el asiento de cierre del período | Revisa si el período está cerrado |

## Límites

- Esta skill solo lee. No crea, no modifica ni borra nada en tu cuenta de Alegra.
- **No emite estados financieros oficiales ni certificados.** Produce un borrador de análisis para que tú lo revises y lo firmes.
- No aplica NIIF ni ningún marco normativo. Lee lo que está registrado en Alegra.
- No hace notas a los estados financieros ni revelaciones.
- Los comparativos dependen de que el período anterior esté bien registrado.
- Los datos salen de tu cuenta de Alegra, pero la interpretación la hace un modelo de IA. **Antes de entregar cualquier informe a un cliente, verifica las cifras en Alegra.**
