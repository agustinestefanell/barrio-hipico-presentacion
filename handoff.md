# Handoff — Barrio Inglés / Barrio Hípico Presentación

## Estado general

Presentación inmobiliaria online protegida, construida con Next.js App Router y Supabase. La home y la página separada de Polo Logístico requieren acceso de Owner/Consultor o una sesión Visitante emitida mediante link único + PIN. Existen Panel Owner, Panel Consultor, login, acceso Visitante e instructivo interno.

El repositorio compila y tiene dos commits identificados. Al crear este handoff existen cambios sin commit en el diseño/diferenciación de paneles privados y en `/admin/instructivo`.

## Entradas

### 2026-06-08 — Creación de presentación online Barrio Hípico

- **Diagnóstico:** se necesitaba una presentación editorial online del proyecto.
- **Archivos tocados:** `src/app/page.tsx`, `src/components/*`, `src/data/content.ts`, `src/app/globals.css`, assets públicos.
- **Cambios realizados:** Hero, idea rectora, Masterplan, Amenities, Experience, Business Units, Housing, LandBank, Ubicación y Closing.
- **Resultado de build:** estado actual compila; el resultado histórico exacto no está registrado.
- **Commit:** `5b93876`.
- **Riesgos/pendientes:** `ArchitectureBrand.tsx` existe pero no está montado en la home actual.
- **Estado final:** Closed.

### 2026-06-08 — Separación de `/polo-logistico`

- **Diagnóstico:** la oportunidad logística no debía contaminar la narrativa residencial ecuestre.
- **Archivos tocados:** `src/app/polo-logistico/page.tsx`, `src/app/globals.css`, navegación desde Hero.
- **Cambios realizados:** página narrativa separada y enlace desde la presentación principal.
- **Resultado de build:** estado actual compila.
- **Commit:** `5b93876`.
- **Riesgos/pendientes:** validar cualquier cambio narrativo de forma independiente.
- **Estado final:** Closed.

### 2026-06-08 — Integración de imágenes territoriales y assets

- **Diagnóstico:** la presentación requería planos, imágenes de amenities y referencias Housing.
- **Archivos tocados:** `public/images/territorio`, `public/images/architecture`, `public/plans`, componentes y `content.ts`.
- **Cambios realizados:** incorporación de assets territoriales, amenities, Housing y PDF.
- **Resultado de build:** estado actual compila.
- **Commit:** `5b93876`.
- **Riesgos/pendientes:** las rutas de arquitectura raíz definidas en `content.ts` no tienen imágenes `box-01.jpg` a `box-06.jpg` observables; la sección tampoco está montada.
- **Estado final:** Partial.

### 2026-06-08 — Corrección Masterplan

- **Diagnóstico:** los planos requieren lectura técnica sin deformación.
- **Archivos tocados:** `src/components/Masterplan.tsx`, `src/app/globals.css`.
- **Cambios realizados:** previews con `object-fit: contain`, cards documentales y mapa embebido.
- **Resultado de build:** estado actual compila.
- **Commit:** evidencia contenida en `5b93876`; cambio individual no identificado.
- **Riesgos/pendientes:** mantener proporciones al reemplazar assets.
- **Estado final:** Closed.

### 2026-06-08 — Corrección Ubicación estratégica full width

- **Diagnóstico:** el plano debía ser pieza principal y no duplicarse.
- **Archivos tocados:** `src/components/Location.tsx`, `src/app/globals.css`.
- **Cambios realizados:** único `Masterplan general 2.png` full width y referencias inferiores.
- **Resultado de build:** estado actual compila.
- **Commit:** evidencia contenida en `5b93876`; cambio individual no identificado.
- **Riesgos/pendientes:** conservar `object-fit: contain`.
- **Estado final:** Closed.

### 2026-06-08 — Normalización tipográfica

- **Diagnóstico:** coexistían microtextos y títulos secundarios excesivos.
- **Archivos tocados:** `src/app/globals.css`.
- **Cambios realizados:** escala tipográfica global por jerarquías y ajustes responsive.
- **Resultado de build:** estado actual compila.
- **Commit:** evidencia contenida en `5b93876`; cambio individual no identificado.
- **Riesgos/pendientes:** revisar visualmente cambios futuros en mobile.
- **Estado final:** Closed.

### 2026-06-09 — Sistema de acceso privado Owner / Consultor / Visitante

- **Diagnóstico:** la presentación sensible no debía permanecer pública.
- **Archivos tocados:** `proxy.ts`, `src/app/login`, `src/app/admin`, `src/app/consultor`, `src/app/access/[slug]`, `src/lib/auth`, `src/lib/supabase`, migración SQL y rutas protegidas.
- **Cambios realizados:** Supabase Auth, roles, PIN hasheado, cookie viewer, revocación, logs, RLS y paneles.
- **Resultado de build:** confirmado en el cierre de implementación y en el estado actual.
- **Commit:** `ae78647`.
- **Riesgos/pendientes:** verificar configuración y comportamiento del entorno Vercel fuera del repo.
- **Estado final:** Closed.

### 2026-06-09 — Diseño de paneles privados

- **Diagnóstico:** Admin, Consultor, Login y PIN necesitaban jerarquía y legibilidad.
- **Archivos tocados:** páginas privadas y `src/app/globals.css`.
- **Cambios realizados:** headers, cards, tablas responsive, badges y estados vacíos.
- **Resultado de build:** `npm run lint` y `npm run build` pasaron al cerrar la OE de usabilidad.
- **Commit:** incluido en la OE de mejoras de usabilidad; consultar el historial.
- **Riesgos/pendientes:** prueba visual autenticada completa.
- **Estado final:** Closed.

### 2026-06-09 — Instructivo interno

- **Diagnóstico:** faltaba una guía operativa visible para el Owner.
- **Archivos tocados:** `src/app/admin/instructivo/page.tsx`, `src/app/admin/page.tsx`, `src/app/globals.css`.
- **Cambios realizados:** ruta protegida solo Owner y guía Owner/Consultor/Visitante.
- **Resultado de build:** `npm run lint` y `npm run build` pasaron al cerrar la OE de usabilidad.
- **Commit:** incluido en la OE de mejoras de usabilidad; consultar el historial.
- **Riesgos/pendientes:** prueba visual autenticada Owner.
- **Estado final:** Closed.

### 2026-06-09 — Diferenciación Panel Owner / Panel Consultor

- **Diagnóstico:** los roles podían confundirse visualmente.
- **Archivos tocados:** `src/app/admin/page.tsx`, `src/app/consultor/page.tsx`, `src/app/admin/instructivo/page.tsx`, `src/app/globals.css`.
- **Cambios realizados:** títulos exactos, capacidades visibles, instructivo bajo título Owner y anonimato visual del Owner en Consultor.
- **Resultado de build:** `npm run lint` y `npm run build` pasaron al cerrar la OE de usabilidad.
- **Commit:** incluido en la OE de mejoras de usabilidad; consultar el historial.
- **Riesgos/pendientes:** prueba visual con usuarios reales de ambos roles.
- **Estado final:** Closed.

### 2026-06-09 — Aplicación del protocolo documental

- **Diagnóstico:** el contexto dependía excesivamente de conversaciones previas.
- **Archivos tocados:** `BarrioInglesPlans.md`, `CodingWorkshop.md`, `PromtsOperativos.md`, `handoff.md`, `PRODUCT_STATUS.md`, `DECISIONS.md`.
- **Cambios realizados:** infraestructura documental mínima retroactiva basada en el repositorio real.
- **Resultado de build:** `npm run lint` y `npm run build` pasaron correctamente el 2026-06-09.
- **Commit:** creado por esta OE; consultar el último commit del historial.
- **Riesgos/pendientes:** mantener los seis documentos actualizados en futuras OEs.
- **Estado final:** Closed.

### 2026-06-09 — Mejoras de usabilidad en accesos privados

- **Diagnóstico:** login y alta de consultores no permitían verificar visualmente la contraseña; el Owner no tenía acción directa para copiar el acceso al Panel Consultor; el Consultor no contaba con una guía operativa propia.
- **Archivos tocados:** `src/components/PasswordField.tsx`, `src/components/CopyButton.tsx`, `src/app/login/LoginForm.tsx`, `src/app/admin/page.tsx`, `src/app/consultor/page.tsx`, `src/app/consultor/instructivo/page.tsx`, `src/app/globals.css`, `BarrioInglesPlans.md`, `PRODUCT_STATUS.md`, `handoff.md`.
- **Cambios realizados:** password oculto por defecto con control Ver/Ocultar, copia de origen actual más `/consultor`, instructivo específico para generar y enviar link + PIN, y enlace visible desde Panel Consultor.
- **Protección:** `/consultor/instructivo` usa `requireConsultantOrOwner()`; no se modificó auth, Supabase, roles ni permisos.
- **Resultado de build:** `npm run lint` y `npm run build` pasaron correctamente; el build incluye `/consultor/instructivo`.
- **Commit:** creado por esta OE; consultar el último commit del historial.
- **Riesgos/pendientes:** verificar visualmente con sesiones Owner y Consultor; el portapapeles depende del permiso del navegador.
- **Estado final:** Closed.

### 2026-06-09 — Registro consultor, aprobación Owner y baja segura

- **Diagnóstico:** el Owner administraba contraseñas temporales y `active` no distinguía solicitudes pendientes, inactivos y bajas.
- **Archivos tocados:** login, Panel Owner, Panel Consultor, guards de roles, proxy, registro consultor, estilos, migración `002` y documentación estructural.
- **Cambios realizados:** solicitud pública con contraseña propia, perfil `pending`, aprobación Owner, estados `pending/active/inactive/deleted`, pantalla de espera, baja lógica con revocación y nuevos logs administrativos.
- **Protección:** generar o revocar accesos continúa exigiendo `requireConsultantOrOwner()` y perfil operativo; pendientes/inactivos no acceden a funciones ni presentación.
- **Resultado de build:** `npm run lint` y `npm run build` pasaron; el build incluye `/consultor/registro`.
- **Commit:** `1980864`.
- **Riesgos/pendientes:** ejecutar manualmente `supabase/migrations/002_consultant_approval_status.sql`, probar el ciclo completo contra Supabase remoto, verificar identidad antes de aprobar solicitudes, evaluar rate limit si el registro recibe abuso y actualizar el instructivo Owner anterior, que quedó fuera de los archivos autorizados de esta OE.
- **Estado final:** Partial hasta aplicar migración remota y validar funcionalmente.

### 2026-06-09 — Fix creación y listado de consultores en Panel Owner

- **Diagnóstico:** la tabla local filtraba por rol después de consultar todos los perfiles, y no mostraba una acción clara para iniciar el nuevo flujo de autorregistro.
- **Archivos tocados:** `src/app/admin/page.tsx`, `src/app/globals.css`, `BarrioInglesPlans.md`, `PRODUCT_STATUS.md`, `handoff.md`.
- **Cambios realizados:** consulta dedicada con `role=consultant` y `id != owner.id`, exclusión del Owner desde la fuente, botón Crear consultor hacia `/consultor/registro`, copia del link y empty state explicativo.
- **Protección:** las acciones administrativas continúan verificando server-side que el perfil objetivo tenga rol `consultant`.
- **Resultado de build:** `npm run lint` y `npm run build` pasaron; TypeScript sin errores.
- **Commit:** `e4a51f0`.
- **Riesgos/pendientes:** probar visualmente el Panel Owner contra Supabase remoto después de aplicar la migración `002`.
- **Estado final:** Closed.

### 2026-06-09 — Gestión de consultores, mensajes de login y recuperación de contraseña

- **Diagnóstico:** el login devolvía mensajes genéricos sin distinguir estado de la cuenta; no existía flujo de recuperación de contraseña; el Panel Owner no tenía herramientas para resolver problemas de acceso de consultores.
- **Archivos tocados:** `src/app/login/actions.ts`, `src/app/login/LoginForm.tsx`, `src/app/login/reset-password/page.tsx` (nuevo), `src/app/login/reset-password/actions.ts` (nuevo), `src/app/auth/confirm/route.ts` (nuevo), `src/app/admin/actions.ts`, `src/app/admin/page.tsx`, `src/app/globals.css`, `proxy.ts`, `supabase/migrations/003_password_recovery_logs.sql` (nuevo).
- **Cambios realizados:** mensajes de login específicos por estado (`pending`, `inactive`, `deleted`); link "¿Olvidaste tu contraseña?" en login; flujo completo de recovery por email vía Supabase; `/auth/confirm` para intercambio de código; Panel Owner con "Enviar recuperación", "Contraseña temporal" y diagnóstico expandible por consultor.
- **Protección:** todas las acciones de administración verifican `requireOwner()`; no se exponen secretos; passwords no se almacenan.
- **Resultado de build:** `npm run lint` y `npm run build` pasaron; TypeScript sin errores.
- **Commit:** `18e1207`.
- **Riesgos/pendientes:** configurar `NEXT_PUBLIC_SITE_URL` en Vercel; agregar Redirect URLs en Supabase Auth (`/auth/confirm`); aplicar migración `003`.
- **Estado final:** Closed (requiere configuración Vercel/Supabase para activar recovery).

### 2026-06-10 — Borrado definitivo de consultores

- **Diagnóstico:** la baja lógica anterior (`status=deleted`) impedía que el mismo email se registrara nuevamente. El caso Santiago (consultor con problemas de acceso) requería un mecanismo de borrado limpio.
- **Archivos tocados:** `src/app/admin/actions.ts`, `src/app/admin/page.tsx`, `DECISIONS.md`, `BarrioInglesPlans.md`, `PRODUCT_STATUS.md`, `handoff.md`.
- **Cambios realizados:** `deleteConsultantAction` reemplazado con hard delete (elimina logs → auth.users con cascade a profiles → access_tokens). Confirmación en UI actualizada para aclarar el carácter definitivo. `sendPasswordRecoveryAction` ahora usa `headers().get("origin")` como fallback cuando `NEXT_PUBLIC_SITE_URL` no está configurada.
- **Decisión reemplazada:** baja lógica con `status=deleted`. Ver `DECISIONS.md` para trazabilidad.
- **Protección:** server-side verifica `role=consultant` y bloquea si el objetivo es el Owner. No se puede borrar al Owner.
- **Resultado de build:** `npm run lint` y `npm run build` pasaron; TypeScript sin errores.
- **Commit:** `5c30adf`.
- **Riesgos/pendientes:** para el caso Santiago, usar el botón Borrar del Panel Owner (hard delete disponible desde este commit).
- **Estado final:** Closed.

### 2026-06-10 — Botón volver al Panel Owner desde registro de consultor

- **Diagnóstico:** desde `/admin` → "Crear consultor" → `/consultor/registro` no había forma de volver al Panel Owner sin usar el botón atrás del navegador.
- **Archivos tocados:** `src/app/consultor/registro/page.tsx`, `src/app/consultor/registro/RegistrationForm.tsx` (nuevo).
- **Cambios realizados:** `page.tsx` convertido a Server Component que llama `getCurrentProfile()` y pasa `isOwner` al formulario. `RegistrationForm.tsx` extraído como Client Component; muestra "Volver al Panel Owner" → `/admin` si `isOwner`, "Volver al login" en caso contrario.
- **Protección:** la detección de Owner ocurre server-side; no se expone lógica de rol al cliente. La lógica de registro no fue modificada.
- **Resultado de build:** `npm run lint` y `npm run build` pasaron; `/consultor/registro` pasó de estático a dinámico (correcto, ahora lee sesión).
- **Commit:** `7e7959b`.
- **Riesgos/pendientes:** ninguno identificado.
- **Estado final:** Closed.

### 2026-06-10 — Imagen de carátula en hero principal

- **Diagnóstico:** el hero usaba gradientes CSS puros sin imagen real. Se proveyó `Caratula.png` como imagen de marca para el encabezado principal.
- **Archivos tocados:** `src/components/Hero.tsx`, `src/app/globals.css`, `public/images/relleno/Caratula.png` (asset nuevo).
- **Cambios realizados:** fondo del hero actualizado a `url('/images/relleno/Caratula.png') center / cover no-repeat` con gradiente verde oscuro encima (izquierda opaco → derecha translúcido). Agregada línea `.hero-subtitle` con "Urbanización de lujo enfocada en los caballos" entre el h1 y el hero-lead. Eliminada la cuadrícula de líneas sutiles (repeating-linear-gradient) reemplazada por la textura de la imagen.
- **Protección:** no se modificaron secciones internas, mapas, auth ni lógica de acceso.
- **Resultado de build:** `npm run lint` y `npm run build` pasaron; TypeScript sin errores.
- **Commit:** `d23313b` (código) + cierre de OE (imagen).
- **Riesgos/pendientes:** si la imagen se reemplaza en el futuro, usar el mismo nombre de archivo o actualizar la ruta en `globals.css`.
- **Estado final:** Supersedida por la OE siguiente.

### 2026-06-10 — Rediseño Hero centrado con imagen Caratula.png

- **Diagnóstico:** `hero-content` tenía `align-self: center` dentro de un flex-row, lo que centraba verticalmente pero NO horizontalmente — el bloque quedaba a la izquierda. La imagen apuntaba a `/images/hero/hero-triptych.png` (inexistente). Asset real: `public/images/relleno/Caratula.png`.
- **Archivos tocados:** `src/components/Hero.tsx`, `src/app/globals.css`.
- **Cambios realizados:** `.hero` pasa a `flex-direction: column; align-items: center; justify-content: center` → bloque centrado en ambos ejes. `.hero-content` quita `align-self`, mantiene `text-align: center; width: min(960px, 88vw)`. `.hero-triptych` renombrado a `.hero-image-box`, imagen corregida a `/images/relleno/Caratula.png`. Gradiente de fondo ajustado a 160deg para mejor cobertura.
- **Protección:** no se modificaron auth, admin, consultor, roles ni Supabase.
- **Resultado de build:** `npm run lint` y `npm run build` pasaron; TypeScript sin errores.
- **Commit:** `c0e9cbc`.
- **Riesgos/pendientes:** ninguno de código. Si se reemplaza `Caratula.png`, actualizar `Hero.tsx`.
- **Estado final:** Closed.

### 2026-06-10 — Carátula como box centrado apaisado (reemplazo de background)

- **Diagnóstico:** `Caratula.png` quedaba como CSS background full-bleed del hero (modo fondo de pantalla). El Owner requirió que aparezca como imagen contenida, centrada y en formato apaisado.
- **Archivos tocados:** `src/components/CoverImage.tsx` (nuevo), `src/app/page.tsx`, `src/app/globals.css`.
- **Cambios realizados:** hero vuelve a gradiente puro sin imagen de fondo. Nuevo componente `CoverImage` con `next/image`, sección `.cover-image-section` con fondo ivory, box max-width 960px, border-radius y sombra; insertado entre `<Hero />` y `<CoreIdea />` en `page.tsx`.
- **Protección:** no se modificaron auth, roles, accesos ni secciones de contenido existentes.
- **Resultado de build:** `npm run build` pasó; TypeScript sin errores.
- **Commit:** `4b36fb1`.
- **Riesgos/pendientes:** si la imagen tiene proporciones muy distintas a 16:9, ajustar `.cover-image-box` con `aspect-ratio` explícito.
- **Estado final:** Closed.
