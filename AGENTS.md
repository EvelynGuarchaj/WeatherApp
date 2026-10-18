# AGENTS.md

## Qué es este repo
- Asignatura "Progra Web": app de clima con HTML, CSS y JavaScript puros.
  Sin framework, sin bundler, sin npm, sin build, sin tests, sin lint.
- `README.md` es la especificación del profesor (en español). Es la fuente
  de verdad de requisitos: si este archivo y el README difieren, vale el README.
- Estado actual: solo existen requisitos y `assets/`. El código está por crear.

## Requisitos que suelen pasarse por alto
- APIs: geocoding-api.open-meteo.com y api.open-meteo.com. Sin API key.
  Confirmar parámetros exactos en open-meteo.com/en/docs antes de escribir
  la primera petición.
- Unidades en Celsius. Ciudad inicial: Totonicapán.
- Geolocalización del navegador: prohibida (fuera de alcance).
- Estados de pantalla: principal, cargando, ciudad encontrada, ciudad no
  encontrada, sin conexión. Cada error usa su imagen de `assets/images/`
  (cargando.jpeg, noExiste.jpeg, sinConexion.jpeg) y lleva botón de reintentar.
- Diseño responsivo (computadora, tablet, celular).
- Paleta de colores obligatoria: `assets/paleta/paletaColores.jpeg`.
  El fondo principal debe ser blanco o blanco con un color claro difuminado
  en los bordes; el acento de títulos y detalles sale de esa paleta.
- Íconos del clima: usar las imágenes de `assets/images/` que coincidan
  con la condición; si no hay coincidencia, usar emoji.

## Flujo de trabajo con specs
- Skills `/spec` (diseña la spec, no escribe código) y `/spec-impl`
  (implementa una spec aprobada, paso a paso, sin commitear solo).
- Las specs se guardan en `specs/NN-slug.md`. `/spec-impl` solo corre con
  estado "Approved"/"Aprobado" y crea la rama `spec-NN-slug`.
- No hacer commit automáticamente: el usuario decide y lo pide.
- Las skills están bloqueadas por `skills-lock.json`; no editar
  `.agents/skills/` salvo que el usuario lo pida.

## Convención de idioma
- Specs, respuestas y nombres de archivos siguen el español del README.
 <!-- agregado a mano -->
## Como se levanta 
- Se levanta con Live Server de VS Code 

