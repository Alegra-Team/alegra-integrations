# Radar de caja

**Cuánta plata tienes hoy, cuánta entró, cuánta salió y cuánta está por entrar. Todo en una sola respuesta.**

Es la pregunta que te haces antes de cada decisión de plata — *"¿me alcanza?"* — respondida con tus datos reales de Alegra en lugar de con tu intuición.

## Para quién es

Para el dueño, gerente o administrador de un negocio. El momento típico: el lunes en la mañana, o justo antes de comprometerse con un pago grande, una compra de inventario o una contratación.

## Cómo se ve

**Le escribes:**

> ¿Me alcanza para pagar la nómina de este mes?

**Te responde:**

> **Sí, te alcanza.** Tienes $18.400.000 disponibles y la nómina de agosto son $11.200.000. Te quedan $7.200.000 de margen.
>
> | Cuenta | Saldo |
> |---|---|
> | Bancolombia Ahorros | $15.200.000 |
> | Caja general | $3.200.000 |
>
> Ojo con esto: también tienes $9.700.000 por pagar a proveedores este mes. Si pagas nómina y proveedores, quedas en $2.500.000 hasta que entren los $22.300.000 que tienes por cobrar.

## Instalar

```bash
git clone https://github.com/Alegra-Team/alegra-integrations.git
cp -r alegra-integrations/skills/pymes/alegra-cash-radar ~/.claude/skills/
```

Reinicia tu asistente y pregúntale *"¿cómo está mi caja?"*.

Otros clientes de IA y el paso a paso completo: **[docs/instalar-skills.md](../../../docs/instalar-skills.md)**.

## Qué necesitas

- El [MCP de Alegra conectado](../../../docs/conectar-mcp-alegra.md)
- Grupos: `reports`, `banks`, `currencies`

## Bueno saber

Esta skill **solo lee**. No crea, no modifica ni borra nada en tu cuenta de Alegra.

Solo ve lo que está registrado en Alegra: si tienes pagos sin registrar o una cuenta bancaria por fuera, no aparecen. Y no proyecta el futuro — te muestra lo que hay y lo que está comprometido.

## Va bien con

- [Asistente de cobros](../alegra-collections-assistant/) — cuando el radar te muestra mucho por cobrar
- [Control de gastos](../alegra-expense-watch/) — cuando las salidas se dispararon y no sabes por qué
