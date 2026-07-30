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
        <button type="button" class="boton-agregar" data-action="toggle-agregar" data-cancion-id="${cancion.id}">Agregar</button>
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

function formatearFecha(fecha) {
  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const anio = fecha.getFullYear();
  const horas = String(fecha.getHours()).padStart(2, '0');
  const minutos = String(fecha.getMinutes()).padStart(2, '0');
  return `${dia}/${mes}/${anio} ${horas}:${minutos}`;
}

function formatearDuracionTotal(duracionMsTotal) {
  const totalMinutos = Math.floor(duracionMsTotal / 1000 / 60);
  const horas = Math.floor(totalMinutos / 60);
  const minutos = totalMinutos % 60;

  if (horas === 0) {
    return `${minutos} min`;
  }

  return `${horas} h ${minutos} min`;
}

function encontrarMasFrecuente(valores) {
  const conteos = new Map();

  for (const valor of valores) {
    conteos.set(valor, (conteos.get(valor) || 0) + 1);
  }

  let valorGanador = null;
  let maxConteo = 0;

  for (const valor of valores) {
    const conteo = conteos.get(valor);
    if (conteo > maxConteo) {
      maxConteo = conteo;
      valorGanador = valor;
    }
  }

  return valorGanador;
}

function renderEstadisticasPlaylist(playlist) {
  const cantidadCanciones = playlist.canciones.length;

  if (cantidadCanciones === 0) {
    return `
      <div class="estadisticas-playlist">
        <p class="mensaje-estado mensaje-vacio">Sin datos todavía.</p>
      </div>
    `;
  }

  const generos = playlist.canciones
    .map((item) => item.cancion.genero)
    .filter((genero) => genero !== 'Género desconocido');

  const artistas = playlist.canciones.map((item) => item.cancion.artista);

  const generoMasFrecuente = encontrarMasFrecuente(generos) || 'Sin datos';
  const artistaMasFrecuente = encontrarMasFrecuente(artistas);

  return `
    <div class="estadisticas-playlist">
      <span class="estadistica-item">Canciones: <strong>${cantidadCanciones}</strong></span>
      <span class="estadistica-item">Género: <strong>${escaparHTML(generoMasFrecuente)}</strong></span>
      <span class="estadistica-item">Artista: <strong>${escaparHTML(artistaMasFrecuente)}</strong></span>
    </div>
  `;
}

export function renderDetallePlaylist() {
  const contenedor = document.getElementById('detalle-playlist');
  const { playlists, playlistSeleccionadaId } = getEstado();
  const playlist = playlists.find((p) => p.id === playlistSeleccionadaId);

  if (!playlist) {
    contenedor.innerHTML = '';
    return;
  }

  const duracionTotalMs = playlist.canciones.reduce(
    (acumulado, item) => acumulado + item.cancion.duracionMs,
    0
  );

  const contenidoCanciones = playlist.canciones.length === 0
    ? `<p class="mensaje-estado mensaje-vacio">Todavía no agregaste canciones.</p>`
    : `<ul class="lista-canciones-playlist">
        ${playlist.canciones.map((item) => `
          <li class="item-cancion-playlist">
            <img class="item-cancion-caratula" src="${item.cancion.caratula}" alt="Carátula de ${escaparHTML(item.cancion.titulo)}" />
            <div class="item-cancion-info">
              <p class="item-cancion-titulo">${escaparHTML(item.cancion.titulo)}</p>
              <p class="item-cancion-artista">${escaparHTML(item.cancion.artista)}</p>
            </div>
            <span class="item-cancion-duracion">${item.cancion.duracionLegible()}</span>
            <span class="item-cancion-fecha">Agregada: ${formatearFecha(item.fechaAgregada)}</span>
            <button
              type="button"
              class="boton-quitar-cancion"
              data-action="quitar-cancion"
              data-playlist-id="${playlist.id}"
              data-item-id="${item.id}"
              data-titulo="${escaparHTML(item.cancion.titulo)}"
              aria-label="Quitar de la playlist"
            >×</button>
          </li>
        `).join('')}
      </ul>`;

  contenedor.innerHTML = `
    <div class="detalle-playlist-header">
      <div class="detalle-playlist-titulo">
        <h2>${escaparHTML(playlist.nombre)}</h2>
        <span class="detalle-playlist-duracion">${formatearDuracionTotal(duracionTotalMs)}</span>
      </div>
      <button
        type="button"
        class="boton-eliminar-playlist"
        data-action="eliminar-playlist"
        data-playlist-id="${playlist.id}"
        data-nombre="${escaparHTML(playlist.nombre)}"
      >Eliminar playlist</button>
    </div>
    ${renderEstadisticasPlaylist(playlist)}
    ${contenidoCanciones}
  `;
}

  // Vista mínima para HU-03. El listado real de canciones llega en HU-05.
  //contenedor.innerHTML = `
    //<h2>${escaparHTML(playlist.nombre)}</h2>
    //${playlist.canciones.length === 0
      //? `<p class="mensaje-estado mensaje-vacio">Todavía no agregaste canciones.</p>`
     // : ''
    //}
  //`;
//}

export function renderModalConfirmacion() {
  const contenedor = document.getElementById('modal-confirmacion');
  const { modalConfirmacion } = getEstado();

  if (!modalConfirmacion) {
    contenedor.innerHTML = '';
    contenedor.classList.remove('modal-overlay--visible');
    return;
  }

  const mensaje = modalConfirmacion.tipo === 'playlist'
    ? `¿Eliminar la playlist "${escaparHTML(modalConfirmacion.nombre)}"? Esta acción no se puede deshacer.`
    : `¿Quitar "${escaparHTML(modalConfirmacion.nombre)}" de la playlist?`;

  contenedor.classList.add('modal-overlay--visible');
  contenedor.innerHTML = `
    <div class="modal-dialogo" role="dialog" aria-modal="true">
      <p class="modal-mensaje">${mensaje}</p>
      <div class="modal-acciones">
        <button type="button" class="modal-boton-cancelar" data-action="cancelar-modal">Cancelar</button>
        <button type="button" class="modal-boton-confirmar" data-action="confirmar-modal">Confirmar</button>
      </div>
    </div>
  `;
}