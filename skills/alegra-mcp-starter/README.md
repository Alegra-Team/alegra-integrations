# Primeros pasos con el MCP de Alegra

**Comprueba que la conexión sirve, mira qué módulos usas de verdad y te dice qué preguntarle a tu negocio.**

Conectar el MCP te da acceso a tus datos. Lo que no te da es saber qué preguntar. Empieza por aquí.

## Para quién es

Para cualquiera que acabe de conectar Alegra a su asistente de IA —pyme o contador— y para cuando algo dejó de funcionar y no sabes si el problema es el token, los permisos o la pregunta.

## Cómo se ve

**Le escribes:**

> Ya conecté el MCP de Alegra, ¿funciona?

**Te responde:**

> **Conexión funcionando.** Te veo como Ferretería La 45, moneda COP.
>
> | Módulo | Estado |
> |---|---|
> | Contactos | 340 activos |
> | Inventario | 512 productos, 2 bodegas |
> | Bancos | 3 cuentas |
> | POS | 1 punto de venta |
> | Nómina | Sin datos |
>
> Por lo que veo eres un negocio de venta al público. **Empieza con estas tres skills:**
>
> 1. **Radar de caja** — la pregunta de todos los días
> 2. **Asistente de cobros** — tienes 340 clientes; ahí hay cartera
> 3. **Guardián de inventario** — 512 productos no se vigilan a ojo
>
> No te sirve hoy la revisión de nómina: no tienes empleados cargados en Alegra.
>
> Y para empezar ya, pregúntame: *"¿cuánta plata tengo hoy entre todas mis cuentas?"*

## Instalar

```bash
git clone https://github.com/Alegra-Team/alegra-integrations.git
cp -r alegra-integrations/skills/alegra-mcp-starter ~/.claude/skills/
```

Reinicia tu asistente y pregúntale *"¿qué le puedo preguntar a Alegra?"*.

Otros clientes de IA y el paso a paso completo: **[docs/instalar-skills.md](../../docs/instalar-skills.md)**.

## Qué necesitas

- El [MCP de Alegra conectado](../../docs/conectar-mcp-alegra.md)
- Al menos los grupos `currencies`, `contacts` y `config`. Entre más habilites, más completo el diagnóstico.

## Bueno saber

Esta skill **solo lee**. No configura nada por ti: diagnostica y te dice qué revisar.

**Nunca te pide el token ni lo guarda.** Si lo escribes en el chat, bórralo y regenéralo.

Hoy el MCP de Alegra es **solo de consulta**: lee tus datos, no los modifica.

## Va bien con

Todas. Es la puerta de entrada:

- **[Skills para pymes](../pymes/)** — caja, cobros, ventas, inventario, rentabilidad, gastos, POS
- **[Skills para contadores](../contadores/)** — cierre, estados financieros, impuestos, conciliación, terceros, facturación electrónica, nómina
