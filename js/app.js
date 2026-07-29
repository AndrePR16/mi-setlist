import { buscarCanciones } from './api.js';
import {
  getEstado,
  setTerminoBusqueda,
  setResultadosBusqueda,
  setEstadoBusqueda,
  setUltimoTerminoBuscado,
} from './state.js';
import { renderResultados, renderEstadoBusqueda } from './ui.js';

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

function init() {
  const form = document.getElementById('form-busqueda');
  form.addEventListener('submit', manejarSubmitBusqueda);

  const contenedorEstado = document.getElementById('estado-busqueda');
  contenedorEstado.addEventListener('click', manejarClickEstadoBusqueda);
}

document.addEventListener('DOMContentLoaded', init);