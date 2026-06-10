# Product Status — Barrio Inglés / Barrio Hípico Presentación

Estados permitidos: `Closed`, `Partial`, `UI-only`, `Deferred`, `Broken`, `Needs Review`.

## Presentación principal

| Área | Feature | Estado | Evidencia | Pendiente | Última OE / commit |
|---|---|---|---|---|---|
| Acceso | Home protegida | Closed | `/` ejecuta `requirePresentationAccess()` y proxy bloquea acceso básico | Verificar producción tras cambios de env | `ae78647` |
| Home | Hero | Closed | `Hero.tsx` centrado; bloque `min(1200px,92vw)`; título `clamp(4rem,8vw,7.5rem)` una línea; `Caratula.png` en hero-image-box `min(1100px,100%)`; `CoverImage.tsx` muestra `2a imagen.png` en mismo ancho | Si se reemplazan assets, actualizar rutas en `Hero.tsx` y `CoverImage.tsx` | ver último commit |
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
| Auth | Registro controlado de consultores | Closed | `/consultor/registro` crea Auth user y perfil `pending`; re-registro posible tras borrado definitivo; Owner ve "Volver al Panel Owner" | Evaluar rate limit si recibe abuso | `5c30adf` |
| Auth | Recuperación de contraseña | Closed | `/login/reset-password` + `/auth/confirm`; Owner puede enviar recovery desde Panel; requiere `NEXT_PUBLIC_SITE_URL` en Vercel | Configurar Redirect URLs en Supabase Auth | `18e1207` |
| Owner | Panel Owner | Closed | Query exclusiva `role=consultant`, exclusión Owner, aprobación, desactivación, borrado definitivo, recuperación de contraseña, diagnóstico por consultor | Ninguno pendiente de código | `18e1207` |
| Owner | Instructivo interno | Needs Review | `/admin/instructivo` protegido, pero aún describe alta manual con contraseña temporal | Actualizar en una OE autorizada | `c821a2c` |
| Consultor | Panel Consultor | Partial | Activos operan; pendientes/inactivos reciben pantalla de estado | Aplicar migración `002` y probar todos los estados | esta OE |
| Consultor | Aprobación Owner | Closed | Guards y acciones exigen `active + status=active` | Ninguno | `18e1207` |
| Consultor | Borrado definitivo | Closed | eliminación completa: logs → auth.users (cascade: profiles → access_tokens); el mismo email puede re-registrarse | Ninguno | `18e1207` |
| Consultor | Instructivo operativo | Closed | `/consultor/instructivo` protegido con `requireConsultantOrOwner()` | Mantener contenido actualizado | esta OE |
| Usabilidad | Ver/ocultar contraseñas | Closed | `PasswordField` reutilizado en login y creación de consultor | Mantener oculto por defecto | esta OE |
| Usabilidad | Copiar link Panel Consultor | Closed | `CopyButton` usa el origen actual y `/consultor` | Requiere permiso de portapapeles del navegador | esta OE |
| Visitante | Link + PIN | Closed | `/access/[slug]`, PIN server-side y redirect a `/` | Prueba periódica producción | `ae78647` |
| Seguridad | Revocación | Closed | Owner revoca global; Consultor revoca propios | Ninguno identificado | `ae78647` |
| Seguridad | Logs | Closed | eventos de registro, aprobación, estado y recuperación de contraseña; logs eliminados en borrado definitivo | Ninguno | `18e1207` |
| Seguridad | PIN hash + salt | Closed | `scryptSync`, salt aleatorio, columnas sin grant de lectura | Mantener | `ae78647` |
| Seguridad | Bloqueo por intentos | Closed | 5 fallos, bloqueo temporal 15 minutos | Evaluar política futura | `ae78647` |
| Seguridad | Cookie viewer | Closed | HMAC, httpOnly, secure producción, sameSite lax | Rotación de secret requiere invalidar sesiones | `ae78647` |
| Seguridad | Protección de rutas | Closed | `proxy.ts` + guards server-side | Verificar al agregar rutas nuevas | `ae78647` |
| DB | Migraciones Supabase | Partial | tres migraciones versionadas | Ejecutar `002` y `003` manualmente en Supabase SQL Editor si aún no se aplicaron | `18e1207` |

## Infraestructura y documentación

| Área | Feature | Estado | Evidencia | Pendiente | Última OE / commit |
|---|---|---|---|---|---|
| GitHub | `origin/main` | Closed | remoto y rama observables | Mantener commits acotados | Estado auditado |
| Vercel | Deploy/configuración remota | Needs Review | `.vercel` ausente; no verificable desde repo | Verificar proyecto y env vars en Vercel | No identificado |
| Secrets | `.env.local` ignorado | Closed | `.gitignore` contiene `.env*`; `git status --ignored` lo marca ignorado | Mantener plantilla vacía | `ae78647` |
| Docs | Instructivo Owner/Consultor/Visitante | Needs Review | ruta protegida, contenido anterior al autorregistro | Actualizar flujo de registro/aprobación en una OE autorizada | `c821a2c` |
| Docs | Instructivo Consultor | Closed | ruta operativa protegida y enlazada desde Panel Consultor | Mantener contenido actualizado | esta OE |
| Docs | Protocolo documental | Closed | seis documentos creados y validados en esta OE | Mantenerlos actualizados en futuras OEs | esta OE |
