let estado = {
  terminoBusqueda: '',
  resultadosBusqueda: [],
  estadoBusqueda: 'idle', // 'idle' | 'cargando' | 'error' | 'vacio' | 'ok'
  ultimoTerminoBuscado: '',
  playlists: [],
  playlistSeleccionadaId: null,
  mostrarFormularioPlaylist: false,
  errorFormularioPlaylist: null,
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

export function toggleFormularioPlaylist() {
  estado = {
    ...estado,
    mostrarFormularioPlaylist: !estado.mostrarFormularioPlaylist,
    errorFormularioPlaylist: null,
  };
}

export function setErrorFormularioPlaylist(mensaje) {
  estado = { ...estado, errorFormularioPlaylist: mensaje };
}

export function existeNombrePlaylist(nombre) {
  const nombreNormalizado = nombre.trim().toLowerCase();
  return estado.playlists.some(
    (playlist) => playlist.nombre.trim().toLowerCase() === nombreNormalizado
  );
}

export function crearPlaylist(nombre) {
  const nuevaPlaylist = {
    id: crypto.randomUUID(),
    nombre: nombre.trim(),
    canciones: [],
  };

  estado = {
    ...estado,
    playlists: [...estado.playlists, nuevaPlaylist],
    playlistSeleccionadaId: nuevaPlaylist.id,
    mostrarFormularioPlaylist: false,
    errorFormularioPlaylist: null,
  };

  return nuevaPlaylist;
}

export function setPlaylistSeleccionada(id) {
  estado = { ...estado, playlistSeleccionadaId: id };
}