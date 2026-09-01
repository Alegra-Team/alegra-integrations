---
name: alegra-mcp-starter
description: >
  Comprueba que el MCP de Alegra quedó bien conectado, te dice qué datos alcanza
  a ver y te muestra las preguntas que ya puedes hacerle a tu negocio. Úsala la
  primera vez que conectas Alegra a tu asistente, o cuando algo dejó de
  responder.
  Trigger phrases: "conecté el MCP de Alegra", "verifica que Alegra está
  conectado", "qué le puedo preguntar a Alegra", "no me funciona el MCP de
  Alegra", "empezar con Alegra", "qué skills de Alegra me sirven", "prueba la
  conexión con Alegra".
allowed-tools: mcp__alegra-mcp__currencies_getDefaultCurrency, mcp__alegra-mcp__currencies_getCurrencies, mcp__alegra-mcp__contacts_getContacts, mcp__alegra-mcp__config_getUnits, mcp__alegra-mcp__warehouses_getWarehouses, mcp__alegra-mcp__banks_getBanks, mcp__alegra-mcp__items_getItems, mcp__alegra-mcp__ledger_listCategories, mcp__alegra-mcp__pos_pos_list-stations, mcp__alegra-mcp__payroll_list-employees
metadata:
  audiencia: pymes y contadores
  requiere: MCP de Alegra conectado (solo consulta)
  grupos-mcp: currencies, contacts, config, items, banks, accounting
  autor: manuelnarvaez-casadiego
  proposito: Confirmar que la conexión sirve y saber qué preguntar con ella
  fecha: 2026-09-01
  status: beta
---

# Primeros pasos con el MCP de Alegra

## Qué hace por ti

Conectar el MCP te da acceso a los datos de tu negocio. Lo que no te da es saber **qué preguntar**.

Esta skill hace tres cosas: comprueba que la conexión responde, mira qué módulos estás usando de verdad, y te propone las preguntas que tienen sentido **para tu negocio**, no una lista genérica.

Es la primera que deberías usar.

## Para quién es

Para cualquiera que acabe de conectar Alegra a su asistente de IA: dueño de una pyme, contador, o quien lo esté configurando por ellos.

También sirve cuando algo dejó de funcionar y no sabes si el problema es el token, los permisos o la pregunta.

## Qué necesitas

- El [MCP de Alegra conectado](../../docs/conectar-mcp-alegra.md).
- Al menos estos grupos en `mcp-groups`: `currencies`, `contacts`, `config`. Entre más grupos habilites, más completo el diagnóstico.

## Cómo la usas

Escríbele a tu asistente:

- "Ya conecté el MCP de Alegra, ¿funciona?"
- "¿Qué le puedo preguntar a Alegra?"
- "No me responde el MCP de Alegra"
- "¿Qué skills de Alegra me sirven a mí?"
- "Muéstrame qué datos ves de mi cuenta"

## Qué te entrega

> **Conexión con Alegra: funcionando**
>
> Te veo como **Ferretería La 45**, moneda **COP**.
>
> **Qué módulos estás usando**
>
> | Módulo | Estado | Qué puedes preguntar |
> |---|---|---|
> | Contactos | 340 activos | Cartera, mejores clientes, terceros |
> | Inventario | 512 productos, 2 bodegas | Qué reponer, qué está quieto |
> | Bancos | 3 cuentas | Cuánta plata tienes, conciliación |
> | Contabilidad | Activa | Balance, P&G, cierre del mes |
> | POS | 1 punto de venta | Cierre de caja del día |
> | Nómina | Sin datos | — |
>
> **Empieza por estas cinco preguntas**
>
> 1. "¿Cuánta plata tengo hoy entre todas mis cuentas?"
> 2. "¿A quién le debo cobrar esta semana?"
> 3. "¿Cómo van las ventas de este mes contra el pasado?"
> 4. "¿Qué productos se me están acabando?"
> 5. "¿En qué se me fue la plata este mes?"
>
> **Las skills que más te sirven**
>
> Por lo que veo —inventario, POS y bastantes clientes— eres un negocio de venta al público. Instala en este orden:
>
> 1. **[Radar de caja](../pymes/alegra-cash-radar/)** — la pregunta de todos los días
> 2. **[Asistente de cobros](../pymes/alegra-collections-assistant/)** — tienes 340 clientes; ahí hay cartera
> 3. **[Guardián de inventario](../pymes/alegra-inventory-guard/)** — 512 productos no se vigilan a ojo
>
> No te sirve hoy: la revisión de nómina, porque no tienes empleados cargados en Alegra.

## Workflow

1. **Prueba que la conexión responde.** Llama `mcp__alegra-mcp__currencies_getDefaultCurrency`. Es la llamada más barata y la que menos permisos necesita.

   - Si responde, la conexión sirve. Di la moneda: le confirma a la persona que estás viendo *su* cuenta.
   - Si falla, salta al paso 6 (diagnóstico) y **no sigas con las demás llamadas**. No tiene sentido intentar diez veces lo mismo.

2. **Mira qué módulos tienen datos.** Haz una llamada ligera por módulo, con el límite más bajo posible. No estás trayendo datos: estás viendo si hay algo.

   | Módulo | Llamada | Para qué |
   |---|---|---|
   | Contactos | `contacts_getContacts` con `params: {limit: 1, metadata: true}` | El total sin descargar nada |
   | Inventario | `items_getItems` con límite bajo | Si maneja productos |
   | Bodegas | `warehouses_getWarehouses` | Si maneja más de una |
   | Bancos | `banks_getBanks` | Cuántas cuentas tiene |
   | Contabilidad | `ledger_listCategories` | Si usa el módulo contable |
   | POS | `pos_pos_list-stations` | Si vende en punto de venta |
   | Nómina | `payroll_list-employees` con `limit: 1` | Si tiene empleados |

   **Si un grupo no está habilitado, la llamada falla.** Eso no es un error de la persona: solo significa que no activó ese grupo. Anótalo y sigue.

3. **Interpreta lo que ves, no lo listes.** El objetivo no es un inventario de módulos: es entender qué tipo de negocio es.

   - Muchos productos + POS → venta al público.
   - Muchos contactos + pocas facturas → venta a crédito, empresa a empresa.
   - Contabilidad activa + varias empresas → probablemente un contador.
   - Nómina con empleados → hay un frente laboral que atender.

4. **Propón cinco preguntas, no veinte.** Elígelas según lo que encontraste. Una pregunta sobre inventario a quien no tiene productos es ruido.

   Escríbelas **tal cual las diría la persona**, para que las pueda copiar y pegar.

5. **Recomienda skills en orden de utilidad.** Máximo tres, y explica por qué cada una **con el dato que encontraste** ("tienes 340 clientes, ahí hay cartera"). Genérico no convence a nadie.

   Di también cuál **no** le sirve hoy y por qué. Ahorra tiempo y genera confianza.

   | Si el negocio... | Recomienda |
   |---|---|
   | Vende y cobra a crédito | Radar de caja, Asistente de cobros |
   | Maneja inventario | Guardián de inventario, Chequeo de rentabilidad |
   | Tiene punto de venta | Cierre de caja del día, Pulso de ventas |
   | Lleva contabilidad completa | Chequeo de cierre mensual, Informe financiero |
   | Declara impuestos de terceros | Revisión de impuestos, Revisión de terceros |
   | Tiene empleados | Revisión de nómina |

6. **Si algo falla, diagnostica en este orden.** No repitas la misma llamada esperando otro resultado.

   | Qué pasó | Causa más probable | Qué hacer |
   |---|---|---|
   | No aparece ninguna tool de Alegra | El MCP no está configurado o el cliente no se reinició | Revisar la configuración y reiniciar |
   | Error de autenticación | Token vencido, mal copiado, o el Base64 mal armado | Regenerar el token y volver a codificar `email:token` |
   | Unas tools sí y otras no | Falta el grupo en el header `mcp-groups` | Agregar el grupo que falta |
   | Todo responde pero vacío | La cuenta es nueva o no tiene datos ese período | No es un error. Ampliar el período |
   | Responde datos de otra empresa | El token es de otra cuenta | Verificar con qué usuario se generó |

   Envía siempre a [docs/conectar-mcp-alegra.md](../../docs/conectar-mcp-alegra.md) para el paso a paso.

7. **Cierra recordando lo importante:** hoy el MCP de Alegra es **solo de consulta**. Lee, no escribe. Nada de lo que hagas con tu asistente modifica tu cuenta.

**Reglas:**

- **Nunca pidas ni muestres el token.** Si la persona lo pega en el chat, dile que lo borre y lo regenere.
- No hagas más de una llamada por módulo. Estás diagnosticando, no reportando.
- Si el módulo no tiene datos, no inventes ejemplos con datos falsos.
- Habla en el idioma del negocio: "cuánta plata tienes", no "consulta de saldos de tesorería".
- Si todo funciona, dilo en una línea y pasa a lo útil. Nadie quiere leer un informe de que las cosas están bien.

## Las 20 preguntas que ya puedes hacer

Sin instalar ninguna skill, solo con el MCP conectado:

**Plata**

1. ¿Cuánta plata tengo hoy entre todas mis cuentas?
2. ¿Cuánto me deben y cuánto debo yo?
3. ¿Qué facturas se me vencen esta semana?

**Clientes**

4. ¿Quiénes son mis mejores clientes este año?
5. ¿Quién me debe hace más de 30 días?
6. ¿Qué clientes dejaron de comprarme?

**Ventas**

7. ¿Cuánto vendí este mes?
8. ¿Cómo voy contra el mes pasado?
9. ¿Cuál es mi ticket promedio?
10. ¿Qué producto es el que más vendo?

**Inventario**

11. ¿Qué productos se me están acabando?
12. ¿Qué tengo quieto en bodega?
13. ¿Cuánto vale mi inventario?

**Gastos**

14. ¿En qué se me fue la plata este mes?
15. ¿A qué proveedor le debo más?
16. ¿Qué órdenes de compra están pendientes?

**Contabilidad**

17. ¿Cómo está mi balance general?
18. ¿Cuánta utilidad llevo este año?
19. ¿Qué cuentas no están conciliadas?
20. ¿Cuánto IVA tengo que declarar?

## Errores frecuentes

| Síntoma | Causa | Solución |
|---|---|---|
| El asistente no encuentra ninguna tool de Alegra | El MCP no quedó configurado, o no reiniciaste el cliente | Revisa la config y reinicia |
| "No autorizado" o error 401 | El token está vencido o mal copiado | Regenera el token en Alegra y vuelve a codificar `email:token` en Base64 |
| Unas preguntas responden y otras no | Falta habilitar el grupo en `mcp-groups` | Agrega el grupo que necesitas |
| Responde pero todo sale vacío | La cuenta no tiene datos en ese período | Amplía el período. Vacío no siempre es error |
| Ves datos de otra empresa | El token pertenece a otra cuenta | Verifica con qué usuario lo generaste |
| Las skills instaladas no se activan | El servidor MCP no se llama `alegra-mcp` | Renómbralo exactamente así en tu configuración |

## Límites

- Esta skill solo lee. No crea, no modifica ni borra nada en tu cuenta de Alegra.
- **Hoy el MCP de Alegra es solo de consulta.** No factura, no paga, no concilia.
- No configura el MCP por ti. Diagnostica y te dice qué revisar; los cambios los haces tú.
- **Nunca te pide el token ni lo guarda.** Si lo escribes en el chat, bórralo y regenéralo.
- El diagnóstico depende de los grupos que hayas habilitado. Si no activaste un grupo, esta skill no puede saber si usas ese módulo.
- Los datos salen de tu cuenta de Alegra, pero la interpretación la hace un modelo de IA.
