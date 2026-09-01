---
name: alegra-pos-daily-close
description: >
  Te arma el resumen del turno del punto de venta: cuánto se vendió, cómo pagaron
  los clientes, si la caja cuadró y qué facturas quedaron pendientes de emitir.
  Úsala al cerrar el día o para revisar un turno que no cuadró.
  Trigger phrases: "cómo cerró la caja hoy", "cuánto se vendió en el punto de
  venta", "resumen del turno", "la caja no cuadró", "cómo pagaron hoy", "cuánto
  efectivo hay en caja", "qué facturas quedaron sin emitir".
allowed-tools: mcp__alegra-mcp__pos_pos_list-stations, mcp__alegra-mcp__pos_pos_get-shift-status, mcp__alegra-mcp__pos_pos_list-station-shifts, mcp__alegra-mcp__pos_pos_get-shift, mcp__alegra-mcp__pos_pos_get-shift-report, mcp__alegra-mcp__pos_pos_get-shift-aggregated-payments, mcp__alegra-mcp__pos_pos_get-shift-invoices, mcp__alegra-mcp__pos_pos_get-post-close-adjustments, mcp__alegra-mcp__pos_pos_list-pending-emission-invoices, mcp__alegra-mcp__currencies_getDefaultCurrency
metadata:
  audiencia: pymes
  requiere: MCP de Alegra conectado (solo consulta) y Alegra POS en uso
  grupos-mcp: pos, currencies
  autor: manuelnarvaez-casadiego
  proposito: Cerrar el día sabiendo si la caja cuadró y por qué no, si no cuadró
  fecha: 2026-09-01
  status: beta
---

# Cierre de caja del día

## Qué hace por ti

Te da el resumen del turno sin que tengas que abrir el POS: cuánto entró, cómo pagó la gente, cuánto efectivo debería haber en la caja y si hay diferencia.

Y cuando no cuadra, no se queda en "hay un descuadre de $80.000". Te dice por dónde buscar.

## Para quién es

Para el dueño de un negocio con punto de venta —tienda, restaurante, ferretería, salón— o para quien supervisa varias cajas sin estar en el mostrador.

El momento típico: al cerrar el día. O la mañana siguiente, cuando quieres revisar cómo cerró el turno de ayer.

## Qué necesitas

- El [MCP de Alegra conectado](../../../docs/conectar-mcp-alegra.md).
- Grupos habilitados en `mcp-groups`: `pos`, `currencies`.
- **Alegra POS en uso**, con turnos que se abren y se cierran. Si facturas sin turnos, esta skill no tiene qué leer.

## Cómo la usas

Escríbele a tu asistente:

- "¿Cómo cerró la caja hoy?"
- "Dame el resumen del turno"
- "¿Cómo pagaron los clientes hoy?"
- "La caja no cuadró, ¿qué pasó?"
- "¿Quedaron facturas sin emitir?"

## Qué te entrega

> **Turno del 1 de septiembre de 2026 — Caja principal (COP)**
>
> Abrió a las 8:02 a. m. y cerró a las 8:14 p. m. Se vendieron **$3.420.000** en **87 facturas**. Ticket promedio: $39.300.
>
> **Cómo pagaron**
>
> | Medio de pago | Monto | % |
> |---|---|---|
> | Efectivo | $1.640.000 | 48% |
> | Tarjeta débito | $960.000 | 28% |
> | Transferencia | $580.000 | 17% |
> | Tarjeta crédito | $240.000 | 7% |
>
> **La caja**
>
> | | Monto |
> |---|---|
> | Base inicial | $200.000 |
> | Efectivo del turno | $1.640.000 |
> | Retiros | −$800.000 |
> | Esperado en caja | $1.040.000 |
> | Contado al cerrar | $1.012.000 |
> | **Diferencia** | **−$28.000** |
>
> Falta $28.000. Es un 1,7% del efectivo del turno: casi siempre es vuelto mal dado, no algo grave. Vale la pena mirar si hay una venta grande en efectivo cerca del cierre.
>
> **Pendientes:** 3 facturas están sin emitir electrónicamente. Emítelas antes de que se acumulen.
>
> **Lo que aprendí de tu día:** casi la mitad de tus ventas son en efectivo. Eso significa que el descuadre y el manejo de vuelto son un riesgo real, no una anécdota. Si puedes empujar el pago digital, se te reduce solo.

## Workflow

1. **Identifica la caja.** Llama `mcp__alegra-mcp__pos_pos_list-stations` para traer las estaciones.

   - Si hay una sola, úsala.
   - Si hay varias y no dijeron cuál, pregunta antes de asumir.
   - **Pasa siempre `idStation` explícito** en las llamadas siguientes. No dependas de que haya una estación activa: seleccionarla requiere una herramienta de escritura que estas skills no usan.

2. **Trae la moneda** con `mcp__alegra-mcp__currencies_getDefaultCurrency`.

3. **Ubica el turno.**
   - Para el turno de hoy que sigue abierto: `mcp__alegra-mcp__pos_pos_get-shift-status` con `idStation`.
   - Para turnos ya cerrados: `mcp__alegra-mcp__pos_pos_list-station-shifts` con `filter: "{\"status\":\"closed\"}"`, `sortDirection: "desc"` y `limit` pequeño. El primero es el último cierre.
   - Si dan un id, `mcp__alegra-mcp__pos_pos_get-shift`.

   Di siempre qué turno estás mirando: fecha, hora de apertura y cierre, y de qué caja.

4. **El resumen del turno.** Llama `mcp__alegra-mcp__pos_pos_get-shift-report` con `idStation`. De ahí salen las cifras del turno.

5. **Los medios de pago.** Llama `mcp__alegra-mcp__pos_pos_get-shift-aggregated-payments` con el `id` del turno.

   Preséntalos como tabla con monto **y porcentaje**. El porcentaje es lo que se entiende de un vistazo.

6. **Arma el cuadre de efectivo.** Es la parte que importa:

   ```
   Base inicial + efectivo vendido − retiros = esperado en caja
   esperado − contado al cerrar = diferencia
   ```

   - **Solo el efectivo cuadra.** Las tarjetas y transferencias no se cuentan en la caja física; no las metas en este cálculo.
   - Si la diferencia es negativa, falta plata. Si es positiva, sobra.
   - Muestra la diferencia también **como porcentaje del efectivo del turno**. $28.000 sobre $1.600.000 es distinto a $28.000 sobre $90.000.

7. **Si hay descuadre, ayuda a buscarlo.** No lo dejes en el número. Llama `mcp__alegra-mcp__pos_pos_get-shift-invoices` con `idShift` y revisa:
   - Ventas grandes en efectivo cerca de la apertura o el cierre
   - Facturas anuladas
   - Pagos mixtos, que son donde más se confunden

   Y llama `mcp__alegra-mcp__pos_pos_get-post-close-adjustments` con el `id` del turno: compara la foto del cierre contra el estado actual. Si algo se tocó después de cerrar, aparece ahí. Esa es la primera causa de un descuadre que "apareció solo".

8. **Facturas pendientes de emitir.** Llama `mcp__alegra-mcp__pos_pos_list-pending-emission-invoices`. Son ventas hechas que aún no tienen sello electrónico. Si hay, dilo con el número exacto: acumularlas se vuelve un problema con la DIAN, no con la caja.

9. **Cierra con lo que sirve mañana.** Proporción de efectivo, horas pico, descuadres que se repiten, facturas que siempre quedan sin emitir. Un cierre que solo reporta no enseña nada.

**Reglas:**

- **Nunca inventes montos ni turnos.** Si no hay turno abierto ni cierres recientes, dilo.
- Di siempre de qué caja y de qué turno hablas, con fecha y horas.
- **No acuses a nadie.** Un descuadre tiene muchas explicaciones y la mayoría son errores honestos. Describe el hecho y dónde buscar; las conclusiones sobre personas no le tocan a una IA.
- Si el turno sigue abierto, avisa que las cifras no están cerradas.
- Muestra siempre la moneda.

## Cómo interpretar los resultados

| Lo que ves | Qué significa | Qué hacer |
|---|---|---|
| Descuadre menor al 1% del efectivo | Vuelto mal dado, lo normal | Solo vigila que no crezca ni se repita |
| Descuadre grande y repetido | Un proceso mal hecho, no un error suelto | Revisa el conteo de base, los retiros y quién maneja la caja |
| Sobra plata en caja | Una venta se registró mal o falta registrar un ingreso | Revisa las facturas del turno, no lo dejes pasar |
| Mucho efectivo en la mezcla | Riesgo de descuadre y de manejo | Empuja medios digitales: se te reduce el problema solo |
| Facturas pendientes de emitir acumuladas | Se te está volviendo un problema tributario | Emítelas hoy y revisa por qué no salen solas |
| Cambios después del cierre | Alguien tocó el turno ya cerrado | Revisa los ajustes post-cierre antes de buscar en otro lado |

## Errores frecuentes

| Síntoma | Causa | Solución |
|---|---|---|
| No encuentra turnos | No usas turnos en Alegra POS, o miras la caja equivocada | Confirma la caja y que se abran y cierren turnos |
| El descuadre no coincide con lo que contaste | Metiste tarjetas en el cuadre de efectivo | Solo el efectivo cuadra contra la caja física |
| Las cifras cambian entre consultas | El turno sigue abierto | Espera al cierre, o avisa que el dato es parcial |
| Falta un retiro que sí hiciste | No quedó registrado en el POS | Registra los retiros en el momento, no al final |
| Aparece un descuadre que ayer no estaba | Se modificó algo después de cerrar | Mira los ajustes post-cierre del turno |

## Límites

- Esta skill solo lee. No crea, no modifica ni borra nada en tu cuenta de Alegra.
- **No cierra turnos ni emite facturas.** Te dice qué está pendiente; hacerlo lo haces tú desde el POS.
- No selecciona la caja activa: siempre le pasa el id explícito, porque seleccionarla sería escribir.
- Necesita que uses turnos en Alegra POS. Sin turnos no hay cierre que analizar.
- No sabe qué pasó en el mostrador. Un descuadre puede tener explicaciones que ningún reporte ve.
- Los datos salen de tu cuenta de Alegra, pero la interpretación la hace un modelo de IA. Antes de tomar una decisión sobre una persona, verifica en Alegra y habla con ella.
