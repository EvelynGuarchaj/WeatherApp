# Weather App
## Descripción
Aplicación web hecha con HTML, CSS Y JavaScript
## Funcionalidades
1. La pestaña principal: muestra el detalle del clima de la cuidad donde se encuentre el usuario y debe contener lo siguiente:
- Clima actual: temperatura, sensación térmica, condición del cielo, velocidad del viento y 
humedad.
- Pronóstico: al menos 3 días con máxima y mínima. Se muestra nombre y nuúmero del día de la semana y un emoji  dependiendo del clima que se vaya a tener
- La imagen del clima actual debe aparecer en grande en medio y los demás detalles a su par
2. Búsqueda por ciudad:Por medio de un campo de búsqueda ubicado en la esquina superior derecha,el usuario podrá buscar por el nombre de ciudad y la app resuelve las coordenadas y muestra los resultados para esa ciudad. Si hay dos ciudades con el mismo nombre se muestra un listado para que el usuario decida cuál mostrar, si solo coincide una ciudad se muestra rellena la página principal con los datos de clima de la ciudad buscada. 
Nota: Los grados se miden en grados Celsius 
3. Estado de carga: La pantalla muestra la imagen (cargando) que se encuentra en `assets/images/`, el texto: Cargando..., y una carga progresiva circular
4. Estados de error: 
- No existe la ciudad: La pantalla muestra la imagen (noExiste) que se encuentra en `assets/images/` y el texto: No existe la ciudad y un emoji triste
- No hay conexión a internet: La pantalla muestra la imagen (sinConexion) que se encuentra en `assets/images/` y el texto: Sin conexión a internet, encienda el WiFi o sus datos móviles y un emoji sonriente  
Nota: En ambos casos debe aparecer un botón de reintentar debajo del mensaje de error
5. El diseño debe ser responsivo, debe verse bien en computadoras, tablets y celulaes 
## Ciudad inicial
Arrancar mostrando Totonicapán 
## Estados de la pantalla
- Principal
- Cargando
- Principal pero con ciudad encontrada 
- Error: ciudad no encontrada
- Error: sin conexión
## Fuente de datos
- Geocoding: geocoding-api.open-meteo.com
- Clima: api.open-meteo.com
- Sin llave de API. Parámetros exactos: confirmar con la documentación oficial
(open-meteo.com/en/docs) antes de escribir la primera petición
## Recursos visuales
- Íconos del clima: `assets/images/` (soleado, nublado, lluvia, tormenta,niebla...)
o decide usar emojis si no se encuentra uno que coincida con el clima encontrado
- El color de acentuación de titulos, subtitulos y demás detalles del css debe basarse en la paleta de colores de:`assets/paleta/`, tomando en cuenta que el fondo principal debe ser blanco o blanco con un color claro difuminado en los bordes. 
## Fuera de alcance
No se debe usar geolocalización del navegador 

