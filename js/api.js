import { Cancion } from './models/Cancion.js';

const ITUNES_SEARCH_URL = 'https://itunes.apple.com/search';
const LIMITE_RESULTADOS = 25;

export async function buscarCanciones(termino) {
  const url = `${ITUNES_SEARCH_URL}?term=${encodeURIComponent(termino)}&media=music&entity=song&limit=${LIMITE_RESULTADOS}`;
  const respuesta = await fetch(url);

  if (!respuesta.ok) {
    throw new Error(`La API de iTunes respondió con estado ${respuesta.status}`);
  }

  const datos = await respuesta.json();
  return datos.results.map(Cancion.fromApiResult);
}