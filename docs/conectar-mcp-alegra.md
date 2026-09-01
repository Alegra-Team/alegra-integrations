# Conectar el MCP de Alegra a tu asistente de IA

Esto es lo que le da a tu asistente acceso a los datos de tu cuenta. Se hace una sola vez y toma unos 5 minutos.

> **Antes de empezar:** el MCP de Alegra lee tus datos con los mismos permisos de tu usuario. Trátalo como tratas tu contraseña de Alegra.

---

## 1. Consigue tu token de Alegra

1. Entra a Alegra con tu usuario.
2. Ve a **Configuración → API**.
3. Copia tu **token**. Es una cadena larga de letras y números.

Guarda también el **correo con el que entras a Alegra**. Vas a necesitar los dos.

## 2. Arma tu credencial

El MCP usa autenticación básica. Necesitas convertir `correo:token` a Base64.

**En Mac o Linux**, abre la Terminal y corre:

```bash
printf 'TU_CORREO:TU_TOKEN' | base64
```

**En Windows (PowerShell):**

```powershell
[Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes("TU_CORREO:TU_TOKEN"))
```

**Sin terminal:** dile a tu propio asistente de IA *"convierte este texto a Base64"* y pásale `correo:token`.

El resultado es una cadena larga. Esa es tu credencial. **No la compartas con nadie ni la subas a ningún repositorio.**

## 3. Configura tu cliente de IA

Datos de conexión, iguales para todos los clientes:

| Campo | Valor |
|---|---|
| URL | `https://mcp.alegra.com/mcp` |
| Transporte | `streamable-http` |
| Header `Authorization` | `Basic <tu-credencial-base64>` |
| Header `mcp-groups` | Los grupos que quieras habilitar (ver abajo) |

> **Importante:** nómbralo exactamente **`alegra-mcp`**. Las skills de este repositorio esperan ese nombre para reconocer las herramientas.

### Claude Code

```bash
claude mcp add alegra-mcp \
  --transport http https://mcp.alegra.com/mcp \
  --header "Authorization: Basic TU_CREDENCIAL_BASE64" \
  --header "mcp-groups: reports,banks,contacts,invoices,items,gastos,ingresos,accounting,ledger,taxes,retentions,resolutions,config,currencies,sellers,income-payments,maestros,support-center"
```

### Cursor, Claude Desktop y otros clientes con archivo de configuración

```json
{
  "mcpServers": {
    "alegra-mcp": {
      "type": "streamable-http",
      "url": "https://mcp.alegra.com/mcp",
      "headers": {
        "Authorization": "Basic TU_CREDENCIAL_BASE64",
        "mcp-groups": "reports,banks,contacts,invoices,items,gastos,ingresos,accounting,ledger,taxes,retentions,resolutions,config,currencies,sellers,income-payments,maestros,support-center"
      }
    }
  }
}
```

Dónde va ese archivo:

| Cliente | Archivo |
|---|---|
| Cursor | `~/.cursor/mcp.json` |
| Claude Desktop | `~/Library/Application Support/Claude/claude_desktop_config.json` (Mac) |
| OpenCode | `~/.config/opencode/opencode.json` |
| Codex | `~/.codex/config.toml` |
| Antigravity | `~/.gemini/settings.json` |

## 4. Elige tus grupos

El header `mcp-groups` decide a qué puede acceder tu asistente. **Habilita solo lo que necesites**: menos grupos es más seguridad y respuestas más rápidas.

| Si eres... | Grupos recomendados |
|---|---|
| **Pyme** | `reports,banks,contacts,invoices,items,gastos,ingresos,income-payments,config` |
| **Contador** | `reports,accounting,ledger,taxes,retentions,resolutions,banks,contacts,invoices,gastos,maestros` |
| **Todo** | La lista completa de la [documentación oficial](https://developer.alegra.com/docs/mcp-alegra) |

Cada skill de este repositorio te dice en su sección **"Qué necesitas"** qué grupos requiere.

## 5. Comprueba que funciona

Reinicia tu asistente y pregúntale:

> "¿Cuáles son mis 5 clientes más recientes en Alegra?"

Si te responde con nombres de tu cuenta, quedó listo. Si no, mira la tabla de abajo.

## Cuando algo no sale

| Síntoma | Causa probable | Solución |
|---|---|---|
| "No tengo acceso a esa herramienta" | El asistente no cargó el MCP | Reinicia el cliente por completo, no solo la conversación |
| Error 401 o "no autorizado" | La credencial Base64 está mal armada | Rehazla. Ojo: sin espacios y sin salto de línea al final |
| Responde pero dice que no encuentra datos | El grupo no está habilitado | Agrega el grupo al header `mcp-groups` |
| Las skills no se activan solas | El servidor no se llama `alegra-mcp` | Renómbralo, o menciona la skill por su nombre al preguntar |
| Todos los reportes vienen en cero | Estás en una cuenta de prueba, o el rango de fechas está vacío | Confirma en qué cuenta estás y prueba con un rango que sí tenga movimientos |

---

## Lo que el MCP puede y no puede hacer

**Puede:** leer facturas, gastos, contactos, inventario, cuentas bancarias, reportes de ventas, cartera, contabilidad, impuestos y nómina.

**No puede (con las skills de este repositorio):** crear, modificar ni borrar nada. Todas las skills publicadas aquí son de solo consulta, a propósito. Tus datos se leen, no se tocan.

Siguiente paso: **[instalar las skills](instalar-skills.md)**.
