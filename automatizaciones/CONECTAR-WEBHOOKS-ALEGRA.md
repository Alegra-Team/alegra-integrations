# Conectar los webhooks de Alegra

**Para qué sirve esto:** hay tres automatizaciones que no esperan a una hora, sino que
reaccionan al momento. Cuando registras un cliente nuevo, cuando entra una factura de
proveedor, cuando alguien edita una factura de venta. Para que eso funcione, Alegra tiene
que saber a qué dirección avisar.

Ese paso se llama **registrar un webhook**, y en Alegra hoy solo se hace por API. Este
documento te lleva de la mano, sin terminal y sin código.

**Cuánto demora:** 10 minutos la primera vez. Dos minutos las siguientes.

---

## Antes de empezar, dos cosas que no se negocian

### 1. Tu n8n tiene que ser alcanzable desde internet

Alegra le va a hacer una llamada a tu n8n. Si n8n está corriendo solo en tu computador
—lo que se ve como `localhost:5678` en el navegador— Alegra no lo puede alcanzar. Es como
darle a alguien la dirección de un cuarto de tu casa sin darle la de la casa.

| Si usas | ¿Sirve para webhooks? |
|---|---|
| **n8n Cloud** (`tucuenta.app.n8n.cloud`) | Sí, de una. No tienes que hacer nada |
| **n8n instalado en un servidor con dominio** | Sí, si el dominio abre desde fuera |
| **n8n en tu computador** (`localhost`) | No. Los flujos por horario sí funcionan, los de webhook no |

Si estás en el tercer caso, tienes dos salidas: pasarte a n8n Cloud, o pedirle a alguien
de sistemas que exponga tu n8n con un dominio. Mientras tanto, las **otras siete
automatizaciones** funcionan sin problema, porque corren por horario.

### 2. Tu token de Alegra

Es el mismo que usan todos los flujos. Si todavía no lo tienes, ve a
**[Obtener tu token de Alegra](OBTENER-TOKEN-ALEGRA.md)** y vuelve.

---

## Los tres flujos que necesitan esto

| Flujo | Evento que hay que registrar |
|---|---|
| [Bienvenida a un cliente nuevo](n8n/alegra-new-client-onboarding/) | `new-client` |
| [Guardián de facturas duplicadas](n8n/alegra-duplicate-bill-guard/) | `new-bill` |
| [Guardián de anomalías en facturas](n8n/alegra-invoice-anomaly-guard/) | `new-invoice` **y** `edit-invoice` |

El guardián de anomalías necesita **dos** registros. No es un error: son dos eventos
distintos apuntando a la misma dirección.

---

## Las dos direcciones de n8n, que es donde todo el mundo se estrella

Cada flujo con webhook tiene **dos** direcciones, y se parecen muchísimo:

```
https://tucuenta.app.n8n.cloud/webhook-test/alegra-factura-proveedor-nueva   ← de prueba
https://tucuenta.app.n8n.cloud/webhook/alegra-factura-proveedor-nueva        ← la buena
```

La diferencia es el `-test`.

| | De prueba (`/webhook-test/`) | De producción (`/webhook/`) |
|---|---|---|
| Cuándo funciona | Solo mientras tienes el flujo abierto y le diste a **Listen for test event** | Siempre, si el flujo está activo |
| Cuántas veces | Una sola, y se apaga | Todas |
| Para qué la usas | Para ver qué te manda Alegra mientras armas algo | **Esta es la que registras en Alegra** |

**Regla:** en Alegra siempre va la de producción, la que **no** dice `-test`.

Y para que exista la de producción, **el flujo tiene que estar activo**. Si lo importas y
lo dejas apagado, la dirección no responde y Alegra no va a poder avisarte.

---

## Cómo registrarlo, paso a paso

### Paso 1 — Importa el flujo auxiliar

Descarga **[`_registrar-webhook/workflow.json`](n8n/_registrar-webhook/workflow.json)** y
en n8n ve a **Workflows** → **Import from File**.

Es un flujo pequeño que hace la llamada a Alegra por ti. **No lo actives**: se usa a mano.

### Paso 2 — Conéctale tu credencial de Alegra

Abre el nodo **Registrar en Alegra** y en **Credential to connect with** selecciona
`Alegra API`.

Si no aparece, créala: **Create new credential** → tipo **Basic Auth** → en **User** el
correo con el que entras a Alegra, en **Password** tu **token**. Nómbrala exactamente
`Alegra API`.

### Paso 3 — Activa el flujo que quieres conectar

Abre, por ejemplo, el **Guardián de facturas duplicadas** y prende el interruptor de
arriba a la derecha.

Esto es lo que crea su dirección de producción. Sin este paso no hay nada que registrar.

### Paso 4 — Copia la dirección de producción

En ese mismo flujo, haz doble clic en el primer nodo, el del webhook (se llama **Cuando
registras una factura de proveedor**).

Arriba vas a ver dos pestañas: **Test URL** y **Production URL**. Haz clic en
**Production URL** y copia lo que dice. Debe verse así:

```
https://tucuenta.app.n8n.cloud/webhook/alegra-factura-proveedor-nueva
```

### Paso 5 — Llena el formulario

Vuelve al flujo **Alegra — Registrar un webhook** y dale a **Execute Workflow**. n8n te
abre un formulario en otra pestaña.

- **Dirección del flujo (Production URL)** → pega lo que copiaste.
- **Qué tiene que pasar en Alegra** → elige el evento de la lista. Para el guardián de
  duplicados es `new-bill`.

Dale a **Registrar en Alegra**.

### Paso 6 — Lee la respuesta

El formulario te contesta ahí mismo:

> **Listo, quedó registrado**
>
> Alegra ya sabe que cada vez que pase "new-bill" tiene que avisarle a tu flujo. Para
> probarlo, haz esa acción en Alegra y mira las ejecuciones del flujo en n8n.

Si te dice otra cosa, mira la [tabla de errores](#errores-frecuentes) más abajo.

### Paso 7 — Pruébalo de verdad

Entra a Alegra y haz la acción. Para el guardián de duplicados: registra una factura de
proveedor cualquiera.

Vuelve a n8n, abre el flujo y mira la pestaña **Executions**. Debería aparecer una
ejecución de hace unos segundos.

Si aparece, quedó. Ya no tienes que volver a tocar esto.

---

## Cómo saber qué webhooks tengo registrados

No hay una pantalla en Alegra que te los muestre, y el flujo auxiliar tampoco los lista.

El truco: **vuelve a registrar el mismo evento con la misma dirección**. Alegra no acepta
duplicados, así que si te responde que no lo aceptó, es porque ya lo tenías. Es una forma
rara de consultar, pero funciona y no rompe nada.

---

## Los 12 eventos que existen

| | Se creó | Se editó | Se borró |
|---|---|---|---|
| Factura de venta | `new-invoice` | `edit-invoice` | `delete-invoice` |
| Factura de proveedor | `new-bill` | `edit-bill` | `delete-bill` |
| Contacto | `new-client` | `edit-client` | `delete-client` |
| Producto o servicio | `new-item` | `edit-item` | `delete-item` |

Eso es todo. No hay eventos de pagos, cotizaciones, nómina ni movimientos de inventario.
Si necesitas reaccionar a algo de eso, la salida es un flujo por horario que consulte cada
tanto — que es justo lo que hacen las otras siete automatizaciones.

---

## Errores frecuentes

| Qué ves | Por qué pasa | Cómo lo arreglas |
|---|---|---|
| `Esa es la URL de prueba (dice /webhook-test/)` | Copiaste de la pestaña equivocada | Usa **Production URL**, la que no dice `-test` |
| `Esa URL no parece la de un webhook de n8n` | Pegaste la dirección del editor, la que ves en el navegador | La buena sale del nodo del webhook y lleva `/webhook/` en la mitad |
| `La URL tiene que empezar con https://` | Pegaste una de `http://` o de `localhost` | Alegra solo acepta `https`. Si estás en `localhost`, este flujo no te va a servir |
| `La credencial de Alegra no sirvió` | Pusiste tu contraseña de Alegra en vez del token | En la credencial, **Password** va el token. Ver [Obtener tu token](OBTENER-TOKEN-ALEGRA.md) |
| `Alegra no lo aceptó` | Ya estaba registrado ese evento con esa dirección | Está bien. No hagas nada más |
| Quedó registrado pero el flujo nunca se dispara | El flujo destino está apagado | Préndelo. La dirección de producción solo responde con el flujo activo |
| Se dispara pero la ejecución falla en el segundo nodo | Alegra mandó el aviso con una forma distinta a la esperada | Los tres flujos están hechos para aguantar eso: sacan el id y vuelven a consultar. Si aún falla, abre la ejecución y mira qué llegó en el nodo del webhook |
| Cambié el `path` del webhook y dejó de funcionar | La dirección cambió, la registrada quedó vieja | Registra la nueva. La vieja se queda ahí sin hacer nada |

---

## Una nota sobre seguridad

La dirección de tu webhook es pública: cualquiera que la conozca puede mandarle datos.

Por eso los tres flujos están hechos igual: **no le creen a lo que les llega**. Sacan
únicamente el id del documento y vuelven a preguntarle a Alegra por API cuál es la
información real. Si alguien te manda un aviso falso, lo peor que pasa es que el flujo
consulte un id que no existe y se detenga.

Aun así, no publiques la dirección de tu webhook. No es un secreto crítico, pero tampoco
es para andarla repartiendo.

---

## Y si no puedo con esto

Las **otras siete automatizaciones** no necesitan nada de esto. Corren por horario, sirven
en n8n instalado en tu computador y se configuran en cinco minutos. Empieza por ahí:

- [Radar de cartera en Notion](n8n/alegra-receivables-aging-to-notion/)
- [Recordatorios de cobro](n8n/alegra-overdue-invoice-reminders/)
- [Alerta de reposición de inventario](n8n/alegra-low-stock-reorder-alert/)
- [Facturación recurrente del mes](n8n/alegra-monthly-recurring-billing-run/)
- [Seguimiento a cotizaciones frías](n8n/alegra-stale-estimate-followup/)
- [Calendario de pagos a proveedores](n8n/alegra-payables-calendar/)
- [Checklist de cierre de mes](n8n/alegra-month-close-checklist/)
