# Guardián de inventario

**Qué reponer ya, qué está quieto ocupando plata y dónde está cada cosa.**

El inventario es plata parada. Esta skill te dice cuál de esa plata está trabajando y cuál no.

## Para quién es

Para el dueño, el de compras o quien maneja la bodega. El momento típico: antes de hacer el pedido al proveedor, o cuando el depósito está lleno pero siempre falta lo que el cliente pide.

## Cómo se ve

**Le escribes:**

> ¿Qué tengo que pedirle al proveedor esta semana?

**Te responde:**

> **Cinco productos por debajo de 10 unidades:**
>
> | Producto | Stock | Bodega | Te dura |
> |---|---|---|---|
> | Cemento gris 50kg | 8 | Bodega principal | menos de 1 día |
> | Varilla 1/2" | 4 | Bodega principal | menos de 1 día |
> | Pintura blanca galón | 9 | Punto de venta | 1 día |
>
> Los tres son tus productos más vendidos. Si no pides hoy, mañana estás diciendo "no hay".
>
> Además tienes **Guantes de carnaza en −12**. Un stock negativo significa que vendiste algo que el sistema no tenía registrado: revisa si falta entrar una compra.

## Instalar

```bash
git clone https://github.com/Alegra-Team/alegra-integrations.git
cp -r alegra-integrations/skills/pymes/alegra-inventory-guard ~/.claude/skills/
```

Reinicia tu asistente y pregúntale *"¿qué productos se me están acabando?"*.

Otros clientes de IA y el paso a paso completo: **[docs/instalar-skills.md](../../../docs/instalar-skills.md)**.

## Qué necesitas

- El [MCP de Alegra conectado](../../../docs/conectar-mcp-alegra.md)
- Grupos: `items`, `reports`, `currencies`
- Productos con **control de inventario activado** en Alegra

## Bueno saber

Esta skill **solo lee**. No crea, no modifica ni borra nada en tu cuenta de Alegra.

**No hace pedidos.** Te dice qué pedir; pedirlo lo haces tú.

No conoce los tiempos de entrega de tus proveedores ni tus cantidades mínimas de pedido. Y el stock que ve es el registrado en Alegra: si tu bodega física no coincide, ahí hay un conteo pendiente.

## Va bien con

- [Pulso de ventas](../alegra-sales-pulse/) — para ver qué se está vendiendo antes de decidir qué reponer
- [Control de gastos](../alegra-expense-watch/) — para revisar qué le debes al proveedor al que le vas a pedir
