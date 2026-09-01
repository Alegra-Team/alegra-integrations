# Auditoría de facturación electrónica

**Cuánto le queda a cada resolución —en días y en números— y cuál se va a acabar primero.**

Quedarse sin numeración a mitad de mes para la facturación. Es de los problemas más evitables que existen, y también de los más frecuentes.

## Para quién es

Para el contador que responde por la facturación de uno o varios clientes, y para quien administra la facturación en una empresa que factura mucho. El momento típico: el chequeo mensual, o cuando alguien pregunta "¿hasta cuándo me sirve esta resolución?".

## Cómo se ve

**Le escribes:**

> ¿Cuándo se me vence la resolución?

**Te responde:**

> A la numeración **FE (electrónica)** le quedan **388 números** y vence el **14 de noviembre**, en 74 días.
>
> Vas a unas 74 facturas al mes, o sea unas 180 en lo que queda de vigencia. **Por números alcanzas; por fecha, no**: se te vence antes de agotarse.
>
> Solicita la resolución nueva ya. Entre el trámite y la habilitación se van semanas.
>
> **Ojo con esto:** la numeración "Principal" no tiene resolución asociada —sin número, sin fechas, sin tope— y está marcada como **predeterminada**. Si alguien factura por ahí sin darse cuenta, esa factura sale sin respaldo de resolución.

## Instalar

```bash
git clone https://github.com/Alegra-Team/alegra-integrations.git
cp -r alegra-integrations/skills/contadores/alegra-einvoicing-audit ~/.claude/skills/
```

Reinicia tu asistente y pregúntale *"revisa mis resoluciones de facturación"*.

Otros clientes de IA y el paso a paso completo: **[docs/instalar-skills.md](../../../docs/instalar-skills.md)**.

## Qué necesitas

- El [MCP de Alegra conectado](../../../docs/conectar-mcp-alegra.md)
- Grupos: `resolutions`, `invoices`, `currencies`
- Resoluciones o numeraciones creadas en Alegra. Si solo tienes la numeración por defecto sin resolución, la skill te lo dice — que ya es un hallazgo.

## Bueno saber

Esta skill **solo lee**. No solicita resoluciones, no las habilita, no modifica nada.

**No se conecta con la DIAN ni con ninguna autoridad tributaria.** Solo ve lo registrado en Alegra: si una resolución está mal cargada, la skill la lee mal.

La proyección de consumo es una estimación basada en tu ritmo reciente. Si facturas por temporadas, ajústala con criterio.

## Va bien con

- [Chequeo de cierre mensual](../alegra-monthly-close-check/) — revisar la numeración es parte del chequeo de todos los meses
- [Cierre de caja del día](../../pymes/alegra-pos-daily-close/) — la numeración del POS se agota más rápido que ninguna
