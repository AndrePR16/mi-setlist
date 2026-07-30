import { buscarCanciones } from './api.js';
import {
  getEstado,
  setTerminoBusqueda,
  setResultadosBusqueda,
  setEstadoBusqueda,
  setUltimoTerminoBuscado,
  toggleFormularioPlaylist,
  setErrorFormularioPlaylist,
  existeNombrePlaylist,
  crearPlaylist,
  setPlaylistSeleccionada,
  togglePopoverAgregar,
  agregarCancionAPlaylist,
  setToast,
  limpiarToast,
} from './state.js';
import {
  renderResultados,
  renderEstadoBusqueda,
  renderFormularioPlaylist,
  renderListaPlaylists,
  renderDetallePlaylist,
  renderToast,
} from './ui.js';

let idTimeoutToast = null;

async function ejecutarBusqueda(termino) {
  const { estadoBusqueda } = getEstado();
  if (estadoBusqueda === 'cargando') {
    return; // ignoramos nuevas búsquedas mientras haya una en curso
  }

  setTerminoBusqueda(termino);
  setUltimoTerminoBuscado(termino);
  setEstadoBusqueda('cargando');
  setResultadosBusqueda([]);
  renderResultados();
  renderEstadoBusqueda();

  try {
    const resultados = await buscarCanciones(termino);
    setResultadosBusqueda(resultados);
    setEstadoBusqueda(resultados.length === 0 ? 'vacio' : 'ok');
  } catch (error) {
    console.error('Error al buscar canciones:', error);
    setResultadosBusqueda([]);
    setEstadoBusqueda('error');
  }

  renderResultados();
  renderEstadoBusqueda();
}

function manejarSubmitBusqueda(evento) {
  evento.preventDefault();
  const input = document.getElementById('input-busqueda');
  const termino = input.value.trim();

  if (termino === '') {
    return; // criterio de HU-01: campo vacío no dispara búsqueda
  }

  ejecutarBusqueda(termino);
}

function manejarClickEstadoBusqueda(evento) {
  const boton = evento.target.closest('[data-action="reintentar"]');
  if (!boton) return;

  const { ultimoTerminoBuscado } = getEstado();
  ejecutarBusqueda(ultimoTerminoBuscado);
}

function manejarClickNuevaPlaylist() {
  toggleFormularioPlaylist();
  renderFormularioPlaylist();
}

function manejarSubmitPlaylist(evento) {
  evento.preventDefault();

  const input = document.getElementById('input-nombre-playlist');
  const nombre = input.value.trim();

  if (nombre === '') {
    setErrorFormularioPlaylist('Ingresá un nombre para la playlist.');
    renderFormularioPlaylist();
    return;
  }

  if (existeNombrePlaylist(nombre)) {
    setErrorFormularioPlaylist('Ya existe una playlist con ese nombre.');
    renderFormularioPlaylist();
    return;
  }

  crearPlaylist(nombre);
  renderFormularioPlaylist();
  renderListaPlaylists();
  renderDetallePlaylist();
}

function manejarClickListaPlaylists(evento) {
  const boton = evento.target.closest('[data-id]');
  if (!boton) return;

  setPlaylistSeleccionada(boton.dataset.id);
  renderListaPlaylists();
  renderDetallePlaylist();
}

function programarOcultarToast() {
  clearTimeout(idTimeoutToast);
  idTimeoutToast = setTimeout(() => {
    limpiarToast();
    renderToast();
  }, 2500);
}

function manejarClickResultados(evento) {
  const botonToggle = evento.target.closest('[data-action="toggle-agregar"]');
  if (botonToggle) {
    togglePopoverAgregar(botonToggle.dataset.cancionId);
    renderResultados();
    return;
  }

  const botonAgregar = evento.target.closest('[data-action="agregar-a-playlist"]');
  if (botonAgregar) {
    const { playlistId, cancionId } = botonAgregar.dataset;
    const cancion = getEstado().resultadosBusqueda.find((c) => c.id === cancionId);
    if (!cancion) return;

    const resultado = agregarCancionAPlaylist(playlistId, cancion);
    if (!resultado.ok && resultado.motivo === 'duplicada') {
      setToast('Esa canción ya está en esa playlist.');
    }

    renderResultados();
    renderToast();
    renderListaPlaylists();
    renderDetallePlaylist();
    programarOcultarToast();
  }
}

function manejarSubmitResultados(evento) {
  const form = evento.target.closest('[data-action="crear-y-agregar"]');
  if (!form) return;
  evento.preventDefault();

  const input = form.querySelector('input[name="nombreNuevaPlaylist"]');
  const nombre = input.value.trim();
  const cancion = getEstado().resultadosBusqueda.find((c) => c.id === form.dataset.cancionId);
  if (!cancion || nombre === '') return;

  if (existeNombrePlaylist(nombre)) {
    setToast('Ya existe una playlist con ese nombre.');
    renderToast();
    programarOcultarToast();
    return;
  }

  const nuevaPlaylist = crearPlaylist(nombre);
  agregarCancionAPlaylist(nuevaPlaylist.id, cancion);

  renderResultados();
  renderToast();
  renderListaPlaylists();
  renderDetallePlaylist();
  renderFormularioPlaylist();
  programarOcultarToast();
}

function init() {
  const form = document.getElementById('form-busqueda');
  form.addEventListener('submit', manejarSubmitBusqueda);

  const contenedorEstado = document.getElementById('estado-busqueda');
  contenedorEstado.addEventListener('click', manejarClickEstadoBusqueda);

  const botonNuevaPlaylist = document.getElementById('boton-nueva-playlist');
  botonNuevaPlaylist.addEventListener('click', manejarClickNuevaPlaylist);

  const contenedorFormularioPlaylist = document.getElementById('formulario-playlist-contenedor');
  contenedorFormularioPlaylist.addEventListener('submit', manejarSubmitPlaylist);

  const listaPlaylists = document.getElementById('lista-playlists');
  listaPlaylists.addEventListener('click', manejarClickListaPlaylists);

  const contenedorResultados = document.getElementById('resultados');
  contenedorResultados.addEventListener('click', manejarClickResultados);
  contenedorResultados.addEventListener('submit', manejarSubmitResultados);

  renderListaPlaylists(); // pinta el estado vacío inicial ("Todavía no creaste ninguna playlist")
}

document.addEventListener('DOMContentLoaded', init);