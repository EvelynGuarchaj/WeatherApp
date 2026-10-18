import { estado, mostrar, ocultarLista } from './estados.js'
import { buscarCiudad, obtenerClima, ErrorDeAplicacion } from './api.js'
import { formatearClima, renderClimaActual, renderPronostico } from './clima.js'

// codigo del error (api.js) -> nombre de pantalla (estados.js)
const pantallasDeError = {
  sinConexion: 'errorSinConexion',
  errorServidor: 'errorServidor'
}

function manejarError(error) {
  if (error instanceof ErrorDeAplicacion) {
    mostrar(pantallasDeError[error.codigo])
    return
  }
  console.error(error)
  mostrar('errorServidor')
}

async function cargarClima(ciudad, pantallaFinal) {
  estado.ultimaAccion = () => cargarClima(ciudad, pantallaFinal)
  mostrar('cargando')
  try {
    const datosApi = await obtenerClima(ciudad.latitude, ciudad.longitude)
    const datos = formatearClima(datosApi)
    renderClimaActual(datos, ciudad)
    renderPronostico(datos)
    estado.ciudadActual = ciudad
    mostrar(pantallaFinal)
  } catch (error) {
    manejarError(error)
  }
}

async function cargarCiudadInicial() {
  estado.ultimaAccion = cargarCiudadInicial
  mostrar('cargando')
  try {
    const ciudades = await buscarCiudad('Totonicapán')
    if (ciudades.length === 0) {
      mostrar('errorNoExiste')
      return
    }
    await cargarClima(ciudades[0], 'principal')
  } catch (error) {
    manejarError(error)
  }
}

async function buscarPorNombre(consulta) {
  estado.ultimaAccion = () => buscarPorNombre(consulta)
  mostrar('cargando')
  try {
    const ciudades = await buscarCiudad(consulta)
    if (ciudades.length === 0) {
      mostrar('errorNoExiste')
      return
    }
    if (ciudades.length > 1) {
      renderizarListaCiudades(ciudades)
      mostrar('listaCiudades')
      return
    }
    await cargarClima(ciudades[0], 'principalCiudadEncontrada')
  } catch (error) {
    manejarError(error)
  }
}

function buscarPorCampo() {
  const consulta = document.getElementById('campoBusqueda').value.trim()
  if (!consulta) {
    return
  }
  buscarPorNombre(consulta)
}

function renderizarListaCiudades(ciudades) {
  const contenedor = document.getElementById('listaCiudades')
  contenedor.innerHTML = ''
  ciudades.forEach((ciudad) => {
    const fila = document.createElement('button')
    fila.type = 'button'
    fila.className = 'filaCiudad'

    const nombre = document.createElement('span')
    nombre.textContent = ciudad.name

    const region = document.createElement('span')
    region.className = 'regionCiudad'
    region.textContent = [ciudad.admin1, ciudad.country].filter(Boolean).join(', ')

    fila.append(nombre, region)
    fila.addEventListener('click', () => elegirCiudad(ciudad))
    contenedor.appendChild(fila)
  })
}

async function elegirCiudad(ciudad) {
  ocultarLista()
  await cargarClima(ciudad, 'principalCiudadEncontrada')
}

document.querySelectorAll('.botonReintentar').forEach((boton) => {
  boton.addEventListener('click', () => {
    if (estado.ultimaAccion) {
      estado.ultimaAccion()
    }
  })
})

document.getElementById('botonBuscar').addEventListener('click', buscarPorCampo)

document.getElementById('campoBusqueda').addEventListener('keydown', (evento) => {
  if (evento.key === 'Enter') {
    evento.preventDefault()
    buscarPorCampo()
  }
})

cargarCiudadInicial()
