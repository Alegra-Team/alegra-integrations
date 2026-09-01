# Skills de Alegra

**15 skills para que tu asistente de IA responda preguntas reales de tu negocio, con tus datos de Alegra.**

Una skill es un archivo de instrucciones que le enseña a tu asistente cómo consultar Alegra y cómo interpretar lo que encuentra. La instalas una vez y le preguntas en español, como le preguntarías a alguien de tu equipo.

Todas **solo leen**. Ninguna crea, modifica ni borra nada en tu cuenta.

## Empieza aquí

Si acabas de conectar el MCP, instala esta primero. Te dice si la conexión sirve, qué módulos usas y cuáles de las otras 14 te convienen.

| Skill | Qué responde |
|---|---|
| **[Primeros pasos con el MCP](alegra-mcp-starter/)** | "¿Funciona? ¿Qué le puedo preguntar?" |

## Para tu negocio

Siete skills para quien vende, cobra, compra y responde por la plata.

| Skill | Qué responde | Grupos MCP |
|---|---|---|
| **[Radar de caja](pymes/alegra-cash-radar/)** | "¿Cuánta plata tengo y me alcanza para pagar?" | `reports`, `banks`, `currencies` |
| **[Asistente de cobros](pymes/alegra-collections-assistant/)** | "¿A quién le cobro primero y qué le escribo?" | `reports`, `contacts`, `invoices`, `currencies` |
| **[Pulso de ventas](pymes/alegra-sales-pulse/)** | "¿Cómo van las ventas y por qué se movió el número?" | `reports`, `currencies` |
| **[Guardián de inventario](pymes/alegra-inventory-guard/)** | "¿Qué repongo ya y qué tengo quieto?" | `items`, `reports`, `currencies` |
| **[Chequeo de rentabilidad](pymes/alegra-profit-check/)** | "¿Qué productos dejan plata de verdad?" | `reports`, `currencies` |
| **[Control de gastos](pymes/alegra-expense-watch/)** | "¿En qué se me va la plata y qué se vence?" | `reports`, `gastos`, `contacts`, `currencies` |
| **[Cierre de caja del día](pymes/alegra-pos-daily-close/)** | "¿Cuadró la caja del turno?" | `pos`, `currencies` |

## Para tu contabilidad

Siete skills para quien cierra meses, declara impuestos y responde por los números.

| Skill | Qué responde | Grupos MCP |
|---|---|---|
| **[Chequeo de cierre mensual](contadores/alegra-monthly-close-check/)** | "¿Puedo cerrar el mes o qué me falta?" | `accounting`, `reports`, `currencies` |
| **[Informe financiero para tu cliente](contadores/alegra-financial-statements-brief/)** | "¿Cómo le explico estos estados financieros?" | `reports`, `currencies` |
| **[Revisión de impuestos y retenciones](contadores/alegra-tax-and-retentions/)** | "¿Cuánto IVA y cuánta retención declaro?" | `reports`, `retentions`, `taxes`, `gastos`, `contacts`, `currencies` |
| **[Auditoría de conciliación bancaria](contadores/alegra-bank-reconciliation-audit/)** | "¿Por qué no cuadra esta cuenta?" | `banks`, `reports`, `currencies` |
| **[Revisión de terceros](contadores/alegra-third-party-review/)** | "¿Qué terceros están incompletos para la exógena?" | `reports`, `accounting`, `contacts`, `currencies` |
| **[Auditoría de facturación electrónica](contadores/alegra-einvoicing-audit/)** | "¿Cuándo se vence mi resolución y cuántos números quedan?" | `resolutions`, `invoices`, `currencies` |
| **[Revisión de nómina](contadores/alegra-payroll-review/)** | "¿Qué nómina falta por pagar o emitir?" | `payroll`, `currencies` |

## Cómo se instalan

```bash
git clone https://github.com/Alegra-Team/alegra-integrations.git
cp -r alegra-integrations/skills/pymes/alegra-cash-radar ~/.claude/skills/
```

Reinicia tu asistente y pregúntale algo. El paso a paso para Claude Code, Cursor, OpenCode y otros clientes está en **[docs/instalar-skills.md](../docs/instalar-skills.md)**.

Antes necesitas el MCP conectado: **[docs/conectar-mcp-alegra.md](../docs/conectar-mcp-alegra.md)**.

## Combinaciones que funcionan

No las instales todas de una. Estas son las que se acompañan bien:

| Si eres... | Instala |
|---|---|
| Un negocio que vende a crédito | Radar de caja + Asistente de cobros + Control de gastos |
| Un negocio con inventario | Pulso de ventas + Guardián de inventario + Chequeo de rentabilidad |
| Un negocio con punto de venta | Cierre de caja del día + Pulso de ventas |
| Un contador que cierra meses | Chequeo de cierre mensual + Auditoría de conciliación + Informe financiero |
| Un contador en temporada tributaria | Revisión de impuestos + Revisión de terceros |

## Cómo están hechas

Cada carpeta trae dos archivos:

- **`README.md`** — la hoja que estás leyendo cuando entras a la carpeta. Explica qué hace y para quién.
- **`SKILL.md`** — el archivo que instalas. Es lo que lee tu asistente.

Todas siguen el mismo estándar: **[SKILL_STANDARD.md](SKILL_STANDARD.md)**. Si quieres proponer una, empieza por **[_plantilla/SKILL.md](_plantilla/SKILL.md)** y lee **[CONTRIBUIR.md](../CONTRIBUIR.md)**.

## Lo que estas skills no hacen

- **No escriben en tu cuenta.** Hoy el MCP de Alegra es solo de consulta.
- **No dan asesoría** tributaria, contable ni laboral. Te dejan los datos ordenados; el criterio es tuyo.
- **No inventan cifras.** Si un dato no está, te lo dicen.
- **No reemplazan a Alegra.** Antes de una decisión importante, verifica en el sistema.

La interpretación la hace un modelo de IA. Los datos son tuyos y salen de tu cuenta.
