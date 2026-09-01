---
name: alegra-collections-assistant
description: >
  Te arma la lista de a quién cobrarle primero, ordenada por lo que más te
  conviene recuperar, con los días de mora de cada factura y el mensaje de cobro
  listo para enviar por WhatsApp o correo. Úsala cuando tengas plata pendiente y
  no sepas por dónde empezar.
  Trigger phrases: "a quién le cobro", "qué facturas están vencidas", "quién me
  debe", "cómo está mi cartera", "escríbeme un mensaje de cobro", "cuánto tengo
  por cobrar", "qué clientes están en mora".
allowed-tools: mcp__alegra-mcp__reports_get_receivables, mcp__alegra-mcp__reports_get_receivables_summary, mcp__alegra-mcp__contacts_getContacts, mcp__alegra-mcp__contacts_getContactByName, mcp__alegra-mcp__invoice_getInvoiceById, mcp__alegra-mcp__currencies_getDefaultCurrency
metadata:
  audiencia: pymes
  requiere: MCP de Alegra conectado (solo consulta)
  grupos-mcp: reports, contacts, invoices, currencies
  autor: manuelnarvaez-casadiego
  proposito: Recuperar la plata que ya te ganaste, empezando por donde más rinde
  fecha: 2026-09-01
  status: beta
---

# Asistente de cobros

## Qué hace por ti

Convierte tu cartera en un plan de acción. En vez de una lista de facturas vencidas, te da el orden en que conviene cobrar, cuánto vale cada gestión y el mensaje escrito y listo para copiar y pegar.

Es la plata que ya te ganaste. Esta skill te dice por dónde empezar a recuperarla.

## Para quién es

Para quien vende a crédito y persigue pagos: dueño, administrador o quien lleva la cartera.

El momento típico es el lunes o el primer día del mes, cuando toca sentarse a cobrar y no sabes a quién llamar primero.

## Qué necesitas

- El [MCP de Alegra conectado](../../../docs/conectar-mcp-alegra.md).
- Grupos habilitados en `mcp-groups`: `reports`, `contacts`, `invoices`, `currencies`.
- Facturas con **fecha de vencimiento** registrada en Alegra. Sin eso no hay días de mora que calcular.

## Cómo la usas

Escríbele a tu asistente:

- "¿A quién le cobro esta semana?"
- "¿Qué facturas tengo vencidas?"
- "¿Cuánto me debe Ferretería La 45?"
- "Escríbeme el mensaje de cobro para los tres clientes que más me deben"
- "¿Cómo está mi cartera hoy?"

## Qué te entrega

> **Cartera al 1 de septiembre de 2026 (COP)**
>
> Te deben **$22.300.000** en 14 facturas. De eso, **$14.800.000 ya están vencidos** (9 facturas).
>
> **Cóbrale primero a estos:**
>
> | # | Cliente | Monto | Vence | Mora | Por qué primero |
> |---|---|---|---|---|---|
> | 1 | Distribuidora El Progreso | $6.200.000 | 15 jul | 48 días | El monto más grande y la mora más vieja |
> | 2 | Ferretería La 45 | $3.100.000 | 02 ago | 30 días | Entra en el mes de mora |
> | 3 | Almacén Central | $2.400.000 | 12 ago | 20 días | Aún reciente, fácil de recuperar |
> | 4 | Textiles del Norte | $1.850.000 | 28 ago | 4 días | Un recordatorio amable basta |
>
> Estas 4 gestiones recuperan **$13.550.000**: el 92% de lo vencido.
>
> **Mensaje para Distribuidora El Progreso:**
>
> > Hola, ¿cómo estás? Te escribo por la factura FV-1042 por $6.200.000, que venció el 15 de julio. ¿Nos ayudas con el pago o coordinamos una fecha? Quedo atento. ¡Gracias!
>
> **Lo que aprendí de tu cartera:** el 66% de lo vencido está en un solo cliente. Vale la pena revisar el cupo de crédito que le tienes a Distribuidora El Progreso antes de seguirle vendiendo a plazo.

## Workflow

1. **Fecha de corte.** Usa hoy por defecto. Si la persona pide otra, úsala y dilo.

2. **Trae la moneda** con `mcp__alegra-mcp__currencies_getDefaultCurrency`.

3. **Panorama general.** Llama `mcp__alegra-mcp__reports_get_receivables_summary` con `asOf` = fecha de corte. Te da `missingAmount` (total pendiente) y `totalDocuments` (cuántas facturas).

4. **Detalle factura por factura.** Llama `mcp__alegra-mcp__reports_get_receivables` con `asOf` = fecha de corte. Cada fila trae `number`, `clientName`, `missingAmount`, `total`, `totalPayed`, `date`, `dueDate`, `phone`, `address`.

   - **Devuelve máximo 20 facturas.** Compara con `metadata.total`: si hay más, dilo explícitamente ("te muestro las 20 más relevantes de 34").

5. **Calcula los días de mora** de cada factura: fecha de corte menos `dueDate`. Si el resultado es negativo, la factura aún no vence: sepárala en un bloque de "por vencer".

6. **Prioriza.** Ordena por lo que más conviene gestionar. El criterio, en este orden:
   1. Monto pendiente alto (`missingAmount`)
   2. Días de mora altos
   3. Agrupa por cliente: si un cliente tiene tres facturas vencidas, es **una** gestión, no tres

   Presenta máximo 5 gestiones. Más de eso deja de ser un plan y vuelve a ser una lista.

7. **Di cuánto rinde el plan.** Suma lo que recuperan esas gestiones y qué porcentaje de lo vencido representa. Es lo que convierte la lista en decisión.

8. **Si piden el mensaje de cobro**, redáctalo con la voz de Alegra: cercano, con "tú", directo y sin sonar a abogado. Incluye número de factura, monto y fecha de vencimiento. Ofrece siempre una salida ("¿coordinamos una fecha?"). Ajusta el tono a la mora:
   - Menos de 15 días: recordatorio amable
   - De 15 a 60 días: directo, pidiendo fecha concreta
   - Más de 60 días: firme, proponiendo acuerdo de pago

9. **Si preguntan por un cliente puntual**, resuelve su id con `mcp__alegra-mcp__contacts_getContactByName` y vuelve a llamar `reports_get_receivables` con `customerId`.

10. **Cierra con un patrón, no con un total.** Si la cartera está concentrada en pocos clientes, si la mora está creciendo, si hay un cliente que siempre paga tarde: eso es lo accionable.

**Reglas:**

- **Nunca inventes datos de contacto.** Si la factura no trae `phone`, dilo en vez de suponerlo.
- Nunca inventes cifras ni facturas. Si el reporte viene vacío, di que la cartera está en cero y sugiere verificar la cuenta.
- Muestra siempre la moneda y la fecha de corte.
- No des consejo jurídico ni hables de cobro prejurídico como si supieras del caso.

## Cómo interpretar los resultados

| Lo que ves | Qué significa | Qué hacer |
|---|---|---|
| Mucho monto en pocos clientes | Riesgo concentrado | Revisa el cupo de crédito de esos clientes antes de seguir vendiendo a plazo |
| Mora promedio subiendo mes a mes | Tu proceso de cobro se está relajando | Fija un día fijo de la semana para cobrar |
| Muchas facturas pequeñas vencidas | Estás gastando más en cobrar de lo que recuperas | Automatiza el recordatorio, no lo hagas uno por uno |
| Facturas con más de 90 días | Cada día que pasa se recuperan menos | Propón acuerdo de pago o descuento por pronto pago |
| Cartera alta pero nada vencido | Vendes a plazo y te pagan a tiempo | Sano. Solo vigila que la caja aguante el plazo |

## Errores frecuentes

| Síntoma | Causa | Solución |
|---|---|---|
| No calcula días de mora | Las facturas no tienen fecha de vencimiento en Alegra | Registra los plazos al facturar. Sin eso no hay mora que medir |
| Aparece una factura ya pagada | El pago no está registrado o aplicado en Alegra | Registra el pago en Alegra y vuelve a consultar |
| Solo ves 20 facturas | Es el máximo por consulta | Pide filtrar por cliente, o pídele que te muestre solo lo vencido |
| Los montos no cuadran con tu total | Confundiste `total` con `missingAmount` | El pendiente real es `missingAmount`. `total` es el valor original de la factura |
| El mensaje de cobro suena robótico | No diste contexto de la relación | Dile cómo es ese cliente: "es cliente viejo, sé suave" |

## Límites

- Esta skill solo lee. No crea, no modifica ni borra nada en tu cuenta de Alegra.
- **No envía nada.** Te redacta el mensaje; enviarlo lo haces tú. (Enviar automáticamente es trabajo de una automatización de n8n, no de una skill.)
- No registra pagos ni marca facturas como cobradas.
- Trae máximo 20 facturas por consulta.
- No sabe qué pasó por fuera de Alegra: si acordaste un plazo por WhatsApp y no lo registraste, la skill no lo sabe.
- Los datos salen de tu cuenta de Alegra, pero la interpretación la hace un modelo de IA. Antes de reclamarle a un cliente, verifica la factura en Alegra.
