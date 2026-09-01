# Auditoría de conciliación bancaria

**Qué conciliaciones quedaron en borrador, qué movimientos no se conciliaron y dónde está la diferencia entre el banco y la contabilidad.**

La conciliación es el punto donde la contabilidad toca la realidad. Esta skill te dice dónde no se están tocando.

## Para quién es

Para el contador que cierra el mes, o para quien revisa la contabilidad de un cliente y necesita saber si el banco está cuadrado. El momento típico: antes del cierre, o cuando una cuenta no cuadra.

## Cómo se ve

**Le escribes:**

> ¿Por qué no cuadra la cuenta de Davivienda?

**Te responde:**

> Davivienda Corriente tiene la conciliación de agosto en **borrador**. Mientras no se cierre, ese saldo de $8.400.000 no está validado contra el extracto.
>
> **Movimientos sin conciliar:**
>
> | Fecha | Concepto | Monto |
> |---|---|---|
> | 14 ago | Pago proveedor FC-8821 | $2.100.000 |
> | 22 ago | Abono cliente | $1.800.000 |
> | 29 ago | Comisión bancaria | $48.000 |
> | 31 ago | Retención GMF | $16.400 |
>
> Los dos últimos son el clásico: comisiones y GMF que el banco cobra y que nadie registra hasta que aparece la diferencia.
>
> Aparte: **Caja general nunca se ha conciliado** y tiene $3.200.000. No es urgente, pero es un saldo que nadie ha validado nunca.

## Instalar

```bash
git clone https://github.com/Alegra-Team/alegra-integrations.git
cp -r alegra-integrations/skills/contadores/alegra-bank-reconciliation-audit ~/.claude/skills/
```

Reinicia tu asistente y pregúntale *"¿qué movimientos están sin conciliar?"*.

Otros clientes de IA y el paso a paso completo: **[docs/instalar-skills.md](../../../docs/instalar-skills.md)**.

## Qué necesitas

- El [MCP de Alegra conectado](../../../docs/conectar-mcp-alegra.md)
- Grupos: `banks`, `reports`, `currencies`
- Conciliaciones bancarias en uso en Alegra. Si nunca se ha conciliado, la skill te lo dice — que ya es un hallazgo.

## Bueno saber

Esta skill **solo lee**. No concilia, no crea ni modifica nada en tu cuenta de Alegra.

**No lee el extracto del banco.** Solo ve lo registrado en Alegra; la comparación contra el extracto la haces tú.

Trae máximo 30 cuentas, 30 conciliaciones y 30 movimientos por consulta, y siempre te dice cuántos alcanzó a revisar contra el total.

No detecta fraude. Señala diferencias; interpretarlas es criterio profesional.

## Va bien con

- [Chequeo de cierre mensual](../alegra-monthly-close-check/) — la conciliación es uno de los puntos que hay que cuadrar antes de cerrar
- [Radar de caja](../../pymes/alegra-cash-radar/) — la vista de negocio de las mismas cuentas
