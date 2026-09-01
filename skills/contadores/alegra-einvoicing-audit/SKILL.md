---
name: alegra-einvoicing-audit
description: >
  Revisa tus resoluciones y numeraciones de facturación: cuáles están por
  vencerse, a cuáles les quedan pocos números y cuáles ya no sirven. Úsala antes
  de quedarte sin numeración a mitad de mes o de facturar con una resolución
  vencida.
  Trigger phrases: "revisa mis resoluciones", "cuándo se vence mi resolución",
  "cuántos números me quedan", "auditoría de facturación electrónica", "qué
  numeraciones tengo activas", "me voy a quedar sin consecutivo", "resolución de
  facturación".
allowed-tools: mcp__alegra-mcp__resolutions_getResolutionss, mcp__alegra-mcp__resolutions_getResolutionById, mcp__alegra-mcp__resolutions_getDefaultResolutions, mcp__alegra-mcp__invoice_getInvoices, mcp__alegra-mcp__currencies_getDefaultCurrency
metadata:
  audiencia: contadores
  requiere: MCP de Alegra conectado (solo consulta)
  grupos-mcp: resolutions, invoices, currencies
  autor: manuelnarvaez-casadiego
  proposito: No quedarse sin numeración ni facturar con resolución vencida
  fecha: 2026-09-01
  status: beta
---

# Auditoría de facturación electrónica

## Qué hace por ti

Te revisa las resoluciones y numeraciones de facturación de la empresa y te dice tres cosas: **cuánto tiempo les queda**, **cuántos números les quedan** y **cuál se va a acabar primero**.

Quedarse sin numeración a mitad de mes para la facturación. Es de los problemas más evitables que existen, y también de los más frecuentes.

## Para quién es

Para el contador que responde por la facturación de uno o varios clientes, y para quien administra la facturación en una empresa que factura mucho.

El momento típico: el chequeo mensual, o cuando alguien pregunta "¿hasta cuándo me sirve esta resolución?".

## Qué necesitas

- El [MCP de Alegra conectado](../../../docs/conectar-mcp-alegra.md).
- Grupos habilitados en `mcp-groups`: `resolutions`, `invoices`, `currencies`.
- Resoluciones o numeraciones creadas en Alegra. Si solo tienes la numeración por defecto sin resolución, la skill te lo dice.

## Cómo la usas

Escríbele a tu asistente:

- "Revisa mis resoluciones de facturación"
- "¿Cuándo se me vence la resolución?"
- "¿Cuántos números me quedan de la numeración principal?"
- "¿Voy a alcanzar a facturar el resto del año con esta resolución?"
- "¿Qué numeraciones tengo activas para notas crédito?"

## Qué te entrega

> **Resoluciones y numeraciones — al 1 de septiembre de 2026**
>
> **Facturas de venta**
>
> | Numeración | Resolución | Vence | Rango | Va en | Quedan |
> |---|---|---|---|---|---|
> | FE (electrónica) | 18764000012345 | 14 nov 2026 | 1 – 5.000 | 4.612 | **388 números** |
> | POS | 18764000098765 | 3 mar 2027 | 1 – 50.000 | 12.840 | 37.160 números |
> | Principal | — sin resolución | — | sin tope | 1 | — |
>
> **Notas crédito**
>
> | Numeración | Resolución | Vence | Quedan |
> |---|---|---|---|
> | NC | 18764000055512 | 14 nov 2026 | 4.870 números |
>
> **Lo urgente:** a la numeración **FE le quedan 388 números** y vence el **14 de noviembre**, en 74 días. Vas a **74 facturas de promedio al mes**, o sea unos 180 en lo que queda de vigencia. Por números alcanzas; por fecha, no: **se te vence antes de agotarse**.
>
> Solicita la resolución nueva ya. Entre el trámite y la habilitación se van semanas, y facturar con resolución vencida no es una opción.
>
> **Ojo con esto:** la numeración **"Principal" no tiene resolución asociada** (sin número, sin fechas, sin tope) y está marcada como predeterminada. Si alguien factura por ahí sin darse cuenta, esa factura sale sin respaldo de resolución.

## Workflow

1. **Trae las numeraciones de facturas.** Llama `mcp__alegra-mcp__resolutions_getResolutionss` con `documentType: "invoice"` y `status: "active"`.

   Cada registro trae:

   | Campo | Qué es |
   |---|---|
   | `name` | Nombre de la numeración |
   | `prefix` | Prefijo (puede ser `null`) |
   | `resolutionNumber` | Número de la resolución ante la autoridad |
   | `startDate` / `endDate` | Vigencia |
   | `minInvoiceNumber` / `maxInvoiceNumber` | Rango autorizado |
   | `nextInvoiceNumber` | El próximo consecutivo que va a usar |
   | `isElectronic` | Si es facturación electrónica |
   | `isDefault` | Si es la predeterminada |
   | `status` | `active` / `inactive` |
   | `autoincrement` | Si el consecutivo avanza solo |

2. **Repite para los otros tipos de documento.** `documentType` acepta: `invoice`, `estimate`, `transactionIn`, `transactionOut`, `creditNote`, `debitNote`, `incomeDebitNote`.

   Revisa siempre al menos `invoice` y `creditNote`. Los demás, solo si la persona los usa o los pide.

3. **Identifica la predeterminada** de cada tipo con `mcp__alegra-mcp__resolutions_getDefaultResolutions` (`documentType` obligatorio). Es la que se usa cuando nadie elige otra, así que es la que más importa.

4. **Trae el detalle de las que importan.** El listado no siempre alcanza. Para la numeración electrónica y la predeterminada, llama `mcp__alegra-mcp__resolutions_getResolutionById` con el `id`: ahí vienen `startDate`, `endDate`, `resolutionNumber` y `minInvoiceNumber`.

5. **Calcula lo que queda. Dos cosas distintas:**

   ```
   Números disponibles = maxInvoiceNumber − nextInvoiceNumber + 1
   Días de vigencia    = endDate − hoy
   ```

   **Las dos se agotan por separado.** Puede sobrarte numeración y vencérsete la fecha, o al revés. Di siempre cuál de las dos llega primero — es la respuesta que la persona necesita.

   Si `maxInvoiceNumber` es `null`, no hay tope: solo aplica la fecha.

6. **Trata los campos nulos como un hallazgo, no como un dato faltante.** Una numeración con `resolutionNumber`, `startDate`, `endDate` y `maxInvoiceNumber` todos en `null` **no es una resolución**: es una numeración interna sin respaldo.

   No es un error en sí —sirve para documentos que no requieren resolución— pero **si además está marcada `isDefault: true`, dilo con claridad**. Es el escenario donde alguien factura sin respaldo sin darse cuenta.

7. **Estima el ritmo de facturación.** Llama `mcp__alegra-mcp__invoice_getInvoices` con `date_afterOrNow` y `date_beforeOrNow` acotando los últimos 30 o 90 días, y `metadata: true` para traer el total sin descargar todo.

   Con el promedio mensual, proyecta: *"a este ritmo, la numeración te alcanza hasta X"*. Una resolución con 388 números es tranquilidad para quien factura 40 al mes y una emergencia para quien factura 400.

   - **Máximo 30 facturas por página.** Usa `metadata: true` y no pagines solo para contar.
   - Deja `detail` en `false`. No necesitas los ítems para contar facturas.

8. **Revisa facturas con problemas de emisión, si te lo piden.** El mismo `invoice_getInvoices` acepta `status`. Filtra por el estado que la persona quiere revisar y usa `numberTemplate_fullNumber` para buscar una factura puntual.

   No inventes estados: usa los que devuelva Alegra tal cual.

9. **Ordena por urgencia.** Primero lo que se vence o se agota antes, sin importar el tipo de documento. Una nota crédito sin numeración disponible también frena la operación.

   Usa estos umbrales para el semáforo:

   | Señal | Umbral |
   |---|---|
   | Urgente | Menos de 60 días de vigencia, o menos de 2 meses de numeración al ritmo actual |
   | Atención | Entre 60 y 120 días, o entre 2 y 4 meses de numeración |
   | Tranquilo | Más de 120 días y más de 4 meses de numeración |

10. **Cierra con la acción y el tiempo que toma.** No basta con decir "se vence en 74 días": lo útil es que solicitar y habilitar una resolución nueva toma semanas, así que el momento de moverse es ahora.

**Reglas:**

- Nunca inventes un número de resolución, una fecha ni un rango. Si viene `null`, di "sin resolución asociada".
- Muestra siempre el **nombre y el prefijo** de la numeración. Un id no le sirve a nadie.
- Distingue **electrónica** (`isElectronic: true`) de la que no lo es. Los plazos y las consecuencias no son los mismos.
- No cuentes las inactivas como disponibles. Menciónalas aparte solo si son relevantes.
- Di siempre la fecha desde la que estás contando ("al 1 de septiembre de 2026").
- Si `nextInvoiceNumber` ya superó a `maxInvoiceNumber`, esa numeración **está agotada**. Dilo de una, arriba de todo.

## Cómo interpretar los resultados

| Lo que ves | Qué significa | Qué hacer |
|---|---|---|
| `endDate` a menos de 60 días | La resolución se vence pronto | Solicita la nueva ya. El trámite y la habilitación toman semanas |
| Quedan pocos números al ritmo actual | Te vas a quedar sin consecutivo | Solicita ampliación de rango antes de agotarlo |
| `nextInvoiceNumber` > `maxInvoiceNumber` | La numeración ya está agotada | No se puede facturar por ahí. Urgente |
| `resolutionNumber` y `endDate` en `null` | Numeración sin resolución asociada | Normal en documentos que no la requieren. Revisa si es la predeterminada |
| `isDefault: true` en una numeración sin resolución | Se factura por defecto sin respaldo | Cambia la predeterminada a la que sí tiene resolución |
| Varias numeraciones activas del mismo tipo | Puede ser intencional (POS y venta) o desorden | Confirma cuál usa cada canal |
| `autoincrement: false` | El consecutivo se digita a mano | Alto riesgo de saltos y duplicados. Revisa la secuencia |
| Vigencia larga pero pocos números | Se agota el rango antes que la fecha | Pide ampliación de rango, no de vigencia |

## Errores frecuentes

| Síntoma | Causa | Solución |
|---|---|---|
| No aparecen resoluciones | Filtraste por `status: "active"` y están inactivas | Consulta sin filtro de estado |
| Solo sale una numeración "Principal" sin datos | La empresa no tiene resoluciones cargadas | Es un hallazgo: revisa si debería tenerlas |
| Las fechas vienen vacías en el listado | El listado no siempre trae el detalle completo | Consulta esa numeración por `id` |
| No cuadra el conteo de facturas | Estás contando páginas de 30 | Usa `metadata: true` para el total real |
| Faltan las notas crédito | Solo consultaste `documentType: "invoice"` | Repite con `creditNote` y los demás tipos |
| Dice que quedan muchos números pero se acabaron | Estás restando desde `minInvoiceNumber` y no desde `nextInvoiceNumber` | Usa `maxInvoiceNumber − nextInvoiceNumber + 1` |

## Límites

- Esta skill solo lee. No crea, no modifica ni borra nada en tu cuenta de Alegra. **No solicita resoluciones ni las habilita.**
- **No se conecta con la DIAN ni con ninguna autoridad tributaria.** Solo ve lo que está registrado en Alegra. Si una resolución está mal cargada, la skill la lee mal.
- No valida el estado de habilitación del proveedor tecnológico ni el envío de documentos a la autoridad.
- No da asesoría tributaria ni interpreta normas de facturación electrónica.
- La proyección de consumo es una estimación basada en tu ritmo reciente. Si facturas por temporadas, ajústala con criterio.
- Máximo 30 facturas por página al consultar.
- Los datos salen de tu cuenta de Alegra, pero la interpretación la hace un modelo de IA. Antes de solicitar o dejar vencer una resolución, verifica en Alegra.
