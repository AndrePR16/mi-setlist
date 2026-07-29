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
} from './state.js';
import {
  renderResultados,
  renderEstadoBusqueda,
  renderFormularioPlaylist,
  renderListaPlaylists,
  renderDetallePlaylist,
} from './ui.js';

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

  renderListaPlaylists(); // pinta el estado vacío inicial ("Todavía no creaste ninguna playlist")
}

document.addEventListener('DOMContentLoaded', init);