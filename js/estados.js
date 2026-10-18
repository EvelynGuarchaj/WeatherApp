// Única fuente de verdad de la pantalla visible
export const estado = {
  pantalla: 'principal', // 'principal' | 'principalCiudadEncontrada' | 'cargando'
    // | 'errorNoExiste' | 'errorSinConexion' | 'errorServidor' | 'listaCiudades'
  ultimaAccion: null,   // función sin argumentos; la dispara el botón Reintentar
  ciudadActual: null    // { name, admin1, country } de la última pantalla principal
}

// principal y principalCiudadEncontrada comparten el mismo panel
const paneles = {
  principal: 'seccion-principal',
  principalCiudadEncontrada: 'seccion-principal',
  cargando: 'seccion-cargando',
  errorNoExiste: 'seccion-errorNoExiste',
  errorSinConexion: 'seccion-errorSinConexion',
  errorServidor: 'seccion-errorServidor'
}

export function mostrar(pantalla) {
  if (pantalla === 'listaCiudades') {
    document.getElementById('listaCiudades').hidden = false
    estado.pantalla = pantalla
    return
  }

  const idPanel = paneles[pantalla]
  if (!idPanel) {
    console.error('Pantalla desconocida:', pantalla)
    return
  }

  document.querySelectorAll('.pantalla').forEach((seccion) => {
    seccion.hidden = true
  })
  document.getElementById(idPanel).hidden = false
  document.getElementById('listaCiudades').hidden = true
  estado.pantalla = pantalla
}

export function ocultarLista() {
  document.getElementById('listaCiudades').hidden = true
  if (estado.pantalla === 'listaCiudades') {
    estado.pantalla = 'principal'
  }
}

// Para pruebas desde la consola del navegador
window.mostrar = mostrar
window.estado = estado
