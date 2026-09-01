# Automatizaciones

**Flujos de n8n listos para descargar, importar y poner a correr con tus datos de Alegra.**

> **Próximamente.** Esta sección está en construcción. Las [skills](../skills/) ya están disponibles.

## Qué va a haber aquí

Una skill responde cuando le preguntas. Una automatización trabaja sola: corre a una hora, revisa tus datos y te avisa cuando algo pasa.

Cada flujo va a traer:

- **`workflow.json`** — el archivo que importas en n8n.
- **`README.md`** — qué hace, qué necesitas configurar y cómo se ve el resultado.

## Los flujos previstos

### Para tu negocio

| Flujo | Qué hace | Cuándo corre |
|---|---|---|
| **Resumen diario de caja** | Te manda por WhatsApp o correo cuánta plata tienes, qué entra y qué sale hoy. | Cada mañana |
| **Alerta de cartera vencida** | Te avisa cuando una factura pasa a mora y te arma el mensaje de cobro. | Diario |
| **Aviso de stock bajo** | Te notifica qué productos llegaron al mínimo, antes de que se acaben. | Diario |
| **Reporte semanal de ventas** | Un resumen del cierre de la semana contra la anterior. | Lunes en la mañana |
| **Recordatorio de pagos por vencer** | Te avisa qué le debes a proveedores esta semana. | Lunes en la mañana |
| **Cierre de caja al correo** | Envía el reporte del turno de POS apenas se cierra. | Al cerrar turno |

### Para tu contabilidad

| Flujo | Qué hace | Cuándo corre |
|---|---|---|
| **Alerta de resolución por vencerse** | Te avisa con tiempo cuando una resolución o numeración se acerca al límite. | Semanal |
| **Chequeo previo al cierre** | Corre el checklist de cierre y te manda lo que está bloqueando el mes. | Fin de mes |
| **Recordatorio de conciliación pendiente** | Te avisa de conciliaciones en borrador y movimientos sin conciliar. | Semanal |
| **Informe mensual para tu cliente** | Arma el resumen financiero del mes y lo envía por correo. | Primer día del mes |

Los nombres y el alcance pueden cambiar. Si quieres uno en particular o tienes una idea mejor, **[proponla en un issue](https://github.com/Alegra-Team/alegra-integrations/issues/new/choose)**.

## Qué vas a necesitar

- Una instancia de **n8n** (en la nube o propia).
- El **MCP de Alegra** o la API de Alegra con tu token.
- El canal por donde quieres recibir el aviso: correo, WhatsApp, Slack, Telegram.

El paso a paso completo va a estar en cada flujo cuando se publique.

## Mientras tanto

Las [15 skills](../skills/) ya funcionan y responden estas mismas preguntas cuando se las haces. Empieza por **[Primeros pasos con el MCP](../skills/alegra-mcp-starter/)**.
