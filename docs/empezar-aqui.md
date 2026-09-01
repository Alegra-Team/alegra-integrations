# Empieza aquí

Cinco minutos y tu asistente de IA empieza a responderte sobre tu negocio con datos reales.

---

## La idea, en corto

Hay tres piezas y cada una hace algo distinto:

| Pieza | Qué hace | Analogía |
|---|---|---|
| **Tu asistente de IA** | Entiende lo que le pides y te responde | El empleado |
| **El MCP de Alegra** | Le da acceso de lectura a tus datos | Las llaves del archivo |
| **Las skills** | Le dicen qué mirar y cómo presentártelo | El manual del cargo |

Con las tres, le preguntas *"¿a quién le cobro esta semana?"* y te contesta con la lista real, priorizada.

## Los tres pasos

### 1. Conecta el MCP de Alegra

Es lo que le da acceso a tus datos. Necesitas tu token de Alegra (Configuración → API).

**[Guía completa →](conectar-mcp-alegra.md)**

### 2. Instala las skills que te sirvan

No las instales todas. Empieza con dos o tres de tu sección.

**[Guía completa →](instalar-skills.md)**

### 3. Pregunta en español, como le hablarías a un colega

No tienes que aprenderte comandos. Escribe lo que necesitas saber.

## Con cuáles empezar

**Si tienes un negocio (pyme):**

1. [Radar de caja](../skills/pymes/alegra-cash-radar/) — la más usada. Sabes cuánta plata tienes y cuánta viene.
2. [Asistente de cobros](../skills/pymes/alegra-collections-assistant/) — plata que ya te ganaste y no ha entrado.
3. [Pulso de ventas](../skills/pymes/alegra-sales-pulse/) — cómo vas y qué se está vendiendo.

**Si eres contador:**

1. [Chequeo de cierre mensual](../skills/contadores/alegra-monthly-close-check/) — qué falta para cerrar el mes.
2. [Informe financiero para tu cliente](../skills/contadores/alegra-financial-statements-brief/) — los estados financieros explicados en lenguaje de negocio.
3. [Revisión de impuestos y retenciones](../skills/contadores/alegra-tax-and-retentions/) — antes de declarar.

**Si no sabes por dónde:** instala [Primeros pasos con el MCP](../skills/alegra-mcp-starter/). Te conecta, valida que todo responde y te muestra qué puedes preguntar.

## Cómo preguntarle bien

Cuatro cosas que hacen la diferencia:

1. **Di el período.** "Este mes", "agosto", "los últimos 90 días". Si no lo dices, tu asistente asume y puede asumir mal.
2. **Pide el porqué.** "¿Por qué bajaron las ventas?" da mejor respuesta que "dame las ventas".
3. **Encadena.** Después de un resultado, sigue preguntando: "¿y ese cliente qué me compró?".
4. **Pide el formato.** "Hazme una tabla", "resúmelo en 3 puntos", "escríbeme el correo".

## Lo que debes tener claro

**Estas skills solo leen.** No crean facturas, no modifican contactos, no borran nada. Están hechas así a propósito: tu contabilidad se consulta, no se toca.

**La IA se puede equivocar.** Los datos salen de tu cuenta de Alegra, pero la interpretación la hace un modelo. **Antes de declarar impuestos, presentar estados financieros o tomar una decisión de plata grande, verifica en Alegra.** Trátala como un analista rápido, no como la fuente de verdad.

**Tus datos no se quedan en este repositorio.** Aquí solo hay instrucciones de texto. La conexión va directo entre tu asistente y Alegra.

## Palabras que quizá no conoces

Cartera, balance de prueba, exógena, conciliación... están todas explicadas en cristiano en el **[glosario](glosario.md)**.

## ¿Se dañó algo?

- Problemas de conexión: la tabla del final de [conectar-mcp-alegra.md](conectar-mcp-alegra.md).
- La skill no se activa: la tabla del final de [instalar-skills.md](instalar-skills.md).
- Otra cosa: abre un [Issue](https://github.com/Alegra-Team/alegra-integrations/issues/new/choose).
