let estado = {
  terminoBusqueda: '',
  resultadosBusqueda: [],
  estadoBusqueda: 'idle', // 'idle' | 'cargando' | 'error' | 'vacio' | 'ok'
  ultimoTerminoBuscado: '',
};

export function getEstado() {
  return estado;
}

export function setTerminoBusqueda(termino) {
  estado = { ...estado, terminoBusqueda: termino };
}

export function setResultadosBusqueda(resultados) {
  estado = { ...estado, resultadosBusqueda: resultados };
}

export function setEstadoBusqueda(nuevoEstadoBusqueda) {
  estado = { ...estado, estadoBusqueda: nuevoEstadoBusqueda };
}

export function setUltimoTerminoBuscado(termino) {
  estado = { ...estado, ultimoTerminoBuscado: termino };
}