# SPEC 01 — App de clima con HTML, CSS y JS puros

> **Estado:** Aprobado
> **Depends on:** —
> **Date:** 2026-10-17
> **Objective:** Construir la app de clima en HTML, CSS y JS puros que al abrir muestra el clima actual y el pronóstico de 3 días de Totonicapán y permite buscar cualquier ciudad, con sus pantallas de carga y error.

## Por qué existe esta spec

El README define 2 pantallas de error, pero un `fetch` sin timeout puede dejar la app pegada en "Cargando..." para siempre y un HTTP 500 no significa falta de conexión. Esta spec separa ambos casos y les da pantalla propia.

## Alcance

**Incluido:**

- Archivos nuevos: `index.html`, `css/estilos.css`, `js/api.js`, `js/estados.js`, `js/clima.js`, `js/main.js`.
- Pantalla principal con clima actual (temperatura, sensación térmica, condición del cielo, viento, humedad), imagen grande al centro y los demás datos en pares.
- Pronóstico de exactamente 3 días con nombre y número del día de la semana, máxima y mínima en °C, y emoji según el clima.
- Búsqueda por ciudad desde la esquina superior derecha: campo de búsqueda con botón, disparada también con Enter.
- Desplegable bajo el buscador cuando varias ciudades comparten nombre; al elegir una fila se carga su clima.
- 7 estados: `principal`, `principalCiudadEncontrada`, `cargando`, `errorNoExiste`, `errorSinConexion`, `errorServidor`, `listaCiudades`.
- Pantallas de error con sus imágenes (`noExiste.jpeg`, `sinConexion.jpeg`, `errorServidor.jpeg`), su texto y botón Reintentar.
- Timeout de 8000 ms con `AbortController` en toda petición.
- APIs confirmadas de Open-Meteo sin API key (parámetros abajo).
- Diseño responsivo (computadora, tablet, celular) con la paleta de `assets/paleta/paletaColores.jpeg`.
- Fondo blanco o blanco con color claro difuminado en los bordes.

**Fuera de alcance (para specs futuras):**

- Geolocalización del navegador (prohibida por el README).
- Persistencia: recordar la última ciudad en localStorage.
- Más de 3 días de pronóstico.
- Framework, bundler, npm, tests automatizados o linter.
- Cualquier otra API del clima o uso de API key.

## Modelo de datos

```js
// js/estados.js — única fuente de verdad de la pantalla visible
const estado = {
  pantalla: 'principal', // 'principal' | 'principalCiudadEncontrada' | 'cargando'
    // | 'errorNoExiste' | 'errorSinConexion' | 'errorServidor' | 'listaCiudades'
  ultimaAccion: null,   // función sin argumentos; la dispara el botón Reintentar
  ciudadActual: null     // { name, admin1, country } de la última pantalla principal
}
```

- `principal` y `principalCiudadEncontrada` renderizan el mismo `#seccion-principal`; solo cambian los datos (mismo diseño, distintos datos).
- `listaCiudades` muestra el desplegable `#listaCiudades` bajo el buscador y conserva el contenido central anterior.

```js
// js/api.js — error tipado con clasificación de red/servidor
class ErrorDeAplicacion extends Error {
  constructor(codigo) { // 'sinConexion' | 'errorServidor'
    super(codigo)
    this.codigo = codigo
  }
}
```

```js
// js/clima.js — datos ya formateados para renderizar
const datosClima = {
  actual: { temperatura, sensacion, humedad, viento, codigoClima },
  pronostico: [/* { fecha, diaSemana, maxima, minima, codigoClima } × 3 */]
}
```

**Contrato de errores** (detecta `api.js`, decide `main.js`, maqueta `estados.js`):

| Situación | Señal | Código | Pantalla |
|---|---|---|---|
| No se pudo conectar | `fetch` rechaza con `TypeError` | `sinConexion` | `sinConexion.jpeg` |
| Timeout de 8000 ms | `fetch` rechaza con `AbortError` | `sinConexion` | `sinConexion.jpeg` |
| El servidor contestó con error | `respuesta.ok === false` | `errorServidor` | `errorServidor.jpeg` |
| Cuerpo JSON inválido | `respuesta.json()` lanza | `errorServidor` | `errorServidor.jpeg` |
| Ciudad sin coincidencias | geocoding sin `results` o `results: []` | (dato, no excepción) | `noExiste.jpeg` |

- `navigator.onLine` no se usa en ningún punto.
- `estados.js` es el único archivo que conoce imágenes, textos y emojis de error.

**Endpoints y parámetros exactos:**

```
https://geocoding-api.open-meteo.com/v1/search?name={nombre}&count=10&language=es&format=json

https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}
  &current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m
  &daily=weather_code,temperature_2m_max,temperature_2m_min
  &timezone=auto&forecast_days=3&temperature_unit=celsius&wind_speed_unit=kmh
```

**Convenciones:**

- Nombres de variables, funciones y archivos en español camelCase.
- Temperaturas como número en °C.
- Scripts con `type="module"`; requiere Live Server (no abre con `file://`).
- `weather_code` WMO se traduce en `clima.js` con un mapa a imagen de `assets/images/`; si no hay imagen que coincida, emoji.

## Plan de implementación

1. Crear `index.html` con las 7 secciones (`#seccion-principal`, `#seccion-cargando`, `#seccion-errorNoExiste`, `#seccion-errorSinConexion`, `#seccion-errorServidor`, `#listaCiudades`, y el campo de búsqueda con su botón arriba a la derecha). Ver: Live Server muestra el esqueleto.
2. Crear `css/estilos.css`: variables de `paletaColores.jpeg`, fondo blanco con difuminado en bordes, layout de la tarjeta principal (imagen grande al centro, detalles en pares). Ver: layout visible en el paso 1.
3. Agregar en `estilos.css` los estilos de `cargando`, las 3 pantallas de error, el desplegable y las media queries de tablet/celular.
4. Crear `js/estados.js`: función `mostrar(pantalla)` que oculta todas las secciones y muestra la indicada, guardando `estado`. Ver: desde la consola, `mostrar('errorNoExiste')` cambia la pantalla.
5. Crear `js/api.js`: `obtenerJson(url)` con `AbortController` (8000 ms), `ErrorDeAplicacion`, `buscarCiudad(nombre)` y `obtenerClima(lat, lon)`. Ver: desde la consola, `buscarCiudad('Totonicapán')` devuelve coordenadas.
6. Crear `js/clima.js`: mapa `weather_code` WMO → imagen/emoji y funciones de render de la tarjeta actual y del pronóstico de 3 días. Ver: con datos simulados en consola, el render muestra los datos formateados.
7. Crear `js/main.js`: carga inicial de Totonicapán, `catch` de `ErrorDeAplicacion` por código hacia `estados.js`, y botón Reintentar que re-ejecuta `estado.ultimaAccion`. Ver: la app abre mostrando el clima de Totonicapán.
8. Completar en `js/main.js` la búsqueda (Enter y botón), la ruta de desambigüación al desplegable, y la navegación de filas a `obtenerClima`. Ver: buscar "Guatemala" y "San Pedro" carga su clima.

## Criterios de aceptación

- [ ] Abrir con Live Server muestra el clima de Totonicapán sin errores en consola: temperatura, sensación térmica, condición del cielo, viento y humedad visibles.
- [ ] La imagen del clima actual aparece grande y centrada, con los demás datos en pares.
- [ ] El pronóstico muestra exactamente 3 días con nombre y número del día de la semana, máxima y mínima en °C.
- [ ] Cada día del pronóstico muestra un emoji según su `weather_code`.
- [ ] Cada petición muestra la pantalla de cargando con `cargando.jpeg`, el texto "Cargando..." y un indicador circular animado.
- [ ] Buscar una ciudad de único resultado con Enter o con el botón reemplaza los datos de la pantalla principal.
- [ ] Varias coincidencias muestran el desplegable bajo el buscador; al pulsar una fila se carga su clima y el desplegable se cierra.
- [ ] Sin coincidencias se muestra `noExiste.jpeg` con el texto "No existe la ciudad", un emoji triste y el botón Reintentar.
- [ ] Con la red desconectada se muestra `sinConexion.jpeg` con el texto "Sin conexión a internet, encienda el WiFi o sus datos móviles", un emoji sonriente y el botón Reintentar.
- [ ] Un HTTP 4xx/5xx o un cuerpo JSON inválido muestra `errorServidor.jpeg` con texto de error y el botón Reintentar.
- [ ] Una petición sin respuesta en 8000 ms se aborta y muestra la pantalla de sin conexión (verificable con throttling "Slow 3G" en DevTools).
- [ ] El botón Reintentar re-ejecuta la última acción; ninguna pantalla de error queda sin botón.
- [ ] Al recargar la página se vuelve a mostrar Totonicapán.
- [ ] El layout se ve correcto en viewport de 1024px, 768px y 375px.
- [ ] El código no contiene `navigator.onLine` ni llamadas de geolocalización.
- [ ] Solo se peticiona a `geocoding-api.open-meteo.com` y `api.open-meteo.com`, sin API key.

## Decisiones

- **Sí:** 4 archivos JS con ES modules (`type="module"`). **No:** un solo `app.js` — separa red, render, estados y orquestación.
- **Sí:** timeout de 8000 ms con `AbortController` clasificado como `sinConexion`. **No:** `fetch` nativo sin timeout — dejaría la app pegada en "Cargando...".
- **Sí:** `errorServidor` separado de `sinConexion` (`respuesta.ok === false` implica que hubo conexión). **No:** pintar todo como sin conexión — mentiría sobre la causa.
- **Sí:** no usar `navigator.onLine`. **No:** confiar en él — devuelve `true` con WiFi sin salida a internet.
- **Sí:** `errorServidor.jpeg` como pantalla propia (imagen aportada por el dueño). **No:** reusar `sinConexion.jpeg` — mezclaría conceptos separados.
- **Sí:** siempre arrancar con Totonicapán sin localStorage. **No:** recordar la última ciudad — el README exige arrancar con Totonicapán.
- **Sí:** desplegable bajo el buscador para desambiguar. **No:** listado en el área central — decisión tomada con el dueño.
- **Sí:** botón de búsqueda además de Enter. **No:** solo Enter — incómodo en celular.
- **Sí:** mismo panel DOM para `principal` y `principalCiudadEncontrada`. **No:** dos secciones duplicadas — mismo diseño, distintos datos.
- **Sí:** `forecast_days=3` y `temperature_unit=celsius` explícitos. **No:** depender de defaults — el README los exige.

## Riesgos

| Riesgo | Mitigación |
| --- | --- |
| Abrir `index.html` con `file://` rompe los ES modules | Live Server obligatorio (registrado en `AGENTS.md`). |
| 8000 ms queda corto en red muy lenta | Constante `TIEMPO_LIMITE_MS` arriba de `api.js`, fácil de ajustar. |
| Geocoding sin clave `results` en ciertos casos | Chequear `!datos.results || datos.results.length === 0` antes de decidir. |
| Open-Meteo cambia parámetros | Las URLs viven como constantes al inicio de `api.js`; verificar en la documentación oficial. |

## Qué **no** va en esta spec

- Geolocalización del navegador.
- Recordar ciudades o cualquier persistencia.
- Pronóstico de más de 3 días.
- Framework, npm, tests o linter.
- Otras APIs del clima o API key.

Cada uno de estos, si llega, va en su propia spec.
