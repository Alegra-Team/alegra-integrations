# Chequeo de cierre mensual

**Si el período se puede cerrar, qué lo está bloqueando y qué falta cuadrar.**

Es el checklist que igual ibas a hacer, hecho en 30 segundos.

## Para quién es

Para el contador o quien responde por el cierre, propio o de sus clientes. El momento típico: los primeros días del mes, antes de intentar el cierre. O cuando el cierre se quedó trabado y no sabes en qué paso.

## Cómo se ve

**Le escribes:**

> ¿Puedo cerrar agosto?

**Te responde:**

> El período está **abierto**, pero hay una ejecución de cierre en estado `error`, detenida en el paso `inventory`.
>
> | Punto | Estado |
> |---|---|
> | Período contable | Abierto |
> | Proceso de cierre | Error en `inventory` (ejecución 4821) |
> | Períodos cerrados de 2026 | Enero a julio |
> | Balance de prueba | Cuadrado: $184.320.000 = $184.320.000 |
>
> Mientras esa ejecución siga en error, no vas a poder correr otro cierre para el mismo período. Ese es el bloqueo real, no el balance.
>
> Los seis meses anteriores cerraron sin errores. Una falla en inventario suele significar costos sin calcular o movimientos de bodega sin registrar.

## Instalar

```bash
git clone https://github.com/Alegra-Team/alegra-integrations.git
cp -r alegra-integrations/skills/contadores/alegra-monthly-close-check ~/.claude/skills/
```

Reinicia tu asistente y pregúntale *"¿qué falta para cerrar el mes?"*.

Otros clientes de IA y el paso a paso completo: **[docs/instalar-skills.md](../../../docs/instalar-skills.md)**.

## Qué necesitas

- El [MCP de Alegra conectado](../../../docs/conectar-mcp-alegra.md)
- Grupos: `accounting`, `reports`, `currencies`

## Bueno saber

Esta skill **solo lee**. No cierra, no reabre ni modifica nada en tu cuenta de Alegra.

No hace asientos de ajuste ni de reclasificación, y no reemplaza tu papel de trabajo. Te señala dónde mirar; el criterio profesional es de quien firma.

Distingue dos cosas que suelen confundirse: el **estado del período** (abierto o cerrado) y el **estado de la ejecución** del cierre (en proceso, procesada o con error).

## Va bien con

- [Auditoría de conciliación bancaria](../alegra-bank-reconciliation-audit/) — lo bancario que hay que cuadrar antes de cerrar
- [Revisión de impuestos y retenciones](../alegra-tax-and-retentions/) — el otro frente del cierre
- [Informe financiero para tu cliente](../alegra-financial-statements-brief/) — lo que viene después de cerrar
