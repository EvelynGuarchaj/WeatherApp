const TIEMPO_LIMITE_MS = 8000
const URL_GEOCODING = 'https://geocoding-api.open-meteo.com/v1/search'
const URL_PRONOSTICO = 'https://api.open-meteo.com/v1/forecast'

// codigo: 'sinConexion' | 'errorServidor'
export class ErrorDeAplicacion extends Error {
  constructor(codigo) {
    super(codigo)
    this.codigo = codigo
  }
}

async function obtenerJson(url) {
  const controlador = new AbortController()
  const reloj = setTimeout(() => controlador.abort(), TIEMPO_LIMITE_MS)

  try {
    let respuesta
    try {
      respuesta = await fetch(url, { signal: controlador.signal })
    } catch {
      // no pudo conectar o se agoto el tiempo
      throw new ErrorDeAplicacion('sinConexion')
    }

    if (!respuesta.ok) {
      // hubo conexion y el servidor contesto con error
      throw new ErrorDeAplicacion('errorServidor')
    }

    try {
      return await respuesta.json()
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new ErrorDeAplicacion('sinConexion')
      }
      // la respuesta llego con JSON invalido
      throw new ErrorDeAplicacion('errorServidor')
    }
  } finally {
    clearTimeout(reloj)
  }
}

export async function buscarCiudad(nombre) {
  const url = `${URL_GEOCODING}?name=${encodeURIComponent(nombre)}&count=10&language=es&format=json`
  const datos = await obtenerJson(url)
  if (!datos.results || datos.results.length === 0) {
    return []
  }
  return datos.results
}

export async function obtenerClima(latitude, longitude) {
  const url = `${URL_PRONOSTICO}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=3&temperature_unit=celsius&wind_speed_unit=kmh`
  return obtenerJson(url)
}

// Para pruebas desde la consola del navegador
window.buscarCiudad = buscarCiudad
window.obtenerClima = obtenerClima
