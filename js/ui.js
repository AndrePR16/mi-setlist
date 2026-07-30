import { getEstado } from './state.js';

function escaparHTML(texto) {
  const div = document.createElement('div');
  div.textContent = texto;
  return div.innerHTML;
}

function renderPopoverAgregar(cancion) {
  const { playlists, popoverAgregarAbiertoParaId } = getEstado();
  if (popoverAgregarAbiertoParaId !== cancion.id) return '';

  const listaPlaylists = playlists.length === 0
    ? `<p class="popover-vacio">Todavía no tenés playlists.</p>`
    : playlists.map((playlist) => `
        <button
          type="button"
          class="popover-item-playlist"
          data-action="agregar-a-playlist"
          data-playlist-id="${playlist.id}"
          data-cancion-id="${cancion.id}"
        >
          ${escaparHTML(playlist.nombre)}
        </button>
      `).join('');

  return `
    <div class="popover-agregar">
      ${listaPlaylists}
      <form class="popover-form-nueva-playlist" data-action="crear-y-agregar" data-cancion-id="${cancion.id}">
        <input type="text" name="nombreNuevaPlaylist" placeholder="+ Nueva playlist" autocomplete="off" />
        <button type="submit">Crear y agregar</button>
      </form>
    </div>
  `;
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
      <img class="tarjeta-caratula" src="${cancion.caratula}" alt="Carátula de ${escaparHTML(cancion.titulo)}" />
      <div class="tarjeta-info">
        <p class="tarjeta-titulo">${escaparHTML(cancion.titulo)}</p>
        <p class="tarjeta-artista">${escaparHTML(cancion.artista)}</p>
        <p class="tarjeta-duracion">${cancion.duracionLegible()}</p>
      </div>
      <div class="tarjeta-acciones">
        <button type="button" class="boton-agregar" data-action="toggle-agregar" data-cancion-id="${cancion.id}" aria-label="Agregar a playlist">+</button>
        ${renderPopoverAgregar(cancion)}
      </div>
    </article>
  `).join('');
}

export function renderToast() {
  const contenedor = document.getElementById('toast');
  const { toast } = getEstado();

  if (!toast) {
    contenedor.textContent = '';
    contenedor.classList.remove('toast--visible');
    return;
  }

  contenedor.textContent = toast.texto;
  contenedor.classList.add('toast--visible');
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

export function renderFormularioPlaylist() {
  const contenedor = document.getElementById('formulario-playlist-contenedor');
  const { mostrarFormularioPlaylist, errorFormularioPlaylist } = getEstado();

  if (!mostrarFormularioPlaylist) {
    contenedor.innerHTML = '';
    return;
  }

  contenedor.innerHTML = `
    <form id="form-playlist" class="form-playlist">
      <input
        type="text"
        id="input-nombre-playlist"
        name="nombrePlaylist"
        placeholder="Nombre de la playlist (ej. Road trip)"
        autocomplete="off"
      />
      <button type="submit">Crear</button>
      ${errorFormularioPlaylist
        ? `<p class="mensaje-estado mensaje-error" role="alert">${escaparHTML(errorFormularioPlaylist)}</p>`
        : ''
      }
    </form>
  `;

  document.getElementById('input-nombre-playlist').focus();
}

export function renderListaPlaylists() {
  const contenedor = document.getElementById('lista-playlists');
  const { playlists, playlistSeleccionadaId } = getEstado();

  if (playlists.length === 0) {
    contenedor.innerHTML = `<p class="mensaje-estado mensaje-vacio">Todavía no creaste ninguna playlist.</p>`;
    return;
  }

  contenedor.innerHTML = playlists.map((playlist) => `
    <button
      type="button"
      class="item-playlist ${playlist.id === playlistSeleccionadaId ? 'item-playlist--activa' : ''}"
      data-id="${playlist.id}"
    >
      ${escaparHTML(playlist.nombre)}
    </button>
  `).join('');
}

export function renderDetallePlaylist() {
  const contenedor = document.getElementById('detalle-playlist');
  const { playlists, playlistSeleccionadaId } = getEstado();
  const playlist = playlists.find((p) => p.id === playlistSeleccionadaId);

  if (!playlist) {
    contenedor.innerHTML = '';
    return;
  }

  // Vista mínima para HU-03. El listado real de canciones llega en HU-05.
  contenedor.innerHTML = `
    <h2>${escaparHTML(playlist.nombre)}</h2>
    ${playlist.canciones.length === 0
      ? `<p class="mensaje-estado mensaje-vacio">Todavía no agregaste canciones.</p>`
      : ''
    }
  `;
}