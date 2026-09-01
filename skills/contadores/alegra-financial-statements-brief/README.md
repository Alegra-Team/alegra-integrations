# Informe financiero para tu cliente

**Los tres estados financieros, con sus variaciones e indicadores, explicados en lenguaje que tu cliente entiende.**

Tú ya sabes leer un balance. Lo que toma tiempo es traducirlo.

## Para quién es

Para el contador que entrega informes a sus clientes, o para el que lleva la contabilidad de una empresa y presenta resultados a gerencia. El momento típico: después del cierre, cuando toca sentarse a redactar.

## Cómo se ve

**Le escribes:**

> Arma el informe financiero de agosto

**Te responde:**

> **En una frase:** el negocio vendió más y ganó más, pero la plata no entró: casi todo el crecimiento está en cartera.
>
> | | Agosto | Julio | Variación |
> |---|---|---|---|
> | Ingresos | $40.500.000 | $36.200.000 | +12% |
> | **Utilidad bruta** | **$10.700.000** | **$9.100.000** | **+18%** |
> | Gastos de operación | $7.900.000 | $6.300.000 | +25% |
> | **Utilidad neta** | **$2.800.000** | **$2.800.000** | **0%** |
>
> La utilidad bruta creció 18%, pero los gastos crecieron 25%. El resultado final quedó igual. Ahí está la historia del mes.
>
> **Razón corriente 2,08** — por cada peso que debe a corto plazo tiene $2,08. Holgado.
>
> **Para conversar con el cliente:** el mes fue bueno en ventas y neutro en utilidad; la caja se está apretando porque la cartera crece más rápido que el recaudo; la estructura financiera está sana, el problema es de operación, no de solvencia.

## Instalar

```bash
git clone https://github.com/Alegra-Team/alegra-integrations.git
cp -r alegra-integrations/skills/contadores/alegra-financial-statements-brief ~/.claude/skills/
```

Reinicia tu asistente y pregúntale *"explícame el balance de este mes"*.

Otros clientes de IA y el paso a paso completo: **[docs/instalar-skills.md](../../../docs/instalar-skills.md)**.

## Qué necesitas

- El [MCP de Alegra conectado](../../../docs/conectar-mcp-alegra.md)
- Grupos: `reports`, `currencies`
- El período **cerrado o al menos cuadrado**

## Bueno saber

Esta skill **solo lee**. No crea, no modifica ni borra nada en tu cuenta de Alegra.

**No emite estados financieros oficiales ni certificados.** Produce un borrador de análisis para que tú lo revises y lo firmes. No aplica NIIF ni hace notas ni revelaciones.

Antes de entregarle cualquier informe a un cliente, verifica las cifras en Alegra.

## Va bien con

- [Chequeo de cierre mensual](../alegra-monthly-close-check/) — córrelo antes: un informe sobre un período descuadrado no sirve
- [Revisión de terceros](../alegra-third-party-review/) — cuando el balance muestra saldos por tercero que hay que depurar
