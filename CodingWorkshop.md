# Coding Workshop

Registro de problemas técnicos resueltos del proyecto Barrio Inglés / Barrio Hípico Presentación.

## Plantilla obligatoria

## YYYY-MM-DD — Título breve del problema

- **Problema:**
- **Causa raíz:**
- **Consecuencia:**
- **Proceso de solución:**
- **Solución final:**
- **Commit:**
- **Lección:**

---

## 2026-06-08 — Masterplan: preservar proporción de imágenes territoriales

- **Problema:** planos e imágenes territoriales podían sentirse deformados o recortados dentro de cards.
- **Causa raíz:** los planos requieren una estrategia distinta a fotografías editoriales; forzar crop o proporciones visuales reduce legibilidad técnica.
- **Consecuencia:** pérdida de confianza en la lectura del masterplan.
- **Proceso de solución:** revisar componentes de Masterplan, contenedores visuales y estilos de imagen.
- **Solución final:** previews con dimensiones controladas y `object-fit: contain`, priorizando la proporción real del documento.
- **Commit:** `5b93876` contiene el estado resultante; el commit específico de la corrección no está identificado.
- **Lección:** planos y mapas deben priorizar proporción real sobre crop estético.

## 2026-06-08 — Ubicación estratégica: eliminar duplicación de masterplan

- **Problema:** la sección podía mostrar un plano principal y un bloque inferior adicional.
- **Causa raíz:** interpretación incorrecta de si el nuevo asset reemplazaba o complementaba el bloque previo.
- **Consecuencia:** duplicación visual y pérdida de jerarquía.
- **Proceso de solución:** revisar `Location.tsx`, confirmar el asset correcto y eliminar el contenedor anterior completo.
- **Solución final:** una sola imagen `Masterplan general 2.png` como plano principal full width, con referencias debajo.
- **Commit:** `5b93876` contiene el estado resultante; el commit específico de la corrección no está identificado.
- **Lección:** cuando una imagen reemplaza a otra, debe eliminarse también el título, contenedor y espacio reservado previos.

## 2026-06-09 — Acceso privado: PIN simple sin almacenamiento en texto plano

- **Problema:** se necesitaba un PIN operativo de 4 dígitos sin convertirlo en el único factor de seguridad.
- **Causa raíz:** el requisito comercial prioriza facilidad de uso, pero un PIN corto aislado es débil.
- **Consecuencia:** riesgo de adivinación o reenvío si no se agregan controles.
- **Proceso de solución:** combinar slug criptográfico, salt, hash `scrypt`, vencimiento, máximo de usos, bloqueo, revocación y cookie HMAC.
- **Solución final:** PIN mostrado una sola vez, persistido como `pin_hash` + `pin_salt`, validado server-side y acompañado por controles compensatorios.
- **Commit:** `ae78647`.
- **Lección:** un PIN corto solo es aceptable cuando está rodeado de controles de contexto, límite y revocación.

## 2026-06-09 — Paneles privados: diferenciar Owner y Consultor

- **Problema:** los paneles podían resultar visualmente similares y confundir capacidades.
- **Causa raíz:** títulos y acciones compartían jerarquía sin explicar claramente el rol.
- **Consecuencia:** riesgo operativo: un usuario podía no entender qué datos ve o qué acciones puede realizar.
- **Proceso de solución:** agregar títulos exactos por rol, resúmenes de capacidades, anonimato visual del Owner en Consultor e instructivo interno.
- **Solución final:** Panel Owner institucional con capacidades globales y Panel Consultor operativo con accesos propios.
- **Commit:** pendiente de completar; cambios presentes sin commit al momento de crear este documento.
- **Lección:** la autorización técnica debe acompañarse de una identificación visual inequívoca.

## Nota sobre Vercel

El repositorio no permite confirmar un incidente o solución concreta de variables Supabase en Vercel. La carpeta `.vercel` está ausente y no hay configuración remota versionada. Cualquier entrada sobre despliegue o variables de Vercel debe agregarse solo después de verificar el entorno remoto.
