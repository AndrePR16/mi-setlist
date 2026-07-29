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

export function renderEstadoBusqueda() {
  const contenedor = document.getElementById('estado-busqueda');
  const { estadoBusqueda } = getEstado();

  const boton = document.getElementById('boton-buscar');
  boton.disabled = estadoBusqueda === 'cargando';

  switch (estadoBusqueda) {
    case 'cargando':
      contenedor.innerHTML = `
        <p class="mensaje-estado mensaje-cargando" role="status">
          <span class="spinner" aria-hidden="true"></span>
          Buscando...
        </p>
      `;
      break;

    case 'error':
      contenedor.innerHTML = `
        <p class="mensaje-estado mensaje-error" role="alert">
          No pudimos completar la búsqueda. Puede que haya un problema de conexión.
          <button type="button" data-action="reintentar" class="boton-reintentar">
            Reintentar
          </button>
        </p>
      `;
      break;

    case 'vacio':
      contenedor.innerHTML = `
        <p class="mensaje-estado mensaje-vacio" role="status">
          No encontramos canciones con ese nombre. Probá con otro término.
        </p>
      `;
      break;

    case 'idle':
    case 'ok':
    default:
      contenedor.innerHTML = '';
      break;
  }
}