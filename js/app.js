import { cargarPlaylists, limpiarStorage } from './storage.js';
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
    cerrarPopoverAgregar,
    agregarCancionAPlaylist,
    setToast,
    limpiarToast,
    abrirModalConfirmacion,
    cerrarModalConfirmacion,
    quitarCancionDePlaylist,
    eliminarPlaylist,
    setCriterioOrdenPlaylist,
    cargarPlaylistsEnEstado,
    toggleFavorita,
    toggleSoloFavoritas,
    reproducirCola,
    pausarReproductor,
    reanudarReproductor,
    avanzarReproductor,
} from './state.js';
import {
    renderResultados,
    renderEstadoBusqueda,
    renderFormularioPlaylist,
    renderListaPlaylists,
    renderDetallePlaylist,
    renderToast,
    renderModalConfirmacion,
    renderPantallaRecuperacion,
    renderReproductor,
    ordenarCanciones,   // ← ahora sí, en el import correcto
} from './ui.js';
let ultimaCancionId = null;

function sincronizarAudioElemento() {
    const { reproductor } = getEstado();
    const audio = document.getElementById('audio-elemento');
    const cancionActual = reproductor.cola[reproductor.indice] || null;

    if (!cancionActual) {
        audio.pause();
        audio.removeAttribute('src');
        ultimaCancionId = null;
        renderReproductor();
        return;
    }

    if (!cancionActual.previewUrl) {
        setToast('Esta canción no tiene preview disponible.');
        renderToast();
        programarOcultarToast();
        avanzarReproductor(); // salta a la siguiente en vez de trabarse
        sincronizarAudioElemento();
        return;
    }

    if (cancionActual.id !== ultimaCancionId) {
        audio.src = cancionActual.previewUrl;
        ultimaCancionId = cancionActual.id;
    }

    if (reproductor.estaSonando) {
        audio.play().catch((error) => console.error('No se pudo reproducir:', error));
    } else {
        audio.pause();
    }

    renderReproductor();
}

function manejarFinCancion() {
    avanzarReproductor();
    sincronizarAudioElemento();
}

function manejarClickPlayPausa() {
    const { reproductor } = getEstado();
    if (reproductor.cola.length === 0) return;

    if (reproductor.estaSonando) {
        pausarReproductor();
    } else {
        reanudarReproductor();
    }
    sincronizarAudioElemento();
}

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
    const botonPlay = evento.target.closest('[data-action="reproducir-cancion"]');
    if (botonPlay) {
        const cancion = getEstado().resultadosBusqueda.find((c) => c.id === botonPlay.dataset.cancionId);
        if (!cancion) return;
        reproducirCola([cancion], 0);
        sincronizarAudioElemento();
        return;
    }

    const botonToggle = evento.target.closest('[data-action="toggle-agregar"]');
    if (botonToggle) {
        evento.stopPropagation(); // ← nuevo: evita que este clic llegue a document y se auto-cierre
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

function manejarClickDetallePlaylist(evento) {
    const botonReproducirTodo = evento.target.closest('[data-action="reproducir-playlist"]');
  if (botonReproducirTodo) {
    const { playlists, criterioOrdenPlaylist } = getEstado();
    const playlist = playlists.find((p) => p.id === botonReproducirTodo.dataset.playlistId);
    if (!playlist) return;

    const canciones = ordenarCanciones(playlist.canciones, criterioOrdenPlaylist)
      .map((item) => item.cancion);

    reproducirCola(canciones, 0);
    sincronizarAudioElemento();
    return;
  }

  const botonPlayItem = evento.target.closest('[data-action="reproducir-item"]');
  if (botonPlayItem) {
    const { playlists } = getEstado();
    const playlist = playlists.find((p) => p.id === botonPlayItem.dataset.playlistId);
    const item = playlist?.canciones.find((i) => i.id === botonPlayItem.dataset.itemId);
    if (!item) return;

    reproducirCola([item.cancion], 0);
    sincronizarAudioElemento();
    return;
  }

    const botonFavorita = evento.target.closest('[data-action="toggle-favorita"]');
    if (botonFavorita) {
        toggleFavorita(botonFavorita.dataset.playlistId, botonFavorita.dataset.itemId);
        renderDetallePlaylist();
        return;
    }

    const botonFiltroFavoritas = evento.target.closest('[data-action="toggle-solo-favoritas"]');
    if (botonFiltroFavoritas) {
        toggleSoloFavoritas();
        renderDetallePlaylist();
        return;
    }

    const botonOrden = evento.target.closest('[data-action="cambiar-orden"]');
    if (botonOrden) {
        setCriterioOrdenPlaylist(botonOrden.dataset.criterio);
        renderDetallePlaylist();
        return;
    }

    const botonEliminarPlaylist = evento.target.closest('[data-action="eliminar-playlist"]');
    if (botonEliminarPlaylist) {
        abrirModalConfirmacion({
            tipo: 'playlist',
            playlistId: botonEliminarPlaylist.dataset.playlistId,
            nombre: botonEliminarPlaylist.dataset.nombre,
        });
        renderModalConfirmacion();
        return;
    }

    const botonQuitarCancion = evento.target.closest('[data-action="quitar-cancion"]');
    if (botonQuitarCancion) {
        abrirModalConfirmacion({
            tipo: 'cancion',
            playlistId: botonQuitarCancion.dataset.playlistId,
            itemId: botonQuitarCancion.dataset.itemId,
            nombre: botonQuitarCancion.dataset.titulo,
        });
        renderModalConfirmacion();
    }
}

function ejecutarConfirmacionModal() {
    const { modalConfirmacion } = getEstado();
    if (!modalConfirmacion) return;

    if (modalConfirmacion.tipo === 'playlist') {
        eliminarPlaylist(modalConfirmacion.playlistId);
    } else {
        quitarCancionDePlaylist(modalConfirmacion.playlistId, modalConfirmacion.itemId);
    }

    renderModalConfirmacion();
    renderListaPlaylists();
    renderDetallePlaylist();
}

function manejarClickTogglePlaylists() {
  document.getElementById('panel-playlists').classList.toggle('panel-playlists--visible');
}

function manejarClickModal(evento) {
    if (evento.target.closest('[data-action="confirmar-modal"]')) {
        ejecutarConfirmacionModal();
        return;
    }

    if (evento.target.closest('[data-action="cancelar-modal"]')) {
        cerrarModalConfirmacion();
        renderModalConfirmacion();
        return;
    }

    // Clic directo sobre el overlay (fuera del diálogo) = cancelar
    if (evento.target.id === 'modal-confirmacion') {
        cerrarModalConfirmacion();
        renderModalConfirmacion();
    }
}

function manejarTeclaGlobal(evento) {
    if (evento.key !== 'Escape') return;

    const { modalConfirmacion, popoverAgregarAbiertoParaId } = getEstado();

    if (modalConfirmacion) {
        cerrarModalConfirmacion();
        renderModalConfirmacion();
        return;
    }

    if (popoverAgregarAbiertoParaId) {
        cerrarPopoverAgregar();
        renderResultados();
    }
}

function manejarClickDocumento(evento) {
    const { popoverAgregarAbiertoParaId } = getEstado();
    if (!popoverAgregarAbiertoParaId) return;

    // Si el clic fue dentro de .tarjeta-acciones (el botón "Agregar" o el popover mismo), no cerramos
    if (evento.target.closest('.tarjeta-acciones')) return;

    cerrarPopoverAgregar();
    renderResultados();
}

function manejarClickRecuperacion(evento) {
    const boton = evento.target.closest('#boton-empezar-de-cero');
    if (!boton) return;

    limpiarStorage();
    location.reload();
}

const CLAVE_TEMA = 'mi-setlist:tema';

function obtenerTemaInicial() {
    const guardado = localStorage.getItem(CLAVE_TEMA);
    if (guardado === 'oscuro' || guardado === 'claro') {
        return guardado; // el usuario ya eligió antes: su elección manda
    }
    const prefiereOscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefiereOscuro ? 'oscuro' : 'claro'; // primera visita: seguimos al sistema
}

function aplicarTema(tema) {
    document.body.classList.toggle('tema-oscuro', tema === 'oscuro');
    const toggle = document.getElementById('toggle-tema');
    if (toggle) toggle.checked = tema === 'oscuro';
}

function manejarCambioTema(evento) {
    const nuevoTema = evento.target.checked ? 'oscuro' : 'claro';
    localStorage.setItem(CLAVE_TEMA, nuevoTema);
    aplicarTema(nuevoTema);
}

function iniciarApp() {
    aplicarTema(obtenerTemaInicial()); // ← nuevo, primera línea

    const resultado = cargarPlaylists();

    if (!resultado.ok) {
        renderPantallaRecuperacion();
        document.body.classList.add('modo-recuperacion');
        document.getElementById('app').addEventListener('click', manejarClickRecuperacion);
        return;
    }

    cargarPlaylistsEnEstado(resultado.playlists);
    init();
}

function init() {
    const toggleTema = document.getElementById('toggle-tema');
    toggleTema.addEventListener('change', manejarCambioTema);
    // ← agregado: "function" + "{"
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

    const contenedorDetallePlaylist = document.getElementById('detalle-playlist');
    contenedorDetallePlaylist.addEventListener('click', manejarClickDetallePlaylist);

    const modal = document.getElementById('modal-confirmacion');
    modal.addEventListener('click', manejarClickModal);

    const audio = document.getElementById('audio-elemento');
    audio.addEventListener('ended', manejarFinCancion);

    const botonPlayPausa = document.getElementById('boton-play-pausa');
    botonPlayPausa.addEventListener('click', manejarClickPlayPausa);

    document.addEventListener('keydown', manejarTeclaGlobal);
    document.addEventListener('click', manejarClickDocumento);
    document.getElementById('boton-toggle-playlists').addEventListener('click', manejarClickTogglePlaylists);
    document.getElementById('boton-cerrar-playlists').addEventListener('click', manejarClickTogglePlaylists);

    renderListaPlaylists(); // pinta el estado vacío inicial ("Todavía no creaste ninguna playlist")
}

document.addEventListener('DOMContentLoaded', iniciarApp);