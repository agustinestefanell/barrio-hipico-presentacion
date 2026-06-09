# Decisions — Barrio Inglés / Barrio Hípico Presentación

## 2026-06 — La presentación no es pública abierta

- **Decisión:** proteger la presentación principal y Polo Logístico.
- **Motivo:** información sensible de proyecto inmobiliario/urbanístico en contexto de NDA.
- **Consecuencia:** todo acceso pasa por Owner/Consultor autenticado o Visitante con sesión válida.
- **Implementación observable:** `proxy.ts`, `requirePresentationAccess()`, Supabase Auth y cookie viewer.

## 2026-06 — Owner con poder máximo

- **Decisión:** el Owner controla consultores, accesos globales, revocaciones y logs.
- **Motivo:** trazabilidad y control central de la distribución.
- **Consecuencia:** `/admin` y `/admin/instructivo` requieren `requireOwner()`.
- **Límite:** no compartir el usuario Owner.

## 2026-06 — Consultor delegado y separado

- **Decisión:** el Consultor genera y revoca accesos propios, pero no administra consultores ni ve accesos de otros.
- **Motivo:** autonomía comercial sin perder control global.
- **Consecuencia:** panel separado `/consultor`, consultas filtradas por `consultant_id` y anonimato visual del Owner.

## 2026-06 — Link único + PIN de 4 dígitos

- **Decisión:** mantener un PIN de 4 dígitos por simplicidad operativa.
- **Motivo:** fácil comunicación con inversores y uso móvil.
- **Consecuencia:** se compensa con slug criptográfico, hash + salt, vencimiento, máximo de usos, bloqueo, revocación y cookie HMAC.
- **Límite:** nunca guardar ni registrar PIN en texto plano.

## 2026-06 — Escrituras críticas mediante service role server-side

- **Decisión:** centralizar operaciones críticas en Server Actions con service role.
- **Motivo:** evitar exposición de hash/salt y reducir capacidad directa de clientes.
- **Consecuencia:** `admin.ts` es server-only; RLS y privilegios de columnas permanecen como defensa adicional.

## 2026-06 — Polo Logístico separado

- **Decisión:** mantener `/polo-logistico` como línea narrativa separada.
- **Motivo:** no contaminar la narrativa residencial ecuestre.
- **Consecuencia:** página protegida independiente, enlazada desde Hero, sin integrarse al masterplan principal.

## 2026-06 — Masterplan y mapas sin deformación

- **Decisión:** preservar proporción mediante `object-fit: contain` en planos y mapas.
- **Motivo:** la lectura técnica importa más que el crop editorial.
- **Consecuencia:** cualquier reemplazo de asset territorial debe validar dimensiones y contain.

## 2026-06 — Una sola pieza principal en Ubicación estratégica

- **Decisión:** mostrar únicamente `Masterplan general 2.png` como plano principal de Ubicación.
- **Motivo:** evitar duplicación y pérdida de jerarquía.
- **Consecuencia:** referencias debajo del plano y ausencia de bloque inferior duplicado.

## 2026-06 — Diferenciar visualmente Panel Owner y Panel Consultor

- **Decisión:** comunicar capacidades y rol dentro de cada panel.
- **Motivo:** la autorización técnica no basta si la UI genera confusión.
- **Consecuencia:** Panel Owner institucional con capacidades globales; Panel Consultor operativo, limitado a accesos propios y sin identidad del Owner.

## 2026-06 — Documentación estructural obligatoria

- **Decisión:** mantener seis documentos raíz de arquitectura, estado, decisiones, handoff, problemas y protocolo.
- **Motivo:** evitar pérdida de contexto entre sesiones y Workers.
- **Consecuencia:** futuras OEs deben actualizar documentación según `PromtsOperativos.md`.

## Pendiente de decisión

- Confirmar desde el entorno remoto el estado real del despliegue Vercel y sus variables.
- Decidir si `ArchitectureBrand.tsx` debe volver a montarse en la home y cómo resolver sus assets raíz.
