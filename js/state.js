let estado = {
  terminoBusqueda: '',
  resultadosBusqueda: [],
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