# Revisión de impuestos y retenciones

**El consolidado de IVA y retenciones del período —practicadas y recibidas— con el detalle documento por documento y las inconsistencias que conviene mirar antes de declarar.**

No llena el formulario. Te deja las cifras listas y revisadas para que lo llenes sin sorpresas.

## Para quién es

Para el contador que prepara declaraciones de IVA y retención en la fuente, propias o de sus clientes. El momento típico: los días previos al vencimiento.

## Cómo se ve

**Le escribes:**

> Dame el consolidado de retenciones de agosto

**Te responde:**

> **Retenciones practicadas**
>
> | Concepto | Base | Retenido | Docs |
> |---|---|---|---|
> | Retefuente servicios 4% | $8.400.000 | $336.000 | 14 |
> | Retefuente compras 2,5% | $12.100.000 | $302.500 | 9 |
> | ReteIVA 15% | $2.300.000 | $345.000 | 6 |
> | **Total** | | **$983.500** | **29** |
>
> **Puntos a revisar antes de declarar:**
>
> - 3 facturas de compra por encima de la base sin retención aplicada
> - ReteICA con una sola tarifa: si el cliente opera en varios municipios, revisa
> - 2 terceros sin tipo de régimen registrado

## Instalar

```bash
git clone https://github.com/Alegra-Team/alegra-integrations.git
cp -r alegra-integrations/skills/contadores/alegra-tax-and-retentions ~/.claude/skills/
```

Reinicia tu asistente y pregúntale *"¿cuánto IVA tengo que declarar?"*.

Otros clientes de IA y el paso a paso completo: **[docs/instalar-skills.md](../../../docs/instalar-skills.md)**.

## Qué necesitas

- El [MCP de Alegra conectado](../../../docs/conectar-mcp-alegra.md)
- Grupos: `reports`, `retentions`, `taxes`, `gastos`, `contacts`, `currencies`
- Impuestos y retenciones **configurados en Alegra** y aplicados en los documentos

## Bueno saber

Esta skill **solo lee**. No crea, no modifica ni borra nada en tu cuenta de Alegra.

**No presenta declaraciones, no llena formularios y no da asesoría tributaria.** No interpreta normas ni decide si algo es gravado o exento. Consolida las cifras y señala qué revisar.

Las retenciones se consultan distinto en México que en el resto de países. La skill lo maneja, pero por eso te pregunta o confirma el país.

Antes de presentar una declaración, verifica todas las cifras en Alegra.

## Va bien con

- [Chequeo de cierre mensual](../alegra-monthly-close-check/) — cuadra la contabilidad antes de sacar las cifras fiscales
- [Revisión de terceros](../alegra-third-party-review/) — los terceros incompletos que aparecen aquí se depuran allá
