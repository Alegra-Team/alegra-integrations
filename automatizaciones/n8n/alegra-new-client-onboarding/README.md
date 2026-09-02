# Bienvenida a cliente nuevo

**Cada vez que creas un cliente en Alegra, te queda la ficha en Notion, el correo de
bienvenida en borradores y el cupo de crédito puesto.**

Un cliente creado a las carreras entre una venta y otra queda sin correo, sin teléfono y
sin cupo. Un mes después le facturas y no sabes a dónde mandarle la factura.

Este flujo se dispara solo, en el momento en que lo creas, y te deja el trabajo hecho.

**Nada se manda solo.** El correo de bienvenida queda en tus **borradores** de Gmail. Tú
lo lees y lo mandas.

---

## Qué hace

1. Alegra le avisa que creaste un cliente.
2. El flujo le pregunta a Alegra la ficha completa de ese cliente. **No confía en lo que
   le llegó**: vuelve a consultar.
3. Revisa qué le falta: identificación, correo, teléfono, dirección, cupo.
4. Crea la ficha en Notion con el estado y lo que le falta.
5. Si tiene correo, deja el de bienvenida en borradores.
6. Si no tiene cupo de crédito, se lo pone.

## Para quién es

Para ti si creas clientes seguido y siempre quedan a medias. Es el flujo que convierte
"después le completo los datos" en una lista de pendientes que sí se ve.

---

## Qué necesitas

### 1. Una cuenta de n8n

**Tiene que estar donde Alegra la pueda alcanzar por internet**: n8n Cloud, o n8n
instalado en un servidor con dominio. Si lo tienes solo en tu computador, Alegra no le va
a poder avisar y este flujo no funciona.

Los otros nueve flujos sí corren en local. Este no, porque depende de un webhook.

Si nunca has usado n8n, empieza por **[Empezar aquí](../../EMPEZAR-AQUI.md)**.

### 2. Tres credenciales en n8n

| Credencial | Tipo en n8n | Nómbrala exactamente | Cómo se saca |
|---|---|---|---|
| Alegra | **Basic Auth** | `Alegra API` | [Obtener tu token de Alegra](../../OBTENER-TOKEN-ALEGRA.md) |
| Notion | **Notion API** | `Notion account` | [Credenciales](../../CREDENCIALES.md#notion) |
| Gmail | **Gmail OAuth2** | `Gmail account` | [Credenciales](../../CREDENCIALES.md#gmail) |

> El nombre importa. Si las llamas distinto, al importar el flujo los nodos te van a
> aparecer sin credencial y tendrás que seleccionarlas a mano.

En la credencial de Alegra:
- **User** → el correo con el que entras a Alegra.
- **Password** → tu **token** de la API. No tu contraseña.

### 3. Tu base de datos en Notion

Crea una base de datos con estas columnas, escritas **igual**:

| Columna | Tipo en Notion |
|---|---|
| Name | Title |
| Identificación | Text |
| Correo | Text |
| Teléfono | Text |
| Ciudad | Text |
| Estado de la ficha | Select |
| Le falta | Text |
| Cupo de crédito | Number |
| Creado en Alegra | Date |

En **Estado de la ficha** deja tres opciones: `Completo`, `Le falta poco`, `Incompleto`.

**Y comparte la base con tu integración de Notion.** Es el paso que todo el mundo olvida.
En la base: botón `•••` arriba a la derecha → **Connections** → **Connect to** → elige tu
integración. Si no lo haces, el nodo falla con un 404 que no explica nada.

---

## Cómo lo pones a correr

1. Descarga **[`workflow.json`](workflow.json)**.
2. En n8n: **Workflows** → **Import from File** → elige el archivo.
3. Abre el nodo **Guardar la ficha en Notion** y reemplaza `REEMPLAZAR_DATABASE_ID` por el
   id de tu base. Es el pedazo de la URL entre la última `/` y el `?`.
4. Revisa que los nodos con credencial la tengan seleccionada.
5. **Activa el flujo** con el interruptor de arriba a la derecha. Sin esto la URL de
   producción del webhook no existe.
6. Abre el nodo **Cuando creas un cliente** y copia la **Production URL**.
7. Registra esa URL en Alegra para el evento `new-client`. El paso a paso, sin terminal,
   está en **[Conectar webhooks de Alegra](../../CONECTAR-WEBHOOKS-ALEGRA.md)**.
8. Crea un cliente de prueba en Alegra y mira la pestaña **Executions** de n8n.

**En esta primera corrida no se escribe nada en Alegra**: el nodo del cupo viene
desactivado a propósito. Revisa la ficha que quedó en Notion. Si el cupo que te propone
es el que quieres, clic derecho en **Ponerle el cupo de crédito** → **Activate**.

---

## Las dos URLs del webhook

Aquí es donde todo el mundo se estrella, así que va con detalle.

| Cuál | Cuándo sirve | Para qué la usas |
|---|---|---|
| **Test URL** | Solo mientras tengas la pestaña abierta y le hayas dado **Listen for test event** | Para probar una vez, viendo los datos entrar |
| **Production URL** | Siempre, pero **solo si el flujo está activo** | La que registras en Alegra |

Si registras la de prueba en Alegra, mañana el flujo no dispara y no vas a saber por qué.
**La que va en Alegra es la de producción, y el flujo tiene que quedar activo.**

### La URL es pública

Cualquiera que la adivine puede llamarla. No es tan grave como suena — el flujo solo lee
un id y le vuelve a preguntar a Alegra, así que con un id falso simplemente falla — pero
si quieres bajarle el riesgo, cambia el campo **Path** del nodo por algo menos obvio que
`alegra-cliente-nuevo`. Si lo cambias, vuelve a registrar la URL nueva en Alegra.

No la publiques ni la mandes por chat.

---

## Cómo se ve el resultado

**En Notion**, una fila por cliente:

| Name | Identificación | Correo | Estado de la ficha | Le falta | Cupo de crédito |
|---|---|---|---|---|---|
| Ferretería La 45 | 900123456 | compras@... | Le falta poco | Cupo de crédito | 2.000.000 |
| Distribuidora El Progreso | 901234567 | | Incompleto | Correo, Teléfono, Dirección | 2.000.000 |

**En tus borradores de Gmail:**

> **Bienvenido, Andrés**
>
> Hola, Andrés.
>
> Ya quedaste registrado como cliente de nuestra empresa. Desde ahora te vamos a facturar
> a nombre de **Andrés Felipe Martínez Cruz** con la identificación **1012567890**.
>
> Las facturas te van a llegar a **andres.martinez@ejemplo.com**. Si prefieres otro correo,
> respóndenos y lo cambiamos.
>
> Cualquier cosa que necesites, este correo es el canal.
>
> Gracias por la confianza.

A las personas las saluda por el nombre de pila. A las empresas, por su nombre completo:
"Hola, Ferretería La 45", no "Hola, Ferretería".

Si el cliente no tiene correo, el borrador no se crea. La ficha de Notion sí, y ahí queda
anotado que le falta.

---

## Qué escribe en Alegra

**Una sola cosa: el cupo de crédito, y solo si el cliente no tiene uno.**

```
PUT /contacts/4
{ "creditLimit": 2000000 }
```

Es un campo comercial. No toca la identificación, ni el régimen, ni las cuentas contables,
ni nada de lo tributario. Si te arrepientes, lo cambias en Alegra en un clic.

El nodo tiene los reintentos automáticos apagados a propósito.

**El correo de bienvenida no se manda.** Queda en tus borradores de Gmail.

---

## Cosas que vas a querer ajustar

En el nodo **Revisar el cliente**:

```js
const CUPO_POR_DEFECTO = 2000000;       // el cupo de crédito que le pones a los nuevos
const MONEDA = 'COP';
const TU_EMPRESA = 'nuestra empresa';   // cómo quieres que te nombre el correo
```

Cambia `TU_EMPRESA` por el nombre real de tu negocio. Es lo primero que se nota en el
correo.

**El texto del correo de bienvenida** también está en ese nodo, en la variable `mensaje`.

**Qué cuenta como "le falta".** En el mismo nodo, la lista `faltantes`. Si a ti no te
importa la dirección, borra esa línea.

**Mandar el correo directo en vez de dejarlo en borradores.** En el nodo **Dejar la
bienvenida en borradores**, cambia **Resource** de `Draft` a `Message` y **Operation** a
`Send`. Ojo: el `Send To` se mueve de `Options` al campo principal. Piénsalo dos veces —
un correo mal redactado al cliente no se devuelve.

---

## Errores frecuentes

| Qué ves | Por qué pasa | Cómo lo arreglas |
|---|---|---|
| No pasa nada al crear un cliente | El webhook no está registrado en Alegra, o registraste la URL de prueba | Ver [Conectar webhooks](../../CONECTAR-WEBHOOKS-ALEGRA.md). Usa la **Production URL** |
| No pasa nada y n8n está en tu computador | Alegra no puede alcanzar tu máquina | Este flujo necesita n8n en la nube o en un servidor con dominio |
| `404` en el nodo de Notion | No compartiste la base con la integración | En la base: `•••` → **Connections** → **Connect to** → tu integración |
| `400` en el nodo de Notion | Una columna no se llama igual o es de otro tipo | Compara con la tabla de arriba. Los tildes y las mayúsculas cuentan |
| `401 Unauthorized` en un nodo de Alegra | Pusiste tu contraseña de Alegra en vez del token | En la credencial, **Password** va el token. Ver [Obtener tu token](../../OBTENER-TOKEN-ALEGRA.md) |
| `No encontré el id del cliente en lo que mandó Alegra` | Llegó algo que no era el evento esperado | Abre la ejecución en n8n: el error trae lo que llegó. Verifica que registraste `new-client` |
| El cupo no se puso | El nodo sigue desactivado | Es lo esperado la primera vez. Clic derecho → **Activate** |
| No llegó el borrador de bienvenida | El cliente no tiene correo en Alegra | Es lo esperado. Míralo en la columna **Le falta** de Notion |
| Se registró dos veces el mismo evento | Alegra rechaza duplicados de evento + URL | No pasa nada, el segundo registro simplemente no se crea |

---

## Límites

- Solo se dispara con clientes **creados**. Si editas uno viejo, no pasa nada. Para eso
  tendrías que registrar también el evento `edit-client`.
- Escribe una ficha nueva en Notion cada vez. Si Alegra manda el evento dos veces, quedan
  dos fichas.
- Solo pone el cupo. No completa identificación, correo ni dirección: eso no se puede
  inventar, y por eso te lo lista para que lo completes tú.
- El correo de bienvenida es el mismo para todos. Si quieres uno por tipo de cliente,
  toca partir el flujo con un If.
- Necesita n8n accesible desde internet. Es el único de los diez con ese requisito, junto
  con los otros dos de webhook.

---

## Va bien con

- **[Radar de cartera en Notion](../alegra-receivables-aging-to-notion/)** — para vigilar el cupo que le acabas de poner.
- **[Facturación recurrente del mes](../alegra-monthly-recurring-billing-run/)** — cuando el cliente nuevo pase a ser fijo.
