# Revisión de terceros

**Los saldos por tercero del período, los terceros con datos incompletos y el saldo que está contabilizado sin dueño.**

Todo cuadra en el balance. La pregunta es a quién se lo vas a reportar.

## Para quién es

Para el contador que prepara información exógena, depura una contabilidad que acaba de recibir, o necesita explicar por qué la cartera contable no coincide con el auxiliar. El momento típico: la temporada de medios magnéticos.

## Cómo se ve

**Le escribes:**

> ¿Qué terceros tienen datos incompletos?

**Te responde:**

> De 87 terceros con movimiento este año, **11 están incompletos**. Pero solo **4 tienen saldo** — esos son los que te van a doler en la exógena:
>
> | Tercero | Qué le falta | Saldo |
> |---|---|---|
> | Almacén Central | Tipo de régimen | $4.300.000 |
> | Papelería Central | Identificación, dirección | $320.000 |
>
> Aparte, y esto es lo importante: hay **$1.240.000 en cuentas por cobrar sin tercero asociado**. En el balance cuadra perfecto, pero cuando armes la exógena ese valor no tiene a quién reportarle.
>
> Vale la pena rastrear esos comprobantes ahora y no en marzo.

## Instalar

```bash
git clone https://github.com/Alegra-Team/alegra-integrations.git
cp -r alegra-integrations/skills/contadores/alegra-third-party-review ~/.claude/skills/
```

Reinicia tu asistente y pregúntale *"dame los saldos por tercero de este año"*.

Otros clientes de IA y el paso a paso completo: **[docs/instalar-skills.md](../../../docs/instalar-skills.md)**.

## Qué necesitas

- El [MCP de Alegra conectado](../../../docs/conectar-mcp-alegra.md)
- Grupos: `reports`, `accounting`, `contacts`, `currencies`
- Movimientos contables en el período

## Bueno saber

Esta skill **solo lee**. No completa datos de terceros, no ejecuta cierres, no modifica nada.

**No prepara ni presenta la exógena.** No arma formatos de la DIAN ni valida contra sus especificaciones: te deja la base revisada para que la trabajes.

Nunca inventa un NIT. Si falta un dato, te lo dice tal cual.

Trae máximo 30 contactos por consulta y siempre te dice cuántos revisó del total.

## Va bien con

- [Revisión de impuestos y retenciones](../alegra-tax-and-retentions/) — las retenciones se reportan por tercero; aquí depuras a quién
- [Chequeo de cierre mensual](../alegra-monthly-close-check/) — cuadra el período antes de sacar saldos por tercero
