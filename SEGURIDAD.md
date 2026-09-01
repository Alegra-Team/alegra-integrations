# Seguridad

Este repositorio es **público**. Todo lo que subas aquí lo puede ver cualquiera, para siempre.

## Regla número uno

**Cero secretos. Cero datos de clientes.**

## Qué nunca entra a este repositorio

| No subas | Por qué |
|---|---|
| Tu token de Alegra o el header `Authorization: Basic ...` | Da acceso completo a tu cuenta y a la de tus clientes |
| API keys de n8n, OpenAI, Anthropic, Google o cualquier servicio | Se usan en segundos por bots que rastrean GitHub |
| Nombres reales de clientes, NIT, cédulas, correos o teléfonos | Son datos personales de terceros |
| Cifras reales de una empresa (ventas, saldos, nómina) | Son datos confidenciales de tu cliente |
| Rutas de tu computador (`/Users/tu-nombre/...`) | Filtran información tuya y no le sirven a nadie más |
| Capturas de pantalla con datos reales sin tapar | Es la fuga más común |

## Cómo poner ejemplos sin poner datos reales

Los ejemplos de este repositorio usan datos inventados. Haz lo mismo:

- Clientes: `Distribuidora El Progreso`, `Ferretería La 45`, `Cliente A`
- NIT: `900.123.456-7`
- Cifras: números redondos y evidentemente ficticios
- Tokens: `TU_TOKEN_AQUI` o `<pega-aqui-tu-token>`

## Cómo guardas tu token de Alegra

Tu token va en la **configuración de tu cliente de IA**, en tu computador. Nunca en un archivo del repositorio.

Si por accidente lo subiste:

1. Entra a Alegra → **Configuración → API** y **regenera el token**. El viejo queda inservible.
2. Avisa por un Issue en este repositorio para que borremos el contenido del historial.

Borrar el archivo en un commit nuevo **no es suficiente**: el token sigue visible en el historial de git. Por eso el paso 1 es regenerarlo.

## Qué revisamos en cada aporte

Cada Pull Request pasa por un escaneo automático de secretos (`.github/workflows/seguridad.yml`) y por revisión humana. Si algo se cuela, el PR no se mezcla.

## Reportar un problema de seguridad

¿Encontraste un secreto expuesto o una vulnerabilidad en este repositorio? **No abras un Issue público.** Escríbenos a través del [centro de ayuda de Alegra](https://ayuda.alegra.com) y lo resolvemos de forma privada.
