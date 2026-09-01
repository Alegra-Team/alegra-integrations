# Cierre de caja del día

**Cuánto se vendió en el turno, cómo pagaron los clientes, si la caja cuadró y qué quedó pendiente de emitir.**

Y cuando no cuadra, no se queda en "hay un descuadre de $28.000": te dice por dónde buscar.

## Para quién es

Para el dueño de un negocio con punto de venta —tienda, restaurante, ferretería, salón— o para quien supervisa varias cajas sin estar en el mostrador. El momento típico: al cerrar el día, o la mañana siguiente.

## Cómo se ve

**Le escribes:**

> La caja no cuadró hoy, ¿qué pasó?

**Te responde:**

> Turno de Caja principal: $3.420.000 en 87 facturas.
>
> | | Monto |
> |---|---|
> | Esperado en caja | $1.040.000 |
> | Contado al cerrar | $1.012.000 |
> | **Diferencia** | **−$28.000** |
>
> Falta $28.000: un 1,7% del efectivo del turno. Casi siempre es vuelto mal dado, no algo grave.
>
> Revisé los ajustes post-cierre y no hay cambios después del cierre, así que el descuadre viene del turno mismo. Vale la pena mirar las ventas grandes en efectivo cerca del cierre.
>
> Ojo: quedaron **3 facturas sin emitir electrónicamente**.

## Instalar

```bash
git clone https://github.com/Alegra-Team/alegra-integrations.git
cp -r alegra-integrations/skills/pymes/alegra-pos-daily-close ~/.claude/skills/
```

Reinicia tu asistente y pregúntale *"¿cómo cerró la caja hoy?"*.

Otros clientes de IA y el paso a paso completo: **[docs/instalar-skills.md](../../../docs/instalar-skills.md)**.

## Qué necesitas

- El [MCP de Alegra conectado](../../../docs/conectar-mcp-alegra.md)
- Grupos: `pos`, `currencies`
- **Alegra POS en uso**, con turnos que se abren y se cierran

## Bueno saber

Esta skill **solo lee**. No crea, no modifica ni borra nada en tu cuenta de Alegra.

**No cierra turnos ni emite facturas.** Te dice qué está pendiente; hacerlo lo haces tú desde el POS.

Si tienes varias cajas, te pregunta cuál antes de asumir.

Sobre los descuadres: la skill describe el hecho y dónde buscar. No saca conclusiones sobre personas — eso no le toca a una IA.

## Va bien con

- [Radar de caja](../alegra-cash-radar/) — para ver el efectivo del punto de venta dentro de toda tu caja
- [Pulso de ventas](../alegra-sales-pulse/) — para ver el día dentro de la tendencia del mes
