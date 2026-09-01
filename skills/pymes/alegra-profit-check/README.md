# Chequeo de rentabilidad

**Qué productos te dejan plata de verdad y cuáles se te comen el margen.**

Responde la pregunta más incómoda de un negocio: *vendo bastante, ¿por qué no me queda?*

## Para quién es

Para el dueño o el gerente: quien decide precios, descuentos y qué vale la pena seguir vendiendo. El momento típico: cuando cierras un buen mes de ventas y la cuenta bancaria no lo refleja.

## Cómo se ve

**Le escribes:**

> ¿Por qué vendo mucho y no me queda nada?

**Te responde:**

> Vendiste $40.500.000 y te costó $29.800.000. Margen bruto: **26%**.
>
> | Producto | Venta | Utilidad | Margen |
> |---|---|---|---|
> | Pintura blanca galón | $5.400.000 | $2.500.000 | 46% |
> | Cemento gris 50kg | $12.600.000 | $1.700.000 | 13% |
> | Varilla 1/2" | $9.300.000 | $800.000 | 9% |
>
> Aquí está tu problema: el cemento y la varilla son el **54% de tus ventas y solo el 23% de tu ganancia**. La pintura vende cinco veces menos y te deja casi lo mismo.
>
> Además diste $1.900.000 en descuentos: el 18% de tu utilidad bruta, regalado.

## Instalar

```bash
git clone https://github.com/Alegra-Team/alegra-integrations.git
cp -r alegra-integrations/skills/pymes/alegra-profit-check ~/.claude/skills/
```

Reinicia tu asistente y pregúntale *"¿cuál es mi margen este mes?"*.

Otros clientes de IA y el paso a paso completo: **[docs/instalar-skills.md](../../../docs/instalar-skills.md)**.

## Qué necesitas

- El [MCP de Alegra conectado](../../../docs/conectar-mcp-alegra.md)
- Grupos: `reports`, `currencies`
- Productos con **costo registrado** en Alegra. Sin costo el reporte te muestra 100% de utilidad, que es mentira.

## Bueno saber

Esta skill **solo lee**. No crea, no modifica ni borra nada en tu cuenta de Alegra.

Trae máximo 10 productos por consulta de rentabilidad. Y el margen que calcula es **bruto** (venta − costo): la utilidad final sale del Estado de Resultados, después de gastos.

No reparte gastos de operación entre productos. Eso requiere un costeo que Alegra no calcula solo.

## Va bien con

- [Pulso de ventas](../alegra-sales-pulse/) — vender mucho y ganar no son lo mismo; aquí ves las dos caras
- [Control de gastos](../alegra-expense-watch/) — si el margen bruto está bien pero no queda plata, el problema son los gastos
