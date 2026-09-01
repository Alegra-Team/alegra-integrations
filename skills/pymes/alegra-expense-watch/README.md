# Control de gastos

**Cuánto le debes a cada proveedor, qué se vence esta semana y en qué se te está yendo la plata.**

Es la otra mitad de la caja. Saber cuánto tienes no te dice si te alcanza.

## Para quién es

Para el dueño, el administrador o quien programa los pagos. El momento típico: cuando te sientas a decidir qué pagar esta semana.

## Cómo se ve

**Le escribes:**

> ¿Qué tengo que pagar esta semana?

**Te responde:**

> Debes **$9.700.000** en 11 facturas. De eso, **$3.400.000 ya están vencidos**.
>
> | Proveedor | Factura | Monto | Estado |
> |---|---|---|---|
> | Distribuciones del Sur | FC-8821 | $2.100.000 | Vencida hace 4 días |
> | Cementos del Caribe | FC-9014 | $1.300.000 | Vencida hace 2 días |
> | Transportes Rápido | FC-9102 | $840.000 | En 2 días |
>
> Con **$4.560.000** cubres todo lo que se vence esta semana, incluido lo atrasado.
>
> El 73% de lo que debes está en dos proveedores. Eso te da poder de negociación: vale la pena pedirles plazo o descuento por pronto pago.

## Instalar

```bash
git clone https://github.com/Alegra-Team/alegra-integrations.git
cp -r alegra-integrations/skills/pymes/alegra-expense-watch ~/.claude/skills/
```

Reinicia tu asistente y pregúntale *"¿cuánto le debo a mis proveedores?"*.

Otros clientes de IA y el paso a paso completo: **[docs/instalar-skills.md](../../../docs/instalar-skills.md)**.

## Qué necesitas

- El [MCP de Alegra conectado](../../../docs/conectar-mcp-alegra.md)
- Grupos: `reports`, `gastos`, `contacts`, `currencies`
- Facturas de compra con **fecha de vencimiento** registrada

## Bueno saber

Esta skill **solo lee**. No crea, no modifica ni borra nada en tu cuenta de Alegra.

**No paga nada ni programa pagos.** Te dice qué pagar; pagarlo lo haces tú.

El reporte de cuentas por pagar trae máximo 20 facturas y no permite pedir la página siguiente. Si tienes más, filtra por proveedor.

## Va bien con

- [Radar de caja](../alegra-cash-radar/) — para ver si lo que tienes alcanza para lo que debes
- [Chequeo de rentabilidad](../alegra-profit-check/) — si los gastos crecen más rápido que las ventas, el margen se aprieta
