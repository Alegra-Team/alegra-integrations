# Radar de cartera en Notion

**Cada mañana te arma un tablero con a quién cobrar primero, ordenado por cuánta plata te debe y hace cuánto.**

Tú abres Notion a las 7 de la mañana y ya está ahí: quién te debe, cuánto, desde hace cuántos días y por cuál factura. Sin entrar a Alegra, sin exportar nada, sin hacer cuentas.

---

## Qué hace

1. Lee **todas** tus facturas abiertas en Alegra, no solo las primeras 30.
2. Calcula cuántos días de mora tiene cada una.
3. Suma por cliente y las reparte en tramos: 1 a 30 días, 31 a 60, más de 60.
4. Le pone una **prioridad** a cada cliente, pesando la plata vencida por el tiempo que lleva vencida.
5. Escribe una ficha por cliente en tu base de Notion, ordenada de mayor a menor prioridad.

Solo aparecen los clientes que **sí** tienen plata vencida. Si alguien te debe pero todavía no le llega la fecha, no te hace ruido.

## Para quién es

Para ti si tienes clientes a crédito y hoy revisas la cartera "cuando te acuerdas". También le sirve al contador que lleva varias empresas y quiere un tablero por cada una.

---

## Qué necesitas

### 1. Una cuenta de n8n

En la nube o instalada en tu computador. Si nunca has usado n8n, empieza por **[Empezar aquí](../../EMPEZAR-AQUI.md)**.

### 2. Dos credenciales en n8n

| Credencial | Tipo en n8n | Nómbrala exactamente | Cómo se saca |
|---|---|---|---|
| Alegra | **Basic Auth** | `Alegra API` | [Obtener tu token de Alegra](../../OBTENER-TOKEN-ALEGRA.md) |
| Notion | **Notion API** | `Notion account` | [Credenciales](../../CREDENCIALES.md#notion) |

> El nombre importa. Si las llamas distinto, al importar el flujo los nodos te van a aparecer sin credencial y tendrás que seleccionarlas a mano.

En la credencial de Alegra:
- **User** → el correo con el que entras a Alegra.
- **Password** → tu **token** de la API. No tu contraseña.

### 3. Una base de datos en Notion

Créala con estas columnas. El nombre y el tipo tienen que ser **iguales**, con tildes:

| Columna | Tipo en Notion |
|---|---|
| Cliente | Title |
| Saldo total | Number |
| Vencido | Number |
| 1 a 30 días | Number |
| 31 a 60 días | Number |
| Más de 60 días | Number |
| Días de mora | Number |
| Prioridad | Number |
| Estado | Select |
| Detalle | Text |
| Fecha de corte | Date |

En **Estado**, crea estas cuatro opciones: `Al día`, `Mora leve`, `Mora seria`, `Crítico`.

**Y lo más importante:** comparte esa base con tu integración de Notion. En la base, arriba a la derecha → **···** → **Conexiones** → busca tu integración → **Confirmar**. Si te saltas este paso el flujo falla con un error 404 que no explica nada.

---

## Cómo lo pones a correr

1. Descarga **[`workflow.json`](workflow.json)**.
2. En n8n: **Workflows** → **Import from File** → elige el archivo.
3. Abre el nodo **Guardar en Notion** y reemplaza `REEMPLAZAR_DATABASE_ID` por el ID de tu base.

   El ID está en la URL de tu base de Notion. Si la URL es
   `https://notion.so/miespacio/`**`a1b2c3d4e5f67890abcdef1234567890`**`?v=...`,
   el ID es la parte en negrita: 32 caracteres entre la última barra y el `?`.

4. Revisa que los nodos de Alegra y Notion tengan su credencial seleccionada.
5. Dale a **Test workflow** para verlo correr una vez con tus datos reales.
6. Si te gusta cómo quedó, activa el flujo con el interruptor de arriba a la derecha.

Desde ahí corre solo, todos los días a las 7:00. Para cambiar la hora, abre el nodo **Cada día a las 7:00**.

---

## Cómo se ve el resultado

En tu base de Notion, cada mañana:

| Cliente | Vencido | 1 a 30 | 31 a 60 | Más de 60 | Días de mora | Estado | Prioridad |
|---|---|---|---|---|---|---|---|
| Ferretería La 45 | $3.300.000 | – | $900.000 | $2.400.000 | 75 | Crítico | 247.500 |
| Distribuidora El Progreso | $500.000 | $500.000 | – | – | 10 | Mora leve | 5.000 |

Y en **Detalle**, el desglose de ese cliente:

```
2 factura(s) pendiente(s):
FV-1001: $ 2.400.000 — 75 días de mora
FV-1002: $ 900.000 — 40 días de mora
```

**Empieza por el de arriba.** La prioridad ya combina cuánto te deben con hace cuánto.

---

## Cómo leer la Prioridad

No es plata, es un puntaje para ordenar. Sale de multiplicar lo vencido por los días de mora.

Un cliente que te debe $500.000 hace 90 días pesa más que uno que te debe $2.000.000 hace 3 días: el primero ya dio señales de que no va a pagar solo.

| Estado | Qué significa | Qué hacer |
|---|---|---|
| **Mora leve** | Hasta 30 días | Un recordatorio amable basta |
| **Mora seria** | 31 a 60 días | Llamada, no correo |
| **Crítico** | Más de 60 días | Acuerdo de pago o para en seco el crédito |

---

## Qué escribe en Alegra

**Nada.** Este flujo solo lee. No crea, no modifica ni borra nada en tu cuenta.

---

## Cosas que vas a querer ajustar

**La hora.** Nodo `Cada día a las 7:00`.

**Los días de gracia.** Si le das 5 días de margen a tus clientes antes de considerarlos en mora, abre el nodo `Calcular mora y agrupar por cliente` y cambia arriba:

```js
const DIAS_GRACIA = 5;
```

**La moneda.** En el mismo nodo, `const MONEDA = 'COP';`. Cámbiala por `MXN`, `PEN`, `USD` o la que uses. Solo afecta cómo se ve la plata en la columna Detalle.

**Los tramos.** Si trabajas con 15/45/90 en vez de 30/60, busca en ese mismo nodo los números `30` y `60` y cámbialos.

---

## Una nota sobre las fichas repetidas

Cada corrida crea una ficha nueva por cliente, con su **Fecha de corte**. Así queda el historial y puedes ver si la cartera de alguien mejora o empeora.

Si prefieres ver solo lo de hoy, crea una vista en Notion con el filtro **Fecha de corte → es → Hoy**. Es un clic y una vez.

---

## Errores frecuentes

| Qué ves | Por qué pasa | Cómo lo arreglas |
|---|---|---|
| `401 Unauthorized` en el nodo de Alegra | Pusiste tu contraseña de Alegra en vez del token | En la credencial, **Password** va el token. Ver [Obtener tu token](../../OBTENER-TOKEN-ALEGRA.md) |
| `404` en el nodo de Notion | No compartiste la base con la integración | En la base: **···** → **Conexiones** → agrega tu integración |
| `Property X does not exist` | Una columna de Notion tiene otro nombre | Revisa mayúsculas y tildes. `Más de 60 días`, no `Mas de 60 dias` |
| El flujo corre pero no escribe nada | No tienes facturas vencidas | Es la respuesta correcta. Vas al día |
| Solo aparecen unos pocos clientes | La paginación se cortó | Alegra entrega 30 por llamada. El flujo hace hasta 40 llamadas, o sea 1.200 facturas. Si tienes más, sube `maxRequests` en el nodo `Traer facturas abiertas` |
| `error 903` de Alegra | Alguien subió el `limit` por encima de 30 | Déjalo en 30. Es el máximo que acepta Alegra |

---

## Límites

- Solo lee. No toca nada en tu cuenta de Alegra.
- Cuenta la mora contra la **fecha de vencimiento** de la factura. Si no la tienes puesta, esa factura cuenta como al día.
- Ignora las facturas con saldo en cero y las anuladas.
- Trabaja en la moneda en que están las facturas. Si facturas en varias monedas, los totales quedan mezclados.
- Hasta 1.200 facturas abiertas por corrida con la configuración que viene.

---

## Va bien con

- **[Recordatorios de cobro](../alegra-overdue-invoice-reminders/)** — este te dice a quién cobrar; ese le escribe.
- **[Asistente de cobros](../../../skills/pymes/alegra-collections-assistant/)** — la skill para preguntarle a tu asistente de IA por la cartera en cualquier momento.
