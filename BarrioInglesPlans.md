# BarrioInglesPlans

## 1. Identidad del proyecto

- **Nombre:** Barrio Inglés / Barrio Hípico Presentación.
- **Propósito:** presentación online privada para Owner, consultores inmobiliarios e inversores/visitantes autorizados.
- **Naturaleza:** no es una web pública abierta. La presentación principal y la línea separada de Polo Logístico requieren acceso autorizado.
- **Sensibilidad:** contiene información inmobiliaria y urbanística tratada en contexto de NDA.
- **Repositorio local oficial:** `C:\proyectos\barrio-hipico-presentacion`.
- **Repositorio remoto observado:** `origin/main` en GitHub.
- **Despliegue:** el contexto operativo menciona Vercel, pero el repositorio no contiene `.vercel` ni configuración que permita verificar el estado remoto. Debe validarse fuera del repo.

## 2. Stack tecnológico real

| Capa | Tecnología |
|---|---|
| Framework | Next.js `16.2.7`, App Router |
| UI | React `19.2.4`, TypeScript estricto |
| Estilos | Tailwind CSS `4.3.0` importado desde `globals.css` y CSS global editorial |
| Auth / DB | Supabase mediante `@supabase/supabase-js` y `@supabase/ssr` |
| Seguridad local | `node:crypto` para `scrypt`, HMAC, salts y slugs |
| Package manager | npm con `package-lock.json` |
| Validación | ESLint y `next build` |
| Hosting previsto | Vercel; estado remoto no verificable desde el repo |

## 3. Estructura relevante

```text
src/
  app/
    access/[slug]/        # ingreso Visitante por PIN
    admin/                # Panel Owner
      instructivo/        # guía interna solo Owner
    consultor/            # Panel Consultor
      instructivo/        # guía operativa para Consultor u Owner
    login/                # login Owner/Consultor
    polo-logistico/       # narrativa territorial separada
    auth-actions.ts       # logout
    globals.css           # presentación y paneles privados
    page.tsx              # presentación principal protegida
  components/             # secciones visuales de la presentación
  data/content.ts         # contenido estructurado
  lib/
    auth/                 # roles, PIN y cookie viewer
    supabase/             # clientes browser, server y service role
public/
  images/
    architecture/
      equestrian-amenities/
      housing/
    territorio/
  plans/
supabase/
  migrations/
    001_access_control.sql
proxy.ts                  # protección básica y refresh de sesión
```

## 4. Rutas reales

| Ruta | Acceso | Protección real |
|---|---|---|
| `/` | Owner, Consultor o Visitante válido | `proxy.ts` y `requirePresentationAccess()` |
| `/polo-logistico` | Owner, Consultor o Visitante válido | `proxy.ts` y `requirePresentationAccess()` |
| `/login` | Pública | incluida en `PUBLIC_ROUTES` |
| `/access/[slug]` | Pública para validar PIN | incluida por prefijo `/access`; la verificación ocurre server-side |
| `/admin` | Solo Owner | `requireOwner()` |
| `/admin/instructivo` | Solo Owner | `requireOwner()` |
| `/consultor` | Consultor u Owner | `requireConsultantOrOwner()` |
| `/consultor/instructivo` | Consultor u Owner | `requireConsultantOrOwner()` |

Los assets de `/_next/*`, `/images/*`, favicon y extensiones de imagen admitidas quedan fuera del matcher de protección.

## 5. Roles operativos

### Owner

- Panel: `/admin`.
- Identificación visual actual: **Panel Owner** / **Panel del dueño**.
- Puede crear, activar y desactivar consultores.
- Puede crear accesos desde `/consultor`.
- Puede revocar cualquier acceso.
- Puede ver accesos globales y logs.
- Puede ver la presentación y el instructivo interno.

### Consultor

- Panel: `/consultor`.
- Identificación visual actual: **Panel Consultor** / **Panel de un consultor creado por el dueño**.
- Puede crear links únicos y PINs propios.
- Puede ver y revocar sus propios accesos.
- Puede consultar el instructivo operativo en `/consultor/instructivo`.
- No puede crear consultores ni entrar a `/admin`.
- El panel no muestra la identidad del Owner.

### Visitante

- Entrada: `/access/[slug]`.
- Recibe link único y PIN de 4 dígitos.
- Si el acceso es válido, recibe una cookie viewer firmada y entra a la presentación.
- No puede entrar a `/admin` ni `/consultor`.

## 6. Supabase

La migración real es `supabase/migrations/001_access_control.sql`.

### `profiles`

- Relación uno a uno con `auth.users`.
- Campos principales: `id`, `email`, `full_name`, `role`, `active`, `created_at`.
- Roles persistidos: `owner`, `consultant`.

### `access_tokens`

- Pertenece a un perfil consultor mediante `consultant_id`.
- Guarda visitante, slug, hash/salt del PIN, vencimiento, usos, intentos fallidos, bloqueo, estado y revocación.
- `pin_hash` y `pin_salt` no se conceden a clientes autenticados.

### `access_logs`

- Registra eventos de consultores, accesos, PIN y sesiones viewer.
- Eventos definidos: creación/estado de consultor, creación/revocación de acceso, PIN correcto/incorrecto/bloqueado/vencido y sesión viewer.

### RLS y service role

- RLS está activa en las tres tablas.
- Owner puede leer perfiles, accesos globales y logs.
- Consultor puede leer únicamente su perfil y accesos.
- Escrituras críticas y lectura de hash/salt se centralizan en Server Actions con service role.
- `src/lib/supabase/admin.ts` es server-only y nunca debe importarse desde componentes client.

## 7. Autenticación y acceso

- Owner y Consultor ingresan por email/password con Supabase Auth.
- No existe signup público.
- El login valida además que exista un `profile` activo.
- El PIN Visitante:
  - siempre tiene 4 dígitos y admite ceros iniciales;
  - se genera con `randomInt`;
  - se guarda como hash `scrypt` con salt aleatorio;
  - se muestra una sola vez al crear el acceso.
- El slug se genera con 24 bytes aleatorios en base64url.
- Tras 5 intentos fallidos, el acceso se bloquea temporalmente por 15 minutos.
- Se aplican vencimiento, máximo de usos, revocación y actualizaciones condicionales para reducir carreras.
- La cookie `bh_viewer_access` usa firma HMAC SHA-256, es `httpOnly`, `sameSite=lax`, `secure` en producción y dura como máximo 12 horas o hasta el vencimiento del token.

## 8. Proxy y protección de rutas

`proxy.ts`:

1. Refresca/consulta la sesión Supabase.
2. Permite `/login` y `/access`.
3. Permite usuarios autenticados.
4. Permite cookie viewer válida únicamente para `/` y `/polo-logistico`.
5. Redirige el resto a `/login`.

La autorización fina no depende solo del proxy:

- `/admin` y `/admin/instructivo` ejecutan `requireOwner()`.
- `/consultor` ejecuta `requireConsultantOrOwner()`.
- `/consultor/instructivo` ejecuta `requireConsultantOrOwner()`.
- La presentación ejecuta `requirePresentationAccess()`.

## 9. Presentación principal

`src/app/page.tsx` monta actualmente:

1. Navigation.
2. Hero.
3. Core Idea.
4. Masterplan.
5. Equestrian Amenities.
6. Equestrian Experience.
7. Business Units.
8. Housing.
9. LandBank / Chacras.
10. Ubicación estratégica.
11. Closing.

`ArchitectureBrand.tsx` existe en el repositorio, pero no está montado actualmente en `page.tsx`; debe tratarse como **Needs Review** antes de asumir que forma parte de la home.

`/polo-logistico` es una página protegida separada. Su narrativa declara expresamente que no integra el masterplan residencial ecuestre.

## 10. Assets

- `public/images/territorio/`: planos, masterplans, red ecuestre, material de Polo Logístico y PDF territorial.
- `public/images/architecture/equestrian-amenities/`: imágenes de amenities ecuestres.
- `public/images/architecture/housing/`: referencias de modelos Housing.
- `public/images/architecture/`: material fuente y carpeta estructural de arquitectura.
- `public/plans/masterplan.pdf`: PDF público del masterplan.

Los mapas y planos usan `object-fit: contain` donde corresponde para preservar proporción. No mover ni renombrar assets sin revisar sus rutas en componentes y `src/data/content.ts`.

## 11. Zonas sensibles

No modificar sin diagnóstico previo:

- `.env.local`.
- `SUPABASE_SERVICE_ROLE_KEY`.
- `ACCESS_COOKIE_SECRET`.
- `proxy.ts`.
- `src/lib/auth/*`.
- `src/lib/supabase/*`.
- Server Actions de login, administración, consultor y Visitante.
- `supabase/migrations/001_access_control.sql`.
- Políticas RLS y privilegios de columnas.
- Hashing de PIN y cookie viewer.
- Variables de entorno de Vercel.
- Rutas protegidas.

## 12. Convenciones obligatorias

- Nunca subir `.env.local`.
- Nunca exponer claves reales en documentación, logs o UI.
- Nunca guardar PINs en texto plano.
- Ejecutar `npm run lint` y `npm run build` antes de cerrar cambios.
- No desplegar sin build correcto y revisión de variables de entorno.
- No tocar presentación visual al trabajar auth salvo necesidad explícita.
- No tocar auth al trabajar contenido visual.
- Mantener `/polo-logistico` separado de la narrativa principal.
- Actualizar la documentación estructural según `PromtsOperativos.md`.

## 13. Estado Git observable

- Rama actual auditada: `main`.
- Remoto: `origin/main`.
- Commits identificados:
  - `5b93876` — Initial Barrio Hipico online presentation.
  - `ae78647` — Add private access system with owner and consultant panels.
- Al crear este documento existían cambios sin commit en UI de paneles privados e instructivo interno.
