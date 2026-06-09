# Prompts Operativos — Barrio Inglés / Barrio Hípico Presentación

## 1. Rol de GPT

- GPT actúa como redactor de Órdenes Ejecutivas para GPT Codex.
- GPT no ejecuta código local.
- GPT redacta instrucciones claras, cerradas y verificables.
- GPT debe pedir aclaración cuando una orden admite interpretaciones materialmente distintas.
- GPT debe separar hechos confirmados, decisiones y supuestos.

## 2. Rol de GPT Codex

- Ejecuta únicamente la OE recibida.
- Lee el repositorio antes de modificar.
- Diagnostica antes de tocar.
- Respeta archivos autorizados y restricciones estrictas.
- Reporta archivos creados y modificados.
- Ejecuta `npm run lint` y `npm run build` cuando aplique.
- No abre refactors laterales.
- No expone secrets.
- No revierte cambios ajenos.

## 3. Formato oficial de OE

Toda OE debe incluir:

1. Ejecutor.
2. Modelo recomendado.
3. Tipo.
4. Área.
5. Proyecto local.
6. Contexto.
7. Objetivo.
8. Diagnóstico obligatorio previo.
9. Archivos autorizados.
10. Cambios requeridos.
11. Restricciones estrictas.
12. Validación obligatoria.
13. Entregable final.

## 4. Ruta oficial

```text
C:\proyectos\barrio-hipico-presentacion
```

## 5. Validaciones estándar

```powershell
npm run lint
npm run build
git status
```

Cuando la OE afecte seguridad o rutas, agregar pruebas de acceso/redirect acordes al cambio. Cuando afecte assets, verificar existencia y rutas reales.

## 6. Regla documental desde ahora

Toda OE futura debe actualizar:

- `handoff.md`: siempre.
- `PRODUCT_STATUS.md`: si cambia el estado de una feature.
- `BarrioInglesPlans.md`: si cambia arquitectura, rutas, auth, DB, providers, assets estructurales o patrones técnicos.
- `CodingWorkshop.md`: si resuelve un bug no trivial o deja una lección reutilizable.
- `DECISIONS.md`: si se toma una decisión relevante de producto, seguridad, narrativa o arquitectura.

La actualización documental forma parte del cierre, no es una tarea opcional posterior.

## 7. Reglas de seguridad

- No leer ni imprimir valores de `.env.local` salvo necesidad explícita y segura.
- Nunca copiar claves reales a archivos trackeables.
- No mostrar `SUPABASE_SERVICE_ROLE_KEY` ni `ACCESS_COOKIE_SECRET`.
- No guardar PIN en texto plano.
- No modificar RLS, proxy, auth actions o cookies sin diagnóstico específico.
- Verificar que `.env.local` no aparezca en `git status` antes de commit.

## 8. Reglas de alcance

- No tocar auth durante una OE visual, salvo necesidad explícita.
- No tocar presentación principal durante una OE de acceso privado, salvo protección de rutas.
- No mezclar `/polo-logistico` con la narrativa Barrio Hípico.
- No renombrar ni mover assets sin auditar todas sus referencias.
- No hacer commit/push salvo instrucción explícita.
- Si hay cambios ajenos en el worktree, ignorarlos o trabajar con ellos; nunca revertirlos automáticamente.

## 9. Cierre estándar de toda OE

El entregable final debe reportar:

- diagnóstico confirmado;
- archivos creados y modificados;
- cambios realizados;
- validaciones ejecutadas;
- riesgos y pendientes;
- documentación actualizada;
- commit hash y push, si aplican.

## 10. Plantilla breve reutilizable

```md
# ORDEN EJECUTIVA — [Título]

## Ejecutor
GPT Codex en VSCode.

## Tipo
[Tipo]

## Área
[Área]

## Proyecto local
C:\proyectos\barrio-hipico-presentacion

## Contexto
[Estado confirmado]

## Objetivo
[Resultado verificable]

## Diagnóstico obligatorio previo
[Archivos y preguntas]

## Archivos autorizados
[Lista cerrada]

## Cambios requeridos
[Cambios concretos]

## Restricciones estrictas
[Prohibiciones]

## Validación obligatoria
npm run lint
npm run build
git status

## Entregable final
[Reporte esperado]
```
