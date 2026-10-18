// Mapa de codigos WMO a imagen, emoji y descripcion en espanol
const mapaClima = {
  0: { descripcion: 'Despejado', imagen: 'assets/images/despejado.jpeg', emoji: '☀️' },
  1: { descripcion: 'Mayormente despejado', imagen: 'assets/images/despejado.jpeg', emoji: '🌤️' },
  2: { descripcion: 'Parcialmente nublado', imagen: 'assets/images/parcialmente-nublado.jpeg', emoji: '⛅' },
  3: { descripcion: 'Nublado', imagen: 'assets/images/nublado.jpeg', emoji: '☁️' },
  45: { descripcion: 'Niebla', imagen: 'assets/images/niebla.jpeg', emoji: '🌫️' },
  48: { descripcion: 'Niebla con escarcha', imagen: 'assets/images/niebla.jpeg', emoji: '🌫️' },
  51: { descripcion: 'Llovizna', imagen: 'assets/images/llovizna.jpeg', emoji: '🌦️' },
  53: { descripcion: 'Llovizna moderada', imagen: 'assets/images/llovizna.jpeg', emoji: '🌦️' },
  55: { descripcion: 'Llovizna intensa', imagen: 'assets/images/llovizna.jpeg', emoji: '🌦️' },
  56: { descripcion: 'Llovizna helada', imagen: 'assets/images/llovizna.jpeg', emoji: '🌦️' },
  57: { descripcion: 'Llovizna helada intensa', imagen: 'assets/images/llovizna.jpeg', emoji: '🌦️' },
  61: { descripcion: 'Lluvia leve', imagen: 'assets/images/lluvia.jpeg', emoji: '🌧️' },
  63: { descripcion: 'Lluvia moderada', imagen: 'assets/images/lluvia.jpeg', emoji: '🌧️' },
  65: { descripcion: 'Lluvia intensa', imagen: 'assets/images/lluvia.jpeg', emoji: '🌧️' },
  66: { descripcion: 'Lluvia helada', imagen: 'assets/images/lluvia.jpeg', emoji: '🌧️' },
  67: { descripcion: 'Lluvia helada intensa', imagen: 'assets/images/lluvia.jpeg', emoji: '🌧️' },
  71: { descripcion: 'Nieve leve', imagen: 'assets/images/nieve.jpeg', emoji: '❄️' },
  73: { descripcion: 'Nieve moderada', imagen: 'assets/images/nieve.jpeg', emoji: '❄️' },
  75: { descripcion: 'Nieve intensa', imagen: 'assets/images/nieve.jpeg', emoji: '❄️' },
  77: { descripcion: 'Granos de nieve', imagen: 'assets/images/nieve.jpeg', emoji: '❄️' },
  80: { descripcion: 'Chubascos leves', imagen: 'assets/images/lluvia.jpeg', emoji: '🌧️' },
  81: { descripcion: 'Chubascos moderados', imagen: 'assets/images/lluvia.jpeg', emoji: '🌧️' },
  82: { descripcion: 'Chubascos fuertes', imagen: 'assets/images/lluvia.jpeg', emoji: '🌧️' },
  85: { descripcion: 'Nieves aisladas', imagen: 'assets/images/nieve.jpeg', emoji: '❄️' },
  86: { descripcion: 'Nieves aisladas intensas', imagen: 'assets/images/nieve.jpeg', emoji: '❄️' },
  95: { descripcion: 'Tormenta', imagen: 'assets/images/tormenta.jpeg', emoji: '⛈️' },
  96: { descripcion: 'Tormenta con granizo', imagen: 'assets/images/tormenta.jpeg', emoji: '⛈️' },
  97: { descripcion: 'Tormenta intensa', imagen: 'assets/images/tormenta.jpeg', emoji: '⛈️' },
  99: { descripcion: 'Tormenta intensa con granizo', imagen: 'assets/images/tormenta.jpeg', emoji: '⛈️' }
}

const entradaRespaldo = { descripcion: 'Sin datos', imagen: null, emoji: '🌡️' }

export function traducirClima(codigo) {
  return mapaClima[codigo] || entradaRespaldo
}

// Convierte la respuesta de la API al modelo datosClima
export function formatearClima(datosApi) {
  return {
    actual: {
      temperatura: datosApi.current.temperature_2m,
      sensacion: datosApi.current.apparent_temperature,
      humedad: datosApi.current.relative_humidity_2m,
      viento: datosApi.current.wind_speed_10m,
      codigoClima: datosApi.current.weather_code
    },
    pronostico: datosApi.daily.time.map((fecha, i) => ({
      fecha,
      diaSemana: formatearDia(fecha),
      maxima: datosApi.daily.temperature_2m_max[i],
      minima: datosApi.daily.temperature_2m_min[i],
      codigoClima: datosApi.daily.weather_code[i]
    }))
  }
}

function formatearDia(fecha) {
  const fechaObj = new Date(`${fecha}T00:00:00`)
  const formato = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric' })
  return formato.format(fechaObj)
}

export function renderClimaActual(datos, ciudad) {
  const clima = traducirClima(datos.actual.codigoClima)
  document.getElementById('nombreCiudad').textContent =
    ciudad.country ? `${ciudad.name}, ${ciudad.country}` : ciudad.name

  const imagen = document.getElementById('imagenClimaActual')
  const emoji = document.getElementById('emojiClimaActual')
  if (clima.imagen) {
    imagen.src = clima.imagen
    imagen.alt = clima.descripcion
    imagen.hidden = false
    emoji.hidden = true
  } else {
    imagen.hidden = true
    emoji.textContent = clima.emoji
    emoji.hidden = false
  }

  document.getElementById('temperatura').textContent = `${datos.actual.temperatura} °C`
  document.getElementById('sensacion').textContent = `${datos.actual.sensacion} °C`
  document.getElementById('condicionCielo').textContent = clima.descripcion
  document.getElementById('viento').textContent = `${datos.actual.viento} km/h`
  document.getElementById('humedad').textContent = `${datos.actual.humedad} %`
}

export function renderPronostico(datos) {
  const contenedor = document.getElementById('pronostico')
  contenedor.innerHTML = ''

  datos.pronostico.forEach((dia) => {
    const clima = traducirClima(dia.codigoClima)
    const tarjeta = document.createElement('div')
    tarjeta.className = 'diaPronostico'

    const nombreDia = document.createElement('span')
    nombreDia.textContent = dia.diaSemana

    const emojiDia = document.createElement('span')
    emojiDia.className = 'emojiDia'
    emojiDia.textContent = clima.emoji

    const maxMin = document.createElement('span')
    maxMin.className = 'maxMin'
    maxMin.textContent = `Máx ${dia.maxima} °C · Mín ${dia.minima} °C`

    tarjeta.append(nombreDia, emojiDia, maxMin)
    contenedor.appendChild(tarjeta)
  })
}

// Para pruebas desde la consola del navegador
window.traducirClima = traducirClima
window.formatearClima = formatearClima
window.renderClimaActual = renderClimaActual
window.renderPronostico = renderPronostico
