# Automatizaciones

**Diez flujos de n8n listos para descargar, importar y poner a correr con tus datos de
Alegra.**

Una skill responde cuando le preguntas. Una automatización trabaja sola: corre a una hora,
o reacciona a algo que pasó, revisa tus datos y te avisa.

**¿Primera vez?** → **[Empezar aquí](EMPEZAR-AQUI.md)**. En 15 minutos tienes la primera
corriendo.

---

## Para tu negocio

| Flujo | Qué hace | Cuándo corre | Destino |
|---|---|---|---|
| **[Radar de cartera en Notion](n8n/alegra-receivables-aging-to-notion/)** | Te arma un tablero con quién te debe, cuánto y hace cuántos días, ordenado por prioridad. | Diario, 7:00 | Notion |
| **[Recordatorios de cobro](n8n/alegra-overdue-invoice-reminders/)** | Un solo correo por cliente con todas sus facturas vencidas, listo para revisar antes de enviarlo. | L-V, 8:00 | Gmail |
| **[Alerta de reposición](n8n/alegra-low-stock-reorder-alert/)** | Qué productos están por acabarse, con cuántos días de cobertura te quedan según lo que vendiste. | Diario, 6:30 | Notion + Telegram |
| **[Facturación recurrente del mes](n8n/alegra-monthly-recurring-billing-run/)** | Crea las facturas de tus clientes fijos en borrador, sin repetir las que ya existen. | Día 1 | Gmail |
| **[Seguimiento a cotizaciones frías](n8n/alegra-stale-estimate-followup/)** | Qué cotizaciones nunca se volvieron factura, y un formulario para convertir la que quieras. | Semanal + a mano | Gmail |
| **[Bienvenida a un cliente nuevo](n8n/alegra-new-client-onboarding/)** | Apenas registras un cliente, te dice qué datos le faltan y le arma la ficha. | Al crear un cliente | Notion + Gmail |

## Para tu contabilidad

| Flujo | Qué hace | Cuándo corre | Destino |
|---|---|---|---|
| **[Calendario de pagos](n8n/alegra-payables-calendar/)** | Todo lo que hay que pagar en 15 días, ordenado por urgencia y sumado por semana. | Lunes, 7:00 | Sheets + Gmail |
| **[Guardián de facturas duplicadas](n8n/alegra-duplicate-bill-guard/)** | Cuando entra una factura de proveedor, revisa si ya registraste una igual. | Al registrar una compra | Telegram |
| **[Guardián de anomalías](n8n/alegra-invoice-anomaly-guard/)** | Revisa cada factura de venta contra seis reglas y te avisa solo si algo no cuadra. | Al crear o editar una venta | Telegram |
| **[Checklist de cierre de mes](n8n/alegra-month-close-checklist/)** | Todo lo que quedó pendiente del mes que cerró, con qué hacer con cada cosa. | Día 1 | Sheets + Gmail |

**Auxiliar:** **[Registrar un webhook](n8n/_registrar-webhook/)** — conecta los tres flujos
que reaccionan a eventos, sin abrir una terminal.

---

## Qué necesitas

| | |
|---|---|
| **Una cuenta de n8n** | En la nube o instalada. Los siete flujos por horario funcionan igual en las dos. Los tres por evento necesitan que Alegra pueda alcanzar tu n8n desde internet |
| **Tu token de Alegra** | Se saca en dos minutos: [cómo](OBTENER-TOKEN-ALEGRA.md) |
| **El destino** | Notion, Google Sheets, Gmail o Telegram, según el flujo: [cuál necesita cuál](CREDENCIALES.md) |

---

## Las guías

| | |
|---|---|
| **[Empezar aquí](EMPEZAR-AQUI.md)** | La ruta de 15 minutos, de cero a un flujo corriendo |
| **[Obtener tu token de Alegra](OBTENER-TOKEN-ALEGRA.md)** | Dónde está, cómo se conecta y cómo se cuida |
| **[Credenciales](CREDENCIALES.md)** | Notion, Google Sheets, Gmail y Telegram, una ficha cada uno |
| **[Cómo importar un flujo](COMO-IMPORTAR.md)** | Los cinco pasos, y qué hacer si algo falla |
| **[Conectar los webhooks de Alegra](CONECTAR-WEBHOOKS-ALEGRA.md)** | Para los tres flujos que reaccionan a eventos |

---

## Qué las hace distintas

Alegra ya se conecta con muchas herramientas, pero casi siempre en un solo paso: pasa esto,
haz aquello. Estas diez hacen lo que ese modelo no puede:

- **Traen todo, no los primeros 30.** Alegra entrega máximo 30 registros por consulta. Todos
  estos flujos piden página por página hasta completar.
- **Agregan y calculan.** Días de mora, promedio histórico de un cliente, días de cobertura
  de inventario, totales por semana. No solo mueven datos: los interpretan.
- **Cruzan endpoints.** El seguimiento a cotizaciones sabe cuáles se convirtieron porque
  compara cotizaciones contra facturas. Alegra no expone ese dato directamente.
- **Consolidan.** El recordatorio de cobro manda **un** correo por cliente con todas sus
  facturas, no un correo por factura.

---

## Seguridad

**Ningún `workflow.json` de esta carpeta contiene un token, una clave, un correo real ni el
id de un documento tuyo.** Las credenciales se referencian solo por nombre —`Alegra API`—,
que es un rótulo que n8n resuelve contra su propio almacén cifrado.

Lo que sí tienen son marcadores explícitos: `REEMPLAZAR_DATABASE_ID`,
`REEMPLAZAR_SPREADSHEET_ID`, `REEMPLAZAR_CORREO_DESTINO`, `REEMPLAZAR_CHAT_ID`.

Antes de subir cualquier flujo aquí hay que correr:

```
node scripts/revisar-flujos.js
node scripts/sanitize-workflow.js --check automatizaciones/n8n/*/workflow.json
```

El primero revisa que el flujo esté bien armado; el segundo, que no se haya colado ningún
secreto. Los dos corren también en CI y bloquean el pull request si algo falla.

### Los flujos que escriben en Alegra

Tres de los diez crean o modifican cosas. Todos con la misma protección:

- **El nodo que escribe viene desactivado.** La primera corrida te muestra qué *habría*
  hecho, sin hacer nada.
- **Nunca reintenta.** Un reintento automático crearía documentos duplicados.
- **Las facturas quedan en borrador.** Nada se emite sin que una persona lo revise en
  Alegra.

---

## Falta algo que necesitas

**[Propónlo en un issue](https://github.com/Alegra-Team/alegra-integrations/issues/new/choose)**.
Y si quieres aportar un flujo, mira **[CONTRIBUIR.md](../CONTRIBUIR.md)**.

## También te sirve

Las **[15 skills](../skills/)** responden estas mismas preguntas cuando se las haces, sin
programar nada. Empieza por **[Primeros pasos con el MCP](../skills/alegra-mcp-starter/)**.
