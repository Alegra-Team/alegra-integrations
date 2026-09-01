# Contribuir

¿Tienes una skill o una automatización que le sirve a otros negocios o contadores? Súbela. Este repositorio se hace mejor con lo que ustedes usan todos los días.

---

## Antes de nada

Lee **[SEGURIDAD.md](SEGURIDAD.md)**. Es un repositorio público: cero tokens, cero datos de clientes, cero rutas de tu computador.

---

## Camino fácil: abre un Issue

No necesitas saber de git. Cuéntanos la idea y nosotros la armamos.

1. Ve a [Issues → New issue](https://github.com/Alegra-Team/alegra-integrations/issues/new/choose).
2. Elige **Proponer una skill** o **Proponer una automatización**.
3. Llena la plantilla: qué preguntas quieres poder hacer, a quién le sirve y qué esperas de respuesta.

Con eso basta. Si tienes ya el prompt o el flujo escrito, pégalo ahí.

## Camino pro: manda un Pull Request

1. Haz un fork del repositorio.
2. Crea una rama: `git checkout -b skill/alegra-mi-skill`.
3. Crea la carpeta en el lugar que corresponda:

```
skills/pymes/alegra-mi-skill/
├── SKILL.md      # las instrucciones para la IA
└── README.md     # la hoja que lee un humano en GitHub
```

4. Parte de la [plantilla](skills/_plantilla/SKILL.md) y sigue el [estándar](skills/SKILL_STANDARD.md).
5. Abre el PR. Llena la plantilla de PR y ya.

> ¿Te da pereza? Dile a tu propio asistente de IA: *"lee `skills/SKILL_STANDARD.md` de este repositorio y ayúdame a convertir esto en una skill que cumpla el estándar"*. Para eso están las skills.

---

## Qué buscamos en una skill

| Sí | No |
|---|---|
| Responde una pregunta real de negocio | Es solo un envoltorio de una herramienta del MCP |
| Dice claro a quién le sirve (pyme o contador) | Sirve "para todo el mundo" |
| Usa solo herramientas de **consulta** | Crea, modifica o borra datos |
| Trae ejemplos con datos inventados | Trae capturas o cifras de un cliente real |
| Está en español, con tono cercano | Está en jerga técnica o traducida a máquina |
| Dice qué **no** hace | Promete más de lo que puede |

### Por qué solo consulta

Todas las skills publicadas aquí leen datos, no los modifican. Es una decisión a propósito: una IA que se equivoca leyendo te da un dato malo, y lo ves. Una IA que se equivoca escribiendo te daña la contabilidad, y quizá no lo ves.

Si tu idea necesita crear o modificar algo en Alegra, va mejor como **automatización de n8n**, donde tú controlas cada paso y puedes revisarlo antes de que corra.

---

## Automatizaciones de n8n

Todavía no están abiertas. Cuando lo estén, la estructura será:

```
automatizaciones/n8n/mi-flujo/
├── workflow.json   # el flujo exportado, sin credenciales
└── README.md       # qué hace, qué necesitas y cómo importarlo
```

Mientras tanto, propón tu idea por [Issue](https://github.com/Alegra-Team/alegra-integrations/issues/new/choose) y la tenemos en cuenta. Lo que viene está en [automatizaciones/README.md](automatizaciones/README.md).

**Al exportar un flujo de n8n:** revisa el `.json` línea por línea antes de subirlo. Los exports arrastran IDs de credenciales, URLs de webhook y a veces datos de ejemplo de ejecuciones reales.

---

## Cómo se revisa tu aporte

1. **Escaneo automático de secretos** en cada PR.
2. **Revisión de contenido:** que las herramientas existan, que sean de consulta y que el frontmatter esté completo.
3. **Prueba real:** instalamos la skill y lanzamos sus frases de ejemplo contra una cuenta de prueba.
4. **Merge** y entrada en el [CHANGELOG](CHANGELOG.md).

Nada entra directo a `main`. Todo pasa por PR.

---

## Estilo

- Español con acentos, forma con "tú". Sin voseo.
- Frases cortas. Primero el beneficio, después el detalle.
- Habla en el lenguaje del negocio, no de la API. "A quién le cobro", no "consulta de cuentas por cobrar filtrada por vencimiento".
- Sin emojis decorativos.
- Sin promesas infladas. Si la skill no puede hacer algo, dilo en su sección de límites.

Toda skill empieza con `alegra-` y su nombre técnico va en inglés kebab-case. El título dentro del archivo, en español.

---

## Preguntas

Abre un [Issue](https://github.com/Alegra-Team/alegra-integrations/issues/new/choose) con la etiqueta `pregunta`. Respondemos ahí.
