import { guardarPlaylists } from './storage.js';

let estado = {
  terminoBusqueda: '',
  resultadosBusqueda: [],
  estadoBusqueda: 'idle', // 'idle' | 'cargando' | 'error' | 'vacio' | 'ok'
  ultimoTerminoBuscado: '',
  playlists: [],
  playlistSeleccionadaId: null,
  mostrarFormularioPlaylist: false,
  errorFormularioPlaylist: null,
  popoverAgregarAbiertoParaId: null,
  toast: null, // { texto: string } | null
  modalConfirmacion: null, // { tipo: 'cancion' | 'playlist', playlistId, itemId?, nombre } | null
  criterioOrdenPlaylist: 'antiguas', // 'antiguas' | 'recientes' | 'titulo' | 'artista'
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
    criterioOrdenPlaylist: 'antiguas',
  };

  guardarPlaylists(estado.playlists); // ← nuevo

  return nuevaPlaylist;
}

export function setPlaylistSeleccionada(id) {
  estado = { ...estado, playlistSeleccionadaId: id, criterioOrdenPlaylist: 'antiguas' };
}

// --- HU-04: agregar canción a playlist ---

export function togglePopoverAgregar(cancionId) {
  const yaAbierto = estado.popoverAgregarAbiertoParaId === cancionId;
  estado = { ...estado, popoverAgregarAbiertoParaId: yaAbierto ? null : cancionId };
}

export function cerrarPopoverAgregar() {
  estado = { ...estado, popoverAgregarAbiertoParaId: null };
}

export function existeCancionEnPlaylist(playlistId, cancionId) {
  const playlist = estado.playlists.find((p) => p.id === playlistId);
  if (!playlist) return false;
  return playlist.canciones.some((item) => item.cancion.id === cancionId);
}

export function agregarCancionAPlaylist(playlistId, cancion) {
  if (existeCancionEnPlaylist(playlistId, cancion.id)) {
    return { ok: false, motivo: 'duplicada' };
  }

  const playlist = estado.playlists.find((p) => p.id === playlistId);
  if (!playlist) return { ok: false, motivo: 'no-existe' };

  const nuevoItem = {
    id: crypto.randomUUID(),
    cancion,
    fechaAgregada: new Date(),
  };

  estado = {
    ...estado,
    playlists: estado.playlists.map((p) =>
      p.id === playlistId ? { ...p, canciones: [...p.canciones, nuevoItem] } : p
    ),
    popoverAgregarAbiertoParaId: null,
    toast: { texto: `Agregada a ${playlist.nombre}` },
  };

  guardarPlaylists(estado.playlists); // ← nuevo

  return { ok: true };
}

export function setToast(texto) {
  estado = { ...estado, toast: { texto } };
}

export function limpiarToast() {
  estado = { ...estado, toast: null };
}

// --- HU-06: confirmación y borrado ---

export function abrirModalConfirmacion(datos) {
  estado = { ...estado, modalConfirmacion: datos };
}

export function cerrarModalConfirmacion() {
  estado = { ...estado, modalConfirmacion: null };
}

export function quitarCancionDePlaylist(playlistId, itemId) {
  estado = {
    ...estado,
    playlists: estado.playlists.map((p) =>
      p.id === playlistId
        ? { ...p, canciones: p.canciones.filter((item) => item.id !== itemId) }
        : p
    ),
    modalConfirmacion: null,
  };

  guardarPlaylists(estado.playlists); // ← nuevo
}

export function eliminarPlaylist(playlistId) {
  const eraSeleccionada = estado.playlistSeleccionadaId === playlistId;

  estado = {
    ...estado,
    playlists: estado.playlists.filter((p) => p.id !== playlistId),
    playlistSeleccionadaId: eraSeleccionada ? null : estado.playlistSeleccionadaId,
    modalConfirmacion: null,
  };

  guardarPlaylists(estado.playlists); // ← nuevo
}

// --- HU-09: orden de canciones dentro de una playlist ---

export function setCriterioOrdenPlaylist(criterio) {
  estado = { ...estado, criterioOrdenPlaylist: criterio };
}

// --- HU-10
export function cargarPlaylistsEnEstado(playlists) {
  estado = { ...estado, playlists };
}