# 🎵 Mi Setlist

Aplicación web para buscar canciones en un catálogo real (API de iTunes), organizarlas en playlists personales que persisten al recargar la página, y reproducir un preview de audio de cada canción.

## Stack técnico

- **HTML5** semántico
- **CSS3** propio (con variables CSS para theming y layout responsive)
- **JavaScript vanilla** con módulos ESM (`import`/`export`, `<script type="module">`)
- **API de iTunes Search** (solo lectura, sin key) — incluyendo el campo `previewUrl` para reproducción
- **localStorage** para persistencia de playlists y preferencia de tema
- **`<audio>` nativo del navegador** para la reproducción de previews

Sin frameworks (React, Vue, etc.), sin librerías de manejo de estado, sin backend.

## Arquitectura

- **Estado central plano**: un único objeto de estado en `js/state.js`, con funciones exportadas que lo modifican de forma inmutable (`.filter`/`.map`/spread — nunca mutación directa).
- **Patrón de render**: cada acción sigue el flujo *cambio de estado → se llama a la función de render correspondiente*. El DOM nunca se actualiza "a mano" fuera de las funciones de `js/ui.js`.
- **Delegación de eventos**: los listeners se agregan sobre contenedores fijos (`#resultados`, `#lista-playlists`, `#detalle-playlist`, `#modal-confirmacion`, etc.), no sobre cada elemento individual generado dinámicamente.
- **IDs**: `crypto.randomUUID()` para entidades creadas por la app (playlists, ítems de playlist). Las canciones usan el `trackId` de iTunes (convertido a `string`) como identificador, ya que vienen de una fuente externa con identidad propia.
- **Persistencia**: cada función que modifica `playlists` en `state.js` termina llamando a `guardarPlaylists()`, que serializa el estado a `localStorage` envuelto en `try/catch`. Al cargar, `cargarPlaylists()` intenta reconstruir los datos (rehidratando fechas y reinstanciando `Cancion`); si falla, la app muestra una pantalla de recuperación en vez de romperse.
- **Theming**: los colores están definidos como variables CSS en `:root` (tema claro) y redefinidos en `body.tema-oscuro` (tema oscuro). Cambiar de tema es solo alternar esa clase en el `<body>` — ninguna otra regla necesita duplicarse.
- **Layout responsive**: en pantallas anchas, el panel de playlists es una columna fija al costado (`.layout-principal` con flexbox). En pantallas angostas, el panel se oculta por defecto y se muestra como una capa superpuesta (`position: fixed`) al presionar un botón, evitando que empuje el contenido hacia abajo.
- **Reproductor**: el estado guarda una cola de reproducción (`reproductor: { cola, indice, estaSonando }`), siempre un array de instancias `Cancion`. El elemento `<audio>` vive fuera de cualquier contenedor que se reescriba con `innerHTML`, y se controla de forma imperativa (`.play()`, `.pause()`, evento `ended`) desde `js/app.js`, mientras que `js/ui.js` solo pinta la información visual del reproductor.

## Estructura de archivos

```
mi-setlist/
├── index.html
├── css/styles.css
├── js/
│   ├── app.js             # Punto de entrada, inicialización, manejo de eventos, control del <audio>
│   ├── models/Cancion.js  # Clase que modela una canción (incluye previewUrl)
│   ├── state.js           # Estado central (búsqueda, playlists, UI, tema, reproductor)
│   ├── storage.js         # Persistencia en localStorage y recuperación ante datos corruptos
│   ├── api.js              # fetch a la API de iTunes
│   └── ui.js               # render + generación de HTML dinámico
├── PROMPTS.md              # Registro de trabajo con la IA
├── README.md
└── .gitignore
```

## Cómo correr el proyecto

Como se usan módulos ESM, **no funciona abriendo `index.html` directamente con `file://`**. Hay que servirlo con un servidor local, por ejemplo la extensión **Live Server** de VS Code:

1. Abrir la carpeta del proyecto en VS Code.
2. Clic derecho sobre `index.html` → **Open with Live Server**.
3. Se abre en `http://127.0.0.1:5500` (o similar).

## Estado del proyecto: Sprint 1 y Sprint 2 completos ✅

El MVP completo está implementado: las 10 historias de usuario originales, cubriendo desde la búsqueda de canciones hasta la persistencia con recuperación ante datos corruptos. Además, se agregaron 4 funcionalidades extra fuera del alcance original.

### Sprint 1 — Historias de usuario

**HU-01 — Buscar canciones en el catálogo**
Búsqueda por artista o título contra la API de iTunes (`js/api.js`), mostrando carátula, título, artista y duración en formato legible (`m:ss`) por cada resultado.

**HU-02 — Comunicar el estado de la búsqueda**
Indicador de carga mientras la búsqueda está en curso, mensaje de error (con botón "Reintentar") si la API falla, y mensaje amigable si no hay resultados. El botón de búsqueda se deshabilita mientras hay una búsqueda en curso, para evitar búsquedas superpuestas.

**HU-03 — Crear una playlist**
Formulario colapsable ("Nueva playlist") con validación de nombre vacío y de nombres duplicados (comparación case-insensitive). La playlist creada queda seleccionada automáticamente y muestra su estado vacío ("Todavía no agregaste canciones").

**HU-04 — Agregar canciones desde la búsqueda a una playlist**
Botón "Agregar" (verde) en cada resultado que abre un popover con las playlists existentes, mostradas como etiquetas destacadas, para elegir a cuál agregar la canción. Si no hay playlists creadas, permite crear una al vuelo y agrega la canción en el mismo paso. Evita duplicados exactos avisando con un toast en vez de agregarla de nuevo. El popover se cierra con Esc o clic afuera.

**HU-05 — Ver el contenido de una playlist**
Al seleccionar una playlist, se muestra la lista completa de sus canciones (carátula, título, artista, duración) junto con la fecha y hora exacta en que cada una fue agregada. Cada fila usa un layout de dos líneas (título+duración arriba, artista+fecha abajo) que se adapta en mobile. Si la playlist no tiene canciones, se sigue mostrando el estado vacío amigable.

### Sprint 2 — Historias de usuario

**HU-06 — Quitar canciones y eliminar playlists con confirmación**
Modal propio (no `confirm()` nativo) que indica claramente qué se va a eliminar, con cierre por botones, clic afuera del diálogo o tecla Esc. El botón de quitar canción aparece solo al pasar el mouse sobre la fila. Al eliminar la playlist actualmente seleccionada, la vista de detalle queda deseleccionada.

**HU-07 — Ver la duración total de una playlist**
Suma la duración de todas las canciones y la muestra en formato legible junto al título ("1 h 23 min", o solo "23 min" si dura menos de una hora). Se actualiza automáticamente al agregar o quitar canciones.

**HU-08 — Ver estadísticas de la playlist**
Muestra cantidad de canciones, género más frecuente y artista más repetido. Ante empates, gana el primero en orden de agregado (regla determinística). El placeholder "Género desconocido" se excluye del cálculo. Playlist vacía → mensaje "Sin datos todavía".

**HU-09 — Ordenar las canciones de una playlist**
Pills para ordenar por más recientes, más antiguas, título (A-Z) o artista (A-Z). El ordenamiento es puramente de presentación (trabaja sobre una copia del array); los datos originales de la playlist nunca se alteran. El criterio vuelve a "más antiguas" cada vez que se selecciona o crea una playlist.

**HU-10 — Persistir todo y recuperarse de datos corruptos**
Las playlists (nombre, canciones, fechas de agregado, favoritas) se guardan en `localStorage` cada vez que cambian. Al cargar la página, se intenta reconstruir ese estado; si el JSON guardado está corrupto, se muestra una pantalla de recuperación con un botón "Empezar de cero" que limpia el storage y reinicia la app a un estado limpio.

### Funcionalidades extra (fuera de las 10 historias del MVP)

**HU-11 — Modo oscuro**
Switch tradicional, siempre visible. En la primera visita, la app respeta la preferencia del sistema operativo (`prefers-color-scheme`); una vez que el usuario elige un tema manualmente, esa elección se guarda en `localStorage` y prevalece sobre la preferencia del sistema en visitas futuras. El cambio es inmediato, sin recargar la página.

**HU-12 — Marcar canciones como favoritas**
Estrella clickeable (☆/★) a la izquierda de cada canción dentro de una playlist. Pill "★ Solo favoritas" junto a los controles de orden, para filtrar la vista sin alterar el orden elegido. El estado de favorito persiste con el mismo mecanismo de `localStorage` usado para el resto de las playlists.

**HU-13 — Panel lateral de playlists**
En pantallas anchas, el panel de "Mis playlists" se muestra fijo al costado derecho de los resultados de búsqueda (layout de dos columnas), en vez de al final de la página. En pantallas angostas, el panel se oculta por defecto y se muestra como una capa superpuesta a pantalla completa mediante un botón "Ver playlists" / "✕ Cerrar".

**HU-14 — Reproductor de preview**
Botón de reproducción (▶) en cada canción, tanto en resultados de búsqueda como dentro de una playlist, que reproduce el preview de 30 segundos que devuelve la API de iTunes (`previewUrl`). Reproductor fijo en la parte inferior central de la pantalla, con control de play/pausa. Dentro de una playlist, un botón "Reproducir todo" arma una cola con todas las canciones respetando el criterio de orden actualmente seleccionado, avanzando automáticamente a la siguiente canción al terminar cada una. Si una canción no tiene preview disponible, se omite automáticamente sin trabar la reproducción.

### Decisiones de diseño relevantes

- Layout compacto tipo YouTube Music para resultados de búsqueda y canciones dentro de playlists, con tamaños de carátula distintos (44px en resultados, 36px en el detalle de playlist) para diferenciar jerárquicamente.
- Convención de color: morado para acciones constructivas (buscar, crear), verde para agregar/reproducir todo (inspirado en Spotify), rojo para acciones destructivas (eliminar, quitar, confirmar borrado), y dorado reservado exclusivamente para el estado de favorito.
- El filtro de "solo favoritas" se aplica *después* de ordenar la lista, por lo que ambos controles (orden y filtro) son independientes entre sí.
- El elemento `<audio>` se mantiene fuera del árbol de renderizado dinámico para que la reproducción nunca se interrumpa por un re-render de otra parte de la UI.
- Reset global de `box-sizing: border-box` para evitar desbordes de layout en elementos con `width` + `padding` combinados (relevante para el panel de playlists en mobile).

## Registro de uso de IA

Todo el trabajo realizado con asistencia de IA está documentado en [`PROMPTS.md`](./PROMPTS.md), incluyendo las decisiones de UX y estructura de datos tomadas en cada historia de usuario.