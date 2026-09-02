# Recordatorios de cobro

**Cada día hábil te deja listos, en tus borradores de Gmail, los correos de cobro de todos tus clientes en mora.**

Tú abres Gmail a las 8 de la mañana y ya están escritos: uno por cliente, con todas sus facturas vencidas, el total y desde cuándo debe. Lees, y le das enviar.

---

## Qué hace

1. Le pide a Alegra **todas** las facturas abiertas que ya se vencieron, no solo las primeras 30.
2. Junta las de un mismo cliente en **un solo correo**. Si alguien te debe cuatro facturas, recibe un correo, no cuatro.
3. Va a buscar el correo de ese cliente a su ficha de contacto en Alegra.
4. Redacta el mensaje con el detalle de cada factura y cuántos días lleva vencida.
5. Lo deja en tus **borradores de Gmail**. No envía nada sin que tú lo apruebes.

Los ordena de mayor a menor deuda, así que el primer borrador de la lista es el que más plata te representa.

## Para quién es

Para ti si cobrar te da pereza o se te olvida. El trabajo de escribir ya está hecho; solo queda decidir a quién le mandas.

---

## Qué necesitas

### 1. Una cuenta de n8n

En la nube o instalada en tu computador. Si nunca has usado n8n, empieza por **[Empezar aquí](../../EMPEZAR-AQUI.md)**.

### 2. Dos credenciales en n8n

| Credencial | Tipo en n8n | Nómbrala exactamente | Cómo se saca |
|---|---|---|---|
| Alegra | **Basic Auth** | `Alegra API` | [Obtener tu token de Alegra](../../OBTENER-TOKEN-ALEGRA.md) |
| Gmail | **Gmail OAuth2** | `Gmail account` | [Credenciales](../../CREDENCIALES.md#gmail) |

> El nombre importa. Si las llamas distinto, al importar el flujo los nodos te van a aparecer sin credencial y tendrás que seleccionarlas a mano.

En la credencial de Alegra:
- **User** → el correo con el que entras a Alegra.
- **Password** → tu **token** de la API. No tu contraseña.

### 3. Tus clientes con correo en Alegra

El flujo saca el correo de la ficha del contacto en Alegra. Los clientes que no lo tengan cargado se quedan por fuera, sin romper nada. Abajo te decimos cómo verlos.

---

## Cómo lo pones a correr

1. Descarga **[`workflow.json`](workflow.json)**.
2. En n8n: **Workflows** → **Import from File** → elige el archivo.
3. Abre el nodo **Redactar el correo** y reemplaza `REEMPLAZAR_NOMBRE_DE_TU_EMPRESA` por el nombre con el que quieres firmar. Está en la primera línea:

   ```js
   const REMITENTE = 'Ferretería La 45';
   ```

4. Revisa que los nodos de Alegra y Gmail tengan su credencial seleccionada.
5. Dale a **Test workflow** para verlo correr una vez con tus datos reales.
6. Ve a tus borradores de Gmail y lee lo que quedó. Si te gusta, activa el flujo con el interruptor de arriba a la derecha.

Desde ahí corre solo, de lunes a viernes a las 8:00. Para cambiar la hora o los días, abre el nodo **Días hábiles a las 8:00**.

---

## Cómo se ve el resultado

Un borrador por cliente. Así queda el de un cliente con dos facturas vencidas:

> **Asunto:** Recordatorio de pago — 2 facturas pendientes
>
> Hola, Ferretería La 45:
>
> Te escribimos para recordarte que tienes 2 facturas pendientes con nosotros, por un total de **$3.300.000**.
>
> | | | |
> |---|---|---|
> | FV-1001 | $2.400.000 | venció el 2026-06-19 (75 días) |
> | FV-1002 | $900.000 | venció el 2026-07-24 (40 días) |
>
> Si ya hiciste el pago, cuéntanos y lo cruzamos de una vez.
>
> Si necesitas otra fecha o armar un acuerdo, escríbenos y lo miramos juntos.
>
> Gracias por tu confianza.
> Ferretería La 45

Si el cliente solo debe una factura, el asunto trae el número de esa factura.

---

## De borrador a envío automático

De fábrica **nada sale de tu cuenta sin que tú lo leas**. Cuando ya confíes en cómo quedan los correos:

1. Clic derecho en el nodo **Dejar el correo en borradores** → **Deactivate**.
2. Clic derecho en el nodo **Enviar el correo directo** → **Activate**.

Listo. Se devuelve igual de fácil si te arrepientes.

**Antes de dar ese paso, haz una prueba real.** Pon tu propio correo en la ficha de un cliente de prueba en Alegra, créale una factura vencida y corre el flujo. Así ves exactamente lo que va a recibir tu cliente.

---

## Los clientes sin correo

El nodo **¿Tiene correo?** parte la lista en dos:

- **Rama de arriba (true):** clientes con correo. Se les arma el borrador.
- **Rama de abajo (false):** clientes sin correo. No pasa nada con ellos.

Después de correr el flujo, haz clic en la rama de abajo del nodo y vas a ver exactamente quiénes son. Cárgales el correo en Alegra y en la siguiente corrida entran solos.

---

## Qué escribe en Alegra

**Nada.** Este flujo solo lee. No marca facturas, no crea notas, no toca tu contabilidad.

Lo único que crea son borradores en tu propio Gmail.

---

## Cosas que vas a querer ajustar

**Los días y la hora.** Nodo `Días hábiles a las 8:00`. Trae la expresión `0 8 * * 1-5`, que quiere decir "a las 8:00, de lunes a viernes". Para las 9:00 de lunes a sábado sería `0 9 * * 1-6`.

**Los días de gracia.** Si le das margen a tus clientes antes de considerarlos en mora, abre el nodo `Traer facturas vencidas`, busca el parámetro `dueDate_before` y cambia el `0`:

```
{{ $now.minus({ days: 5 }).toFormat('yyyy-MM-dd') }}
```

Con eso solo entran las que llevan más de 5 días vencidas.

**El monto mínimo.** Si no vale la pena escribir por deudas pequeñas, abre `Agrupar vencidas por cliente` y cambia arriba:

```js
const MINIMO_PARA_COBRAR = 50000;
```

**El texto del correo.** Está en el nodo `Redactar el correo`, dentro de la variable `mensaje`. Es HTML sencillo; cambia las frases y deja las etiquetas como están.

**La moneda.** En `Agrupar vencidas por cliente`, `const MONEDA = 'COP';`. Cámbiala por `MXN`, `PEN`, `USD` o la que uses.

---

## Errores frecuentes

| Qué ves | Por qué pasa | Cómo lo arreglas |
|---|---|---|
| `401 Unauthorized` en un nodo de Alegra | Pusiste tu contraseña de Alegra en vez del token | En la credencial, **Password** va el token. Ver [Obtener tu token](../../OBTENER-TOKEN-ALEGRA.md) |
| El nodo de Gmail pide autorizar de nuevo | El permiso de Google venció | Abre la credencial `Gmail account` y dale **Reconnect** |
| No se creó ningún borrador | Ningún cliente en mora tiene correo, o no tienes facturas vencidas | Mira la rama de abajo del nodo `¿Tiene correo?` |
| El correo llegó con el nombre `REEMPLAZAR_NOMBRE_DE_TU_EMPRESA` | Se te olvidó el paso 3 | Abre `Redactar el correo` y cambia la variable `REMITENTE` |
| Un cliente aparece dos veces | Tiene dos fichas de contacto distintas en Alegra | Únelas en Alegra. El flujo agrupa por id de contacto |
| `error 903` de Alegra | Alguien subió el `limit` por encima de 30 | Déjalo en 30. Es el máximo que acepta Alegra |
| Solo aparecen unos pocos clientes | La paginación se cortó | El flujo hace hasta 40 llamadas, o sea 1.200 facturas. Si tienes más, sube `maxRequests` en `Traer facturas vencidas` |

---

## Límites

- Solo lee de Alegra. Lo único que escribe son borradores en tu Gmail.
- Cuenta la mora contra la **fecha de vencimiento**. Las facturas sin fecha de vencimiento no entran.
- Ignora las facturas con saldo en cero y las que aún no vencen.
- Necesita que el cliente esté cargado como contacto con id en Alegra. Las facturas sin cliente asociado no entran.
- Crea un borrador nuevo cada corrida. Si no envías los de ayer, mañana vas a tener dos por cliente.
- Hasta 1.200 facturas vencidas por corrida con la configuración que viene.

---

## Va bien con

- **[Radar de cartera en Notion](../alegra-receivables-aging-to-notion/)** — ese te dice a quién cobrar primero; este le escribe.
- **[Asistente de cobros](../../../skills/pymes/alegra-collections-assistant/)** — la skill para preguntarle a tu asistente de IA por la cartera en cualquier momento.
