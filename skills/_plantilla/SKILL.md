---
name: alegra-nombre-de-tu-skill
description: >
  Una a tres frases: qué hace esta skill y cuándo se usa, en lenguaje de negocio.
  Empieza por el beneficio para la persona, no por la herramienta que usa.
  Trigger phrases: "frase con la que alguien la activaría", "otra frase",
  "una tercera", "una cuarta", "una quinta".
allowed-tools: mcp__alegra-mcp__grupo_nombre_de_la_herramienta, mcp__alegra-mcp__otro_grupo_otra_herramienta
metadata:
  audiencia: pymes
  requiere: MCP de Alegra conectado (solo consulta)
  grupos-mcp: reports, banks
  autor: tu-usuario-de-github
  proposito: Una frase de negocio — para qué le sirve a la persona
  fecha: 2026-01-01
  status: beta
---

# Título en español, orientado al beneficio

## Qué hace por ti

Dos o tres frases. Qué problema real resuelve y qué te ahorra. En el lenguaje de la
persona, no en el de la API.

## Para quién es

Para quién y en qué momento. Sé concreto: "para el dueño de un negocio, los lunes
en la mañana, antes de decidir qué pagar".

## Qué necesitas

- El [MCP de Alegra conectado](../../docs/conectar-mcp-alegra.md).
- Grupos habilitados en `mcp-groups`: `grupo1`, `grupo2`.
- Cualquier otra condición (por ejemplo, tener el módulo de inventario activo).

## Cómo la usas

Escríbele a tu asistente:

- "frase de ejemplo tal cual la diría una persona"
- "otra frase"
- "una tercera"
- "una cuarta"

## Qué te entrega

Un ejemplo de la respuesta, con **datos inventados**. Que se vea el valor de un vistazo.

| Columna | Columna | Columna |
|---|---|---|
| Ejemplo | $000.000 | Dato |

> Un cierre que resuma la conclusión, como la daría la skill.

## Workflow

Esto es lo que sigue tu asistente. Sé específico con las herramientas y el orden.

1. **Define el período.** Si la persona no lo dice, usa el mes en curso y avísale cuál usaste.
2. **Consulta los datos.** Llama `mcp__alegra-mcp__grupo_herramienta` con los parámetros X e Y.
3. **Complementa.** Si hace falta el nombre de algo, resuélvelo con `mcp__alegra-mcp__otro_grupo_otra_herramienta`.
4. **Calcula.** Explica el cálculo que hay que hacer con los datos crudos.
5. **Presenta.** Define el formato: tabla ordenada por X, más un resumen de 2 o 3 líneas.

**Reglas:**

- Si un dato viene vacío o en cero, dilo. **Nunca inventes cifras.**
- Muestra siempre la moneda y el período consultado.
- Si el resultado es sospechoso (todo en cero, cifras raras), avísale a la persona
  que verifique en Alegra en vez de dar el dato por bueno.

## Cómo interpretar los resultados

Qué significan las cifras y qué decisión habilitan. Opcional, pero es lo que
convierte un reporte en algo útil.

## Errores frecuentes

| Síntoma | Causa | Solución |
|---|---|---|
| Todo viene en cero | El período no tiene movimientos, o estás en otra cuenta | Confirma la cuenta y prueba otro rango de fechas |
| "No tengo acceso a esa herramienta" | Falta el grupo en `mcp-groups` | Agrega `grupo1` y reinicia el asistente |
| Los nombres salen como códigos | No se resolvieron los IDs | Pídele que consulte los nombres con la herramienta correspondiente |

## Límites

- Esta skill solo lee. No crea, no modifica ni borra nada en tu cuenta de Alegra.
- Qué NO cubre (sé honesto: es lo que evita que la persona confíe de más).
- Los datos salen de tu cuenta de Alegra, pero la interpretación la hace un modelo
  de IA. Antes de una decisión importante, verifica en Alegra.
