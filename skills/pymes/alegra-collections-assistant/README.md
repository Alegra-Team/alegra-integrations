# Asistente de cobros

**Te dice a quién cobrarle primero, cuánto rinde cada gestión y te escribe el mensaje listo para enviar.**

Es la plata que ya te ganaste. Esta skill convierte la lista de facturas vencidas en un plan de cuatro llamadas.

## Para quién es

Para quien vende a crédito y persigue pagos: dueño, administrador o quien lleva la cartera.

El momento típico: el lunes en la mañana o el primer día del mes, cuando toca sentarse a cobrar y no sabes por dónde empezar.

## Cómo se ve

**Le escribes:**

> ¿A quién le cobro esta semana?

**Te responde:**

> Te deben **$22.300.000** en 14 facturas. De eso, **$14.800.000 ya están vencidos**.
>
> | # | Cliente | Monto | Mora | Por qué primero |
> |---|---|---|---|---|
> | 1 | Distribuidora El Progreso | $6.200.000 | 48 días | El monto más grande y la mora más vieja |
> | 2 | Ferretería La 45 | $3.100.000 | 30 días | Entra en el mes de mora |
> | 3 | Almacén Central | $2.400.000 | 20 días | Aún reciente, fácil de recuperar |
>
> Estas 3 gestiones recuperan **$11.700.000**: el 79% de lo vencido.
>
> El 66% de lo vencido está en un solo cliente. Vale la pena revisar el cupo de crédito que le tienes a Distribuidora El Progreso antes de seguirle vendiendo a plazo.

Y si le pides el mensaje, te lo escribe listo para copiar y pegar en WhatsApp.

## Instalar

```bash
git clone https://github.com/Alegra-Team/alegra-integrations.git
cp -r alegra-integrations/skills/pymes/alegra-collections-assistant ~/.claude/skills/
```

Reinicia tu asistente y pregúntale *"¿qué facturas tengo vencidas?"*.

Otros clientes de IA y el paso a paso completo: **[docs/instalar-skills.md](../../../docs/instalar-skills.md)**.

## Qué necesitas

- El [MCP de Alegra conectado](../../../docs/conectar-mcp-alegra.md)
- Grupos: `reports`, `contacts`, `invoices`, `currencies`
- Facturas con **fecha de vencimiento** registrada en Alegra. Sin eso no hay mora que calcular.

## Bueno saber

Esta skill **solo lee**. No crea, no modifica ni borra nada en tu cuenta de Alegra.

**No envía nada.** Te redacta el mensaje; enviarlo lo haces tú.

Trae máximo 20 facturas por consulta. Si tienes más, te lo dice y puedes filtrar por cliente.

## Va bien con

- [Radar de caja](../alegra-cash-radar/) — para ver si lo que cobras te alcanza para lo que debes
- [Pulso de ventas](../alegra-sales-pulse/) — para saber si el cliente moroso además dejó de comprarte
