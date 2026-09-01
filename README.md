<p align="center">
  <img src="assets/banner-readme.svg" alt="Alegra Integrations" width="100%">
</p>

<h1 align="center">Alegra Integrations</h1>

<p align="center">
  <strong>Dale superpoderes a tu asistente de IA con los datos de tu negocio.</strong><br>
  Skills listas para descargar que conectan tu asistente con tu cuenta de Alegra.
</p>

<p align="center">
  <a href="#para-pymes"><img src="https://img.shields.io/badge/Pymes-7_skills-30bbb7?style=flat-square" alt="7 skills para pymes"></a>
  <a href="#para-contadores"><img src="https://img.shields.io/badge/Contadores-7_skills-4f46e5?style=flat-square" alt="7 skills para contadores"></a>
  <a href="automatizaciones/"><img src="https://img.shields.io/badge/Automatizaciones_n8n-pr%C3%B3ximamente-64748b?style=flat-square" alt="Automatizaciones n8n próximamente"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/Licencia-MIT-16a34a?style=flat-square" alt="Licencia MIT"></a>
</p>

---

## Qué es esto

Tu asistente de IA (Claude, Cursor, ChatGPT y compañía) ya sabe mucho. Lo que no sabe es **cómo va tu negocio**.

Con el **MCP de Alegra** conectado, tu asistente puede leer tus datos reales. Con las **skills de este repositorio**, además sabe *qué* preguntarles y *cómo* presentártelo.

En vez de esto:

> "Necesito el reporte de cartera de agosto, filtrado por días de mora, agrupado por cliente..."

Escribes esto:

> "¿A quién le cobro esta semana?"

Y te responde con la lista priorizada, los montos, los días de mora y el mensaje de cobro listo para enviar.

## Empieza en 3 pasos

| | Paso | Tiempo |
|---|---|---|
| **1** | [Conecta el MCP de Alegra](docs/conectar-mcp-alegra.md) a tu asistente de IA | 5 min |
| **2** | [Instala las skills](docs/instalar-skills.md) que te sirvan | 2 min |
| **3** | Pregúntale a tu asistente en español, como le hablarías a un colega | ya |

¿Nunca has hecho esto? Arranca por **[docs/empezar-aqui.md](docs/empezar-aqui.md)**.

---

## Las skills

Todas las skills de este repositorio son de **solo consulta**: leen tus datos, nunca crean, modifican ni borran nada en tu cuenta de Alegra.

### Para pymes

Para quien tiene un negocio y necesita respuestas rápidas para decidir.

| Skill | Qué te resuelve |
|---|---|
| [Radar de caja](skills/pymes/alegra-cash-radar/) | Cuánta plata tienes hoy, cuánta entra y cuánta sale esta semana |
| [Asistente de cobros](skills/pymes/alegra-collections-assistant/) | A quién cobrarle primero y con qué mensaje |
| [Pulso de ventas](skills/pymes/alegra-sales-pulse/) | Cómo van las ventas, qué se vende y quién te compra |
| [Guardián de inventario](skills/pymes/alegra-inventory-guard/) | Qué reponer ya y qué está quieto ocupando plata |
| [Chequeo de rentabilidad](skills/pymes/alegra-profit-check/) | Qué productos dejan plata de verdad |
| [Control de gastos](skills/pymes/alegra-expense-watch/) | En qué se te va la plata y qué se vence esta semana |
| [Cierre de caja del día](skills/pymes/alegra-pos-daily-close/) | El resumen del turno de tu punto de venta, sin cuadrar a mano |

### Para contadores

Para quien lleva la contabilidad de uno o varios negocios.

| Skill | Qué te resuelve |
|---|---|
| [Chequeo de cierre mensual](skills/contadores/alegra-monthly-close-check/) | Qué falta y qué está bloqueando el cierre del período |
| [Informe financiero para tu cliente](skills/contadores/alegra-financial-statements-brief/) | Balance, P&G y flujo de caja explicados en lenguaje de negocio |
| [Revisión de impuestos y retenciones](skills/contadores/alegra-tax-and-retentions/) | El consolidado del período y las inconsistencias antes de declarar |
| [Auditoría de conciliación bancaria](skills/contadores/alegra-bank-reconciliation-audit/) | Qué quedó sin conciliar y dónde está la diferencia |
| [Revisión de terceros](skills/contadores/alegra-third-party-review/) | Saldos por tercero y datos incompletos, base para exógena |
| [Auditoría de facturación electrónica](skills/contadores/alegra-einvoicing-audit/) | Resoluciones por vencerse y numeraciones por agotarse |
| [Revisión de nómina](skills/contadores/alegra-payroll-review/) | Períodos, empleados y nómina electrónica emitida o pendiente |

### Para empezar

| Skill | Qué te resuelve |
|---|---|
| [Primeros pasos con el MCP](skills/alegra-mcp-starter/) | Te conecta, valida que todo responde y te muestra qué preguntar |

Índice completo con las herramientas que usa cada una: **[skills/README.md](skills/README.md)**.

---

## Automatizaciones n8n

Próximamente: flujos de n8n en `.json` listos para importar, cada uno con su explicación. Mira lo que viene en **[automatizaciones/README.md](automatizaciones/README.md)**.

---

## Qué necesitas

- Una cuenta de **Alegra** activa.
- Tu **token de API** (Alegra → Configuración → API).
- Un cliente de IA que soporte MCP: Claude Code, Claude Desktop, Cursor, OpenCode, Codex o Antigravity.

Todo el detalle en [docs/conectar-mcp-alegra.md](docs/conectar-mcp-alegra.md).

## Aportar

¿Se te ocurre una skill que le sirva a otros negocios o contadores? Cuéntanos: abre un [Issue](https://github.com/Alegra-Team/alegra-integrations/issues/new/choose) o manda un Pull Request. La guía completa está en [CONTRIBUIR.md](CONTRIBUIR.md).

Regla número uno antes de subir cualquier cosa: **cero tokens, cero datos de clientes**. Léela en [SEGURIDAD.md](SEGURIDAD.md).

## Enlaces útiles

- [Documentación del MCP de Alegra](https://developer.alegra.com/docs/mcp-alegra)
- [API de Alegra](https://developer.alegra.com)
- [Centro de ayuda de Alegra](https://ayuda.alegra.com)
- [Sistema de diseño de Alegra](https://alegra.design/kit)

---

<p align="center">
  <sub>Hecho con cariño por el equipo de Alegra · <a href="LICENSE">MIT</a></sub>
</p>
