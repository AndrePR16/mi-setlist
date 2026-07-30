import { Cancion } from './models/Cancion.js';

const CLAVE_STORAGE = 'mi-setlist:playlists';

export function guardarPlaylists(playlists) {
  try {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(playlists));
  } catch (error) {
    console.error('No se pudo guardar en localStorage:', error);
  }
}

function rehidratarPlaylists(playlistsCrudas) {
  return playlistsCrudas.map((playlist) => ({
    ...playlist,
    canciones: playlist.canciones.map((item) => ({
      ...item,
      cancion: new Cancion(item.cancion),
      fechaAgregada: new Date(item.fechaAgregada),
    })),
  }));
}

export function cargarPlaylists() {
  const textoGuardado = localStorage.getItem(CLAVE_STORAGE);

  if (!textoGuardado) {
    return { ok: true, playlists: [] }; // primera visita, no hay nada guardado todavía
  }

  try {
    const datosCrudos = JSON.parse(textoGuardado);
    const playlists = rehidratarPlaylists(datosCrudos);
    return { ok: true, playlists };
  } catch (error) {
    console.error('Los datos guardados están corruptos:', error);
    return { ok: false, playlists: [] };
  }
}

export function limpiarStorage() {
  localStorage.removeItem(CLAVE_STORAGE);
}