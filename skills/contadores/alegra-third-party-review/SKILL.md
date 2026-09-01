---
name: alegra-third-party-review
description: >
  Te muestra los saldos por tercero del período, detecta terceros con datos
  incompletos y te deja la base depurada para información exógena. Úsala cuando
  necesites saber cuánto debe cada cliente o proveedor en libros, o cuando estés
  preparando medios magnéticos.
  Trigger phrases: "saldos por tercero", "balance de prueba por tercero", "qué
  terceros tienen datos incompletos", "prepara la exógena", "cuánto me debe cada
  cliente en libros", "revisa los terceros", "terceros sin identificación".
allowed-tools: mcp__alegra-mcp__reports_get_third_party_trial_balance, mcp__alegra-mcp__accounting_listThirdParties, mcp__alegra-mcp__accounting_listThirdPartyClosings, mcp__alegra-mcp__accounting_listThirdPartyClosingAccounts, mcp__alegra-mcp__contacts_getContacts, mcp__alegra-mcp__contacts_getContactByName, mcp__alegra-mcp__currencies_getDefaultCurrency
metadata:
  audiencia: contadores
  requiere: MCP de Alegra conectado (solo consulta)
  grupos-mcp: reports, accounting, contacts, currencies
  autor: manuelnarvaez-casadiego
  proposito: Depurar terceros y cuadrar saldos antes de exógena o cierre
  fecha: 2026-09-01
  status: beta
---

# Revisión de terceros

## Qué hace por ti

Te arma el **balance de prueba por tercero**: qué cuenta contable tiene saldo, y bajo esa cuenta, qué tercero lo tiene. Y en el mismo paso te dice qué terceros están incompletos —sin identificación, sin dirección, sin tipo de régimen— que es exactamente lo que hace rebotar la exógena.

También detecta el saldo que nadie reclama: el movimiento contabilizado **sin tercero asociado**.

## Para quién es

Para el contador que prepara información exógena, que está depurando la contabilidad de un cliente nuevo, o que necesita explicar por qué la cartera contable no coincide con el auxiliar.

El momento típico: la temporada de medios magnéticos, o cuando recibes una contabilidad que no conoces y necesitas ver quién es quién.

## Qué necesitas

- El [MCP de Alegra conectado](../../../docs/conectar-mcp-alegra.md).
- Grupos habilitados en `mcp-groups`: `reports`, `accounting`, `contacts`, `currencies`.
- Movimientos contables en el período. Si no hay, el reporte viene vacío y no hay nada que revisar.

## Cómo la usas

Escríbele a tu asistente:

- "Dame los saldos por tercero de este año"
- "¿Qué terceros tienen datos incompletos?"
- "Prepárame la base para la exógena de 2026"
- "¿Cuánto debe Ferretería La 45 en libros?"
- "¿Hay movimientos sin tercero asociado?"

## Qué te entrega

> **Revisión de terceros — 1 ene a 31 ago de 2026 (COP)**
>
> 87 terceros con movimiento en el período.
>
> **Clientes por cobrar (1305)**
>
> | Tercero | NIT | Saldo final |
> |---|---|---|
> | Constructora del Valle | 900.123.456-7 | $8.900.000 |
> | Ferretería La 45 | 901.887.220-1 | $6.100.000 |
> | Almacén Central | 900.554.019-4 | $4.300.000 |
> | **Sin tercero asociado** | — | **$1.240.000** |
>
> **Proveedores por pagar (2205)**
>
> | Tercero | NIT | Saldo final |
> |---|---|---|
> | Cementos del Caribe | 890.301.884-2 | $12.400.000 |
> | Distribuciones del Sur | 901.220.775-9 | $3.850.000 |
>
> **Terceros con datos incompletos (11)**
>
> | Tercero | Qué le falta | Tiene saldo |
> |---|---|---|
> | Almacén Central | Tipo de régimen | Sí — $4.300.000 |
> | Papelería Central | Identificación, dirección | Sí — $320.000 |
> | Servicios Rápidos SAS | Dirección | No |
>
> **Lo que aprendí de tus terceros:** hay **$1.240.000 contabilizados sin tercero** en cuentas por cobrar. En el balance cuadra, pero cuando armes la exógena ese valor no tiene a quién reportarle. Vale la pena rastrear esos comprobantes antes de que sea marzo.
>
> De los 11 terceros incompletos, **4 tienen saldo**. Esos son los urgentes; los otros 7 pueden esperar.

## Workflow

1. **Define el período.** Si la persona no lo dice, para exógena usa el **año fiscal completo**; para depuración normal, el año en curso hasta hoy. Dilo siempre en la respuesta.

2. **Trae la moneda** con `mcp__alegra-mcp__currencies_getDefaultCurrency`.

3. **Balance de prueba por tercero.** Llama `mcp__alegra-mcp__reports_get_third_party_trial_balance` con `fromDate` y `toDate` (formato `YYYY-MM-DD`).

   La respuesta es un **árbol anidado**, no una tabla plana:
   - Las raíces son los tipos de cuenta (`assets`, `liabilities`, `equity`, `income`, `expense`).
   - Cada nodo trae `previousBalance`, `debit`, `credit`, `finalBalance` **como texto decimal** — conviértelos a número antes de sumar.
   - `children[]` baja por la jerarquía del PUC.
   - `thirdPartyLines[]` es el desglose por tercero **bajo la cuenta que lo tenga**. Ahí es donde está el dato.

   `rowsCount` es el número de **terceros con movimiento en el período**, no el total de contactos de la empresa. No lo presentes como "tienes 87 clientes".

4. **Recorre el árbol hasta las hojas.** Los saldos por tercero viven en las cuentas de detalle. Un nodo padre normalmente no trae `thirdPartyLines`, así que si te quedas arriba no ves nada.

   Prioriza las cuentas que le importan al contador: cartera, proveedores, anticipos, cuentas por cobrar y por pagar a socios.

5. **Marca los movimientos sin tercero.** Si una línea aparece como tercero no asociado, **no la escondas**. Es de los hallazgos más útiles del reporte: cuadra en el balance pero no tiene a quién reportarle en exógena.

6. **Filtra por un tercero puntual, si te lo piden.** El mismo reporte acepta `idClient`. Si el tercero no tuvo movimiento en el período, la respuesta viene vacía (`rowsCount: 0`) — eso es válido y significa "no se movió", no "no existe".

   Para resolver el id a partir del nombre usa `mcp__alegra-mcp__accounting_listThirdParties` con `name` (búsqueda parcial). Devuelve `id`, `idGlobal`, `name`, `identification` y `type`. Si hay varios parecidos, muéstralos y deja que la persona elija.

7. **Revisa la calidad de los datos.** Llama `mcp__alegra-mcp__contacts_getContacts` con `params: {mode: "advanced", limit: 30, status: "active", metadata: true}`.

   - `metadata: true` te devuelve el total, para que puedas decir cuántos revisaste de cuántos.
   - **Máximo 30 por llamada.** Pagina con `start` (0, 30, 60…), máximo 3 páginas. Después de eso, dile a la persona que filtre.
   - Para un tercero puntual, `mcp__alegra-mcp__contacts_getContactByName` es más directo.

   Marca como incompleto al que le falte: identificación, dirección, correo, teléfono o tipo de régimen.

8. **Cruza incompletitud con saldo.** Este es el paso que hace útil la skill. Un tercero incompleto **con saldo** es urgente: va a aparecer en la exógena. Uno incompleto **sin saldo** es higiene, puede esperar.

   Ordena la tabla por esa distinción, no alfabéticamente.

9. **Cierres por terceros, solo si aplica.** Llama `mcp__alegra-mcp__accounting_listThirdPartyClosings` (no recibe parámetros). Devuelve `idClosing`, `period`, `status` y `accountingDocumentId`.

   Estados posibles: `OPENED`, `CREATED`, `STARTED`, `TASK_FINISHED`, `FINISHED`, `ERROR`, `DRAFT`, `CANCELLED`.

   - `FINISHED` — el cierre corrió bien.
   - `ERROR` o `DRAFT` — quedó a medias. Menciónalo: el saldo de esos terceros no está donde debería.
   - Si la lista viene vacía, la empresa nunca ha hecho cierre por terceros. No es un error, solo dilo.

   Para saber qué cuentas tuvieron movimiento y son elegibles en un cierre, usa `mcp__alegra-mcp__accounting_listThirdPartyClosingAccounts` con `from` y `to`.

10. **Cierra con lo accionable.** Cuántos terceros hay que completar antes de exógena, cuánto saldo está sin tercero, y qué cuenta tiene la mayor concentración en un solo tercero.

**Reglas:**

- **Nunca inventes un NIT ni completes un dato faltante.** Si falta, dilo tal cual: "sin identificación registrada".
- Los montos vienen como texto decimal. Conviértelos antes de operar o vas a concatenar en vez de sumar.
- Muestra siempre el **nombre** de la cuenta y del tercero, nunca solo el id.
- Distingue **saldo débito** de **saldo crédito**. Un proveedor con saldo débito normalmente es un anticipo o un pago de más; vale la pena señalarlo.
- Si un reporte viene vacío, dilo. Vacío no es cero.
- No prepares ni presentes la exógena. Dejas la base revisada; el formato y el envío los haces tú.

## Cómo interpretar los resultados

| Lo que ves | Qué significa | Qué hacer |
|---|---|---|
| Saldo en "sin tercero asociado" | Comprobantes contabilizados sin identificar a quién | Rastrear esos asientos antes de exógena. Es el hallazgo más urgente |
| Tercero incompleto con saldo | Va a aparecer en exógena sin los datos que exige | Completar identificación, dirección y régimen ya |
| Proveedor con saldo débito | Anticipo, pago doble o nota mal aplicada | Revisar el auxiliar de ese tercero |
| Cliente con saldo crédito | Pagó de más, o hay un anticipo sin cruzar | Cruzar el anticipo contra la factura pendiente |
| Un tercero concentra la mayoría de la cartera | Riesgo de concentración, y de exposición si se cae | Informarlo al cliente aunque no sea tema contable |
| Cierre por terceros en `ERROR` o `DRAFT` | El proceso no terminó; los saldos no se reclasificaron | Revisar en Alegra por qué falló antes de cerrar el año |
| `rowsCount: 0` con período válido | No hubo movimientos, o el filtro de tercero no aplica | Ampliar el período o quitar el filtro |

## Errores frecuentes

| Síntoma | Causa | Solución |
|---|---|---|
| El reporte se ve vacío pero sabes que hay movimientos | Las fechas están mal, o filtraste por un tercero sin movimiento | Verifica `fromDate`/`toDate` en formato `YYYY-MM-DD` y quita `idClient` |
| Los saldos no cuadran con el balance de prueba normal | El de terceros solo desglosa cuentas que manejan tercero | Es esperado. Compara solo las cuentas que sí lo manejan |
| Solo aparecen 30 terceros | Es el máximo por consulta de contactos | Pide la siguiente página o filtra por nombre |
| Las sumas dan números raros o pegados | Los montos vienen como texto y se están concatenando | Conviértelos a número antes de sumar |
| No aparece el tercero que buscas | Está inactivo, o el nombre no coincide | Busca con `accounting_listThirdParties` por nombre parcial |
| Un tercero aparece dos veces con NIT distinto | Está duplicado en Alegra | Unifícalo en Alegra antes de exógena |

## Límites

- Esta skill solo lee. No crea, no modifica ni borra nada en tu cuenta de Alegra. **No completa datos de terceros ni ejecuta cierres.**
- **No prepara ni presenta información exógena.** No arma formatos de la DIAN ni valida contra sus especificaciones. Te deja la base revisada para que la trabajes.
- No da asesoría tributaria. No decide qué tercero va en qué formato ni qué tope aplica.
- Trae máximo 30 contactos por consulta y hasta 3 páginas. Siempre te dice cuántos revisó del total.
- `accounting_listThirdParties` solo devuelve terceros **activos**. Un tercero inactivo con saldo no aparece ahí, aunque sí en el balance por tercero.
- Solo ve lo registrado en Alegra. Si un tercero tiene el NIT mal escrito, la skill lo lee tal cual: no valida dígitos de verificación.
- Los datos salen de tu cuenta de Alegra, pero la interpretación la hace un modelo de IA. Antes de reportar a la autoridad tributaria, verifica en Alegra.
