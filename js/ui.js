import { getEstado } from './state.js';

function escaparHTML(texto) {
  const div = document.createElement('div');
  div.textContent = texto;
  return div.innerHTML;
}

export function renderResultados() {
  const contenedor = document.getElementById('resultados');
  const { resultadosBusqueda } = getEstado();

  if (resultadosBusqueda.length === 0) {
    contenedor.innerHTML = '';
    return;
  }

  contenedor.innerHTML = resultadosBusqueda.map((cancion) => `
    <article class="tarjeta-cancion" data-id="${cancion.id}">
      <img
        class="tarjeta-caratula"
        src="${cancion.caratula}"
        alt="Carátula de ${escaparHTML(cancion.titulo)}"
      />
      <div class="tarjeta-info">
        <p class="tarjeta-titulo">${escaparHTML(cancion.titulo)}</p>
        <p class="tarjeta-artista">${escaparHTML(cancion.artista)}</p>
        <p class="tarjeta-duracion">${cancion.duracionLegible()}</p>
      </div>
    </article>
  `).join('');
}