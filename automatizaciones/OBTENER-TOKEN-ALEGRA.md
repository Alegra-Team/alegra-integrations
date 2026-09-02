# Obtener tu token de Alegra

**Qué es esto:** el token es una clave que le da permiso a n8n para leer y escribir en tu
cuenta de Alegra sin que tú tengas que entrar cada vez. Todas las automatizaciones lo
necesitan.

**Cuánto demora:** dos minutos.

---

## Sácalo en cuatro pasos

1. Entra a Alegra con tu usuario de siempre.
2. Arriba a la derecha, haz clic en tu nombre y entra a **Configuración**.
3. En el menú de la izquierda busca **API** (en algunas cuentas dice **Token de API** o
   **Integraciones**).
4. Ahí ves dos cosas:

   | | Qué es | Ejemplo |
   |---|---|---|
   | **Usuario** | El correo con el que entras a Alegra | `maria@ejemplo.com` |
   | **Token** | Una cadena larga de letras y números | `a1b2c3d4e5f6...` |

   Cópialas las dos. Las vas a necesitar juntas.

Si no ves la sección de API, tu usuario no tiene el permiso. Pídele al dueño de la cuenta
que te lo dé, o que él saque el token.

---

## El error número uno

> **El token no es tu contraseña de Alegra.**

Cuando conectes la credencial en n8n te va a pedir dos campos, **User** y **Password**.
Suena a que ahí van tu correo y tu contraseña. No.

| Campo en n8n | Qué va |
|---|---|
| **User** | El correo con el que entras a Alegra |
| **Password** | El **token**. Esa cadena larga que copiaste |

Si pones tu contraseña, todos los flujos van a fallar con un `401 Unauthorized`. Es el
error más común de todos, y no dice nada útil.

---

## Cómo lo conectas en n8n

Solo lo haces una vez. Todos los flujos usan la misma credencial.

1. En n8n, menú de la izquierda → **Credentials** → **Add credential**.
2. Busca y elige **Basic Auth**.
3. Llena:
   - **User** → tu correo de Alegra.
   - **Password** → tu token.
4. Arriba, donde dice el nombre de la credencial, escribe exactamente:

   ```
   Alegra API
   ```

5. **Save**.

> El nombre importa. Los `workflow.json` referencian la credencial por ese nombre. Si la
> llamas distinto, al importar un flujo los nodos te van a aparecer sin credencial y vas a
> tener que seleccionarla a mano en cada uno.

---

## Cuídalo como cuidas la clave del banco

Ese token **da acceso a toda tu contabilidad**: tus clientes, tus ventas, tus proveedores,
lo que te deben y lo que debes. Quien lo tenga puede leerlo todo y, según el flujo, crear
documentos.

Cosas que no se hacen con un token:

- Mandarlo por WhatsApp, Slack o correo.
- Pegarlo en un documento compartido o en una hoja de Google.
- Escribirlo dentro de un `workflow.json` para "no tener que configurar la credencial".
- Subirlo a GitHub.

En n8n el token queda guardado cifrado en la credencial. Los archivos `workflow.json` de
este repositorio **solo guardan el nombre** `Alegra API`, nunca el token. Por eso puedes
exportar y compartir un flujo sin miedo.

---

## Si se te filtró

Pasa. Lo importante es reaccionar rápido:

1. Vuelve a **Configuración → API** en Alegra.
2. Genera un token nuevo. El viejo deja de servir en ese momento.
3. Actualiza la credencial `Alegra API` en n8n con el token nuevo.

No tienes que tocar los flujos: como referencian la credencial por nombre, siguen
funcionando solos.

Si el token estuvo expuesto un rato, revisa en Alegra que no haya documentos que tú no
creaste.

---

## Errores frecuentes

| Qué ves | Por qué pasa | Cómo lo arreglas |
|---|---|---|
| `401 Unauthorized` | Pusiste la contraseña en vez del token | En **Password** va el token |
| `401 Unauthorized` y sí pusiste el token | Copiaste un espacio de más al inicio o al final | Bórralo y pégalo de nuevo, limpio |
| `403 Forbidden` | El usuario no tiene permiso para eso | Pídele al dueño de la cuenta que te amplíe el rol |
| No encuentro la sección de API | Tu usuario no la ve | Solo la ven los usuarios con permiso de administración |
| Funcionaba y de repente dejó | Alguien generó un token nuevo | El viejo se invalida al generar uno nuevo. Actualiza la credencial |

---

## Y ahora qué

- Si es tu primera vez con n8n → **[Empezar aquí](EMPEZAR-AQUI.md)**
- Si ya tienes n8n y quieres importar un flujo → **[Cómo importar un flujo](COMO-IMPORTAR.md)**
- Si vas a conectar Notion, Google Sheets, Gmail o Telegram → **[Credenciales](CREDENCIALES.md)**
