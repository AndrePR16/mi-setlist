import { buscarCanciones } from './api.js';
import { setTerminoBusqueda, setResultadosBusqueda } from './state.js';
import { renderResultados } from './ui.js';

async function manejarBusqueda(evento) {
  evento.preventDefault();

  const input = document.getElementById('input-busqueda');
  const termino = input.value.trim();

  if (termino === '') {
    return; // criterio de aceptación: campo vacío no dispara búsqueda
  }

  setTerminoBusqueda(termino);

  try {
    const resultados = await buscarCanciones(termino);
    setResultadosBusqueda(resultados);
  } catch (error) {
    console.error('Error al buscar canciones:', error);
    setResultadosBusqueda([]);
    // El manejo visual de este error (mensaje en pantalla) es HU-02, todavía no implementado.
  }

  renderResultados();
}

function init() {
  const form = document.getElementById('form-busqueda');
  form.addEventListener('submit', manejarBusqueda);
}

document.addEventListener('DOMContentLoaded', init);