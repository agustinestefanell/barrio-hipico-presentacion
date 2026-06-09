# Product Status — Barrio Inglés / Barrio Hípico Presentación

Estados permitidos: `Closed`, `Partial`, `UI-only`, `Deferred`, `Broken`, `Needs Review`.

## Presentación principal

| Área | Feature | Estado | Evidencia | Pendiente | Última OE / commit |
|---|---|---|---|---|---|
| Acceso | Home protegida | Closed | `/` ejecuta `requirePresentationAccess()` y proxy bloquea acceso básico | Verificar producción tras cambios de env | `ae78647` |
| Home | Hero | Closed | `Hero.tsx` montado en `page.tsx` | Revisión visual futura | `5b93876` |
| Home | Core Idea | Closed | `CoreIdea.tsx` montado | Ninguno identificado | `5b93876` |
| Home | Masterplan | Closed | `Masterplan.tsx`, imágenes contain, cards y mapa | Preservar proporción en cambios | `5b93876` |
| Home | Amenities | Closed | `EquestrianAmenities.tsx`, assets y placeholders | Revisar assets nuevos antes de reemplazar | `5b93876` |
| Home | Experience | Closed | `EquestrianExperience.tsx` montado | Ninguno identificado | `5b93876` |
| Home | Housing | Closed | `Housing.tsx`, assets y placeholders | Content usa 6 de 8 imágenes disponibles | `5b93876` |
| Home | Business Units | Closed | `BusinessUnits.tsx` montado | Ninguno identificado | `5b93876` |
| Home | LandBank / Chacras | Closed | `LandBank.tsx` montado | Validación jurídica fuera del software | `5b93876` |
| Home | Ubicación estratégica | Closed | `Location.tsx` usa un plano full width | Mantener imagen única y contain | `5b93876` |
| Home | Closing | Closed | `Closing.tsx` montado | Ninguno identificado | `5b93876` |
| Arquitectura | ArchitectureBrand | Needs Review | Componente existe, pero no está montado en `page.tsx` | Decidir si debe incorporarse; faltan assets raíz observables | No identificado |

## Polo Logístico

| Área | Feature | Estado | Evidencia | Pendiente | Última OE / commit |
|---|---|---|---|---|---|
| Polo Logístico | Página `/polo-logistico` | Closed | Ruta separada, protegida y con narrativa propia | Verificar producción | `5b93876`, protección en `ae78647` |
| Narrativa | Separación de Barrio Hípico | Closed | El texto declara que no integra el masterplan residencial | Mantener separación | `5b93876` |

## Acceso privado

| Área | Feature | Estado | Evidencia | Pendiente | Última OE / commit |
|---|---|---|---|---|---|
| Auth | Supabase Auth email/password | Closed | `login/actions.ts` usa `signInWithPassword` y perfil activo | Verificar Vercel fuera del repo | `ae78647` |
| Auth | Sin signup público | Closed | No existe acción/ruta signup | Mantener | `ae78647` |
| Owner | Panel Owner | Partial | Funciones globales implementadas; UI actual tiene cambios sin commit | Prueba visual autenticada y commit | `ae78647` + worktree |
| Owner | Instructivo interno | Partial | `/admin/instructivo` protegido con `requireOwner()` | Prueba Owner y commit | worktree |
| Consultor | Panel Consultor | Partial | Accesos propios y revocación implementados; UI diferenciada sin commit | Prueba con consultor real y commit | `ae78647` + worktree |
| Visitante | Link + PIN | Closed | `/access/[slug]`, PIN server-side y redirect a `/` | Prueba periódica producción | `ae78647` |
| Seguridad | Revocación | Closed | Owner revoca global; Consultor revoca propios | Ninguno identificado | `ae78647` |
| Seguridad | Logs | Closed | `access_logs`, eventos y vista Owner | Revisar volumen/retención futura | `ae78647` |
| Seguridad | PIN hash + salt | Closed | `scryptSync`, salt aleatorio, columnas sin grant de lectura | Mantener | `ae78647` |
| Seguridad | Bloqueo por intentos | Closed | 5 fallos, bloqueo temporal 15 minutos | Evaluar política futura | `ae78647` |
| Seguridad | Cookie viewer | Closed | HMAC, httpOnly, secure producción, sameSite lax | Rotación de secret requiere invalidar sesiones | `ae78647` |
| Seguridad | Protección de rutas | Closed | `proxy.ts` + guards server-side | Verificar al agregar rutas nuevas | `ae78647` |
| DB | Migración Supabase | Closed | `001_access_control.sql` versionada | Confirmar toda migración futura por archivo nuevo | `ae78647` |

## Infraestructura y documentación

| Área | Feature | Estado | Evidencia | Pendiente | Última OE / commit |
|---|---|---|---|---|---|
| GitHub | `origin/main` | Closed | remoto y rama observables | Mantener commits acotados | Estado auditado |
| Vercel | Deploy/configuración remota | Needs Review | `.vercel` ausente; no verificable desde repo | Verificar proyecto y env vars en Vercel | No identificado |
| Secrets | `.env.local` ignorado | Closed | `.gitignore` contiene `.env*`; `git status --ignored` lo marca ignorado | Mantener plantilla vacía | `ae78647` |
| Docs | Instructivo Owner/Consultor/Visitante | Partial | ruta creada sin commit | Commit y prueba Owner | worktree |
| Docs | Protocolo documental | Closed | seis documentos creados y validados en esta OE | Mantenerlos actualizados en futuras OEs | esta OE |
