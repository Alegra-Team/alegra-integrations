# Instalar las skills

Una skill es una carpeta con un archivo `SKILL.md`. Instalarla es copiar esa carpeta al lugar donde tu asistente busca skills. Nada más.

> **Antes:** necesitas el [MCP de Alegra conectado](conectar-mcp-alegra.md). Sin eso, las skills no tienen de dónde sacar tus datos.

---

## La forma más fácil: que lo haga tu asistente

Abre tu asistente de IA en una terminal y pégale esto:

> Clona el repositorio `https://github.com/Alegra-Team/alegra-integrations` en una carpeta temporal. Copia las carpetas de skills que están en `skills/pymes/` (o `skills/contadores/`) a mi carpeta de skills. Luego dime cuáles quedaron instaladas.

Cuando termine, **reinicia tu asistente**.

## A mano: descargar una sola skill

1. Entra a la carpeta de la skill que quieras en GitHub. Por ejemplo `skills/pymes/alegra-cash-radar/`.
2. Descarga el archivo `SKILL.md`.
3. Crea en tu computador una carpeta con el nombre de la skill y mete ahí el `SKILL.md`:

```
<carpeta-de-skills-de-tu-cliente>/alegra-cash-radar/SKILL.md
```

4. Reinicia tu asistente.

## A mano: descargar todo el repositorio

```bash
git clone https://github.com/Alegra-Team/alegra-integrations.git
cd alegra-integrations

# Todas las skills de pymes (ajusta la ruta destino según tu cliente)
cp -r skills/pymes/* ~/.claude/skills/

# O todas las de contadores
cp -r skills/contadores/* ~/.claude/skills/
```

## Dónde van las skills, según tu cliente

| Cliente | Carpeta |
|---|---|
| Claude Code | `~/.claude/skills/<nombre>/` |
| Cursor | `~/.cursor/skills/<nombre>/` |
| OpenCode | `~/.config/opencode/skills/<nombre>/` |
| Codex | `~/.codex/skills/<nombre>/` |
| Antigravity | `~/.gemini/skills/<nombre>/` |

El `SKILL.md` es el mismo en todos. Solo cambia dónde se guarda.

> Los archivos `README.md` de cada carpeta son para que leas tú en GitHub. No hace falta copiarlos, pero tampoco estorban.

## Comprobar que quedó

Reinicia tu asistente y lanza una de las frases de ejemplo de la skill. Por ejemplo, con `alegra-cash-radar`:

> "¿Cómo está mi caja este mes?"

Si te responde con cifras de tu cuenta, quedó bien.

## Cuando algo no sale

| Síntoma | Causa probable | Solución |
|---|---|---|
| La skill no se activa | No reiniciaste el asistente | Ciérralo por completo y ábrelo de nuevo |
| Sigue sin activarse | La carpeta quedó en el lugar equivocado | Revisa la tabla de arriba. El `SKILL.md` va **dentro** de una carpeta con el nombre de la skill |
| Se activa pero dice que no puede consultar | El MCP no está conectado o le falta un grupo | Revisa [conectar-mcp-alegra.md](conectar-mcp-alegra.md) y los grupos que pide la skill |
| Tu cliente no soporta skills | No todos lo hacen todavía | Copia el contenido del `SKILL.md` y pégalo al inicio de tu conversación. Funciona igual, solo que hay que repetirlo cada vez |

## Actualizar

Las skills mejoran. Para traer la última versión:

```bash
cd alegra-integrations
git pull
cp -r skills/pymes/* ~/.claude/skills/
```

Los cambios de cada versión quedan en el [CHANGELOG](../CHANGELOG.md).
