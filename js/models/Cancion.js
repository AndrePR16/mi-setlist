const CARATULA_PLACEHOLDER = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
    <rect width="100" height="100" fill="#333"/>
    <text x="50" y="58" font-size="40" fill="#fff" text-anchor="middle" font-family="sans-serif">♪</text>
  </svg>
`);

export class Cancion {
  constructor({ id, titulo, artista, caratula, duracionMs, genero, previewUrl }) {
    this.id = String(id);
    this.titulo = titulo || 'Título desconocido';
    this.artista = artista || 'Artista desconocido';
    this.caratula = caratula || CARATULA_PLACEHOLDER;
    this.duracionMs = duracionMs || 0;
    this.genero = genero || 'Género desconocido';
    this.previewUrl = previewUrl || null; // ← nuevo
  }

  static fromApiResult(resultado) {
    return new Cancion({
      id: resultado.trackId,
      titulo: resultado.trackName,
      artista: resultado.artistName,
      caratula: resultado.artworkUrl100,
      duracionMs: resultado.trackTimeMillis,
      genero: resultado.primaryGenreName,
      previewUrl: resultado.previewUrl, // ← nuevo
    });
  }

  duracionLegible() {
    if (!this.duracionMs || this.duracionMs <= 0) return '--:--';
    const totalSegundos = Math.round(this.duracionMs / 1000);
    const minutos = Math.floor(totalSegundos / 60);
    const segundos = totalSegundos % 60;
    return `${minutos}:${segundos.toString().padStart(2, '0')}`;
  }
}