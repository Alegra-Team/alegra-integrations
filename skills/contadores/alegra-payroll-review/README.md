# Revisión de nómina

**Qué se liquidó, qué se pagó y qué falta por emitir. Que son tres cosas distintas y se confunden todo el tiempo.**

Una nómina puede estar liquidada, pagada y sin emitir. Ese hueco es el que esta skill encuentra.

## Para quién es

Para el contador que responde por la nómina de uno o varios clientes, y para quien la administra dentro de la empresa. El momento típico: los días previos al cierre, o cuando se acerca la fecha límite de emisión de nómina electrónica.

## Cómo se ve

**Le escribes:**

> ¿Qué nómina electrónica me falta por emitir?

**Te responde:**

> En agosto tienes **14 empleados activos**. Las 14 nóminas quedaron liquidadas, pero:
>
> | Empleado | Liquidada | Pagada | Emitida |
> |---|---|---|---|
> | Ana Restrepo | Sí | **No** | No |
> | Julián Ospina | Sí | **No** | No |
> | Camilo Bedoya | Sí | Sí | **No** |
>
> El hueco no está en la liquidación: está después. Dos personas sin registro de pago y **tres sin emitir la nómina electrónica**.
>
> Empieza por la emisión. Es lo único que corre contra reloj: tiene fecha límite y no depende de ti una vez pasa.

## Instalar

```bash
git clone https://github.com/Alegra-Team/alegra-integrations.git
cp -r alegra-integrations/skills/contadores/alegra-payroll-review ~/.claude/skills/
```

Reinicia tu asistente y pregúntale *"revisa la nómina de este mes"*.

Otros clientes de IA y el paso a paso completo: **[docs/instalar-skills.md](../../../docs/instalar-skills.md)**.

## Qué necesitas

- El [MCP de Alegra conectado](../../../docs/conectar-mcp-alegra.md)
- Grupos: `payroll`, `currencies`
- **Nómina activa en Alegra.** Si la empresa no la usa, la skill no tiene nada que leer y te lo dice.

## Bueno saber

Esta skill **solo lee**. No liquida, no paga y no emite nómina electrónica.

**No calcula prestaciones, aportes ni retenciones**, y no da asesoría laboral. Lee lo que Alegra ya liquidó.

No opina sobre salarios ni compara lo que gana una persona con otra.

Nunca inventa una cifra de nómina. Si un dato no está, te lo dice.

## Va bien con

- [Chequeo de cierre mensual](../alegra-monthly-close-check/) — la nómina es uno de los puntos que hay que cuadrar antes de cerrar
- [Revisión de impuestos y retenciones](../alegra-tax-and-retentions/) — la retención de nómina también entra en la declaración
