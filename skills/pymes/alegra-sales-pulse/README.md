# Pulso de ventas

**Cómo van las ventas contra el mes pasado, qué se está vendiendo, quién te compra y —sobre todo— por qué se movió el número.**

Un total de ventas te dice cuánto. Esta skill te dice qué lo explica.

## Para quién es

Para el dueño, el gerente comercial o quien responde por la meta del mes. El momento típico: a mitad de mes, cuando quieres saber si vas a llegar.

## Cómo se ve

**Le escribes:**

> ¿Por qué bajaron las ventas este mes?

**Te responde:**

> No bajaron: subieron 12%. Vendiste **$48.200.000** contra $43.100.000 de julio.
>
> Lo que sí bajó fue el **número de facturas**: 132 contra 141. Vendiste menos veces pero más caro — el ticket promedio subió de $306.000 a $365.000.
>
> Ojo con esto: los descuentos casi se duplicaron ($980.000 → $1.900.000). Parte de esa venta más grande la estás pagando tú.

## Instalar

```bash
git clone https://github.com/Alegra-Team/alegra-integrations.git
cp -r alegra-integrations/skills/pymes/alegra-sales-pulse ~/.claude/skills/
```

Reinicia tu asistente y pregúntale *"¿cómo van las ventas este mes?"*.

Otros clientes de IA y el paso a paso completo: **[docs/instalar-skills.md](../../../docs/instalar-skills.md)**.

## Qué necesitas

- El [MCP de Alegra conectado](../../../docs/conectar-mcp-alegra.md)
- Grupos: `reports`, `currencies`

## Bueno saber

Esta skill **solo lee**. No crea, no modifica ni borra nada en tu cuenta de Alegra.

Trae máximo 10 productos y 10 clientes por consulta. No proyecta ventas futuras ni pone metas: te muestra lo que pasó.

No sabe de márgenes. Vender mucho no es lo mismo que ganar — para eso está el chequeo de rentabilidad.

## Va bien con

- [Chequeo de rentabilidad](../alegra-profit-check/) — para saber cuál de esos productos que tanto vendes deja plata de verdad
- [Guardián de inventario](../alegra-inventory-guard/) — para reponer lo que se está vendiendo antes de que se acabe
