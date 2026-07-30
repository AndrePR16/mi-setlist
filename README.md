# mi-setlist
Construir una aplicación web que permita buscar canciones en un catálogo real (API de iTunes) y organizarlas en playlists personales que sobreviven al recargar la página. La app calcula la duración total de cada playlist y muestra estadísticas de tu música.  Inspiración: el “armador de playlists” de cualquier app de música, sin cuenta ni backend.
# 🎵 Mi Setlist

Aplicación web para buscar canciones en un catálogo real (API de iTunes) y organizarlas en playlists personales que persisten al recargar la página.

## Stack técnico

- **HTML5** semántico
- **CSS3** propio
- **JavaScript vanilla** con módulos ESM (`import`/`export`, `<script type="module">`)
- **API de iTunes Search** (solo lectura, sin key)
- **localStorage** para persistencia (pendiente de implementar en Sprint 2)

Sin frameworks (React, Vue, etc.), sin librerías de manejo de estado, sin backend.

## Arquitectura

- **Estado central plano**: un único objeto de estado en `js/state.js`, con funciones exportadas que lo modifican de forma inmutable (`.filter`/`.map`/spread — nunca mutación directa).
- **Patrón de render**: cada acción sigue el flujo *cambio de estado → se llama a la función de render correspondiente*. El DOM nunca se actualiza "a mano" fuera de las funciones de `js/ui.js`.
- **Delegación de eventos**: los listeners se agregan sobre contenedores fijos (`#resultados`, `#lista-playlists`, `#estado-busqueda`, etc.), no sobre cada elemento individual generado dinámicamente.
- **IDs**: `crypto.randomUUID()` para entidades creadas por la app (playlists, ítems de playlist). Las canciones usan el `trackId` de iTunes (convertido a `string`) como identificador, ya que vienen de una fuente externa con identidad propia.

## Estructura de archivos

```
mi-setlist/
├── index.html
├── css/styles.css
├── js/
│   ├── app.js             # Punto de entrada, inicialización, manejo de eventos
│   ├── models/Cancion.js  # Clase que modela una canción
│   ├── state.js           # Estado central (búsqueda, playlists, UI)
│   ├── storage.js         # localStorage (pendiente — Sprint 2)
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

## Estado del proyecto: Sprint 1 completo ✅

El Sprint 1 cubre el flujo completo de punta a punta: **buscar una canción → crear una playlist → agregar la canción → ver el detalle de la playlist con esa canción adentro.**

### Historias de usuario implementadas

**HU-01 — Buscar canciones en el catálogo**
Búsqueda por artista o título contra la API de iTunes (`js/api.js`), mostrando carátula, título, artista y duración en formato legible (`m:ss`) por cada resultado.

**HU-02 — Comunicar el estado de la búsqueda**
Indicador de carga mientras la búsqueda está en curso, mensaje de error (con botón "Reintentar") si la API falla, y mensaje amigable si no hay resultados. El botón de búsqueda se deshabilita mientras hay una búsqueda en curso, para evitar búsquedas superpuestas.

**HU-03 — Crear una playlist**
Formulario colapsable ("Nueva playlist") con validación de nombre vacío y de nombres duplicados (comparación case-insensitive). La playlist creada queda seleccionada automáticamente y muestra su estado vacío ("Todavía no agregaste canciones").

**HU-04 — Agregar canciones desde la búsqueda a una playlist**
Botón "Agregar" en cada resultado que abre un popover con las playlists existentes para elegir a cuál agregar la canción. Si no hay playlists creadas, permite crear una al vuelo y agrega la canción en el mismo paso. Evita duplicados exactos (misma canción, misma playlist) avisando con un toast en vez de agregarla de nuevo. Confirmación visual breve tras agregar ("Agregada a [nombre]").

**HU-05 — Ver el contenido de una playlist**
Al seleccionar una playlist, se muestra la lista completa de sus canciones (carátula, título, artista, duración) junto con la fecha y hora exacta en que cada una fue agregada (formato `dd/mm/aaaa hh:mm`). Si la playlist no tiene canciones, se sigue mostrando el estado vacío amigable.

### Decisiones de diseño relevantes

- Los resultados de búsqueda y las canciones dentro de una playlist usan estilos visuales distintos a propósito: fila compacta (tipo YouTube Music) para ambos casos, pero con tamaños de carátula distintos (44px en resultados, 36px en el detalle de playlist) para diferenciar jerárquicamente.
- El orden de las canciones dentro de una playlist es, por ahora, el orden de agregado (la más reciente al final); el control de orden explícito (recientes/antiguas/alfabético) es HU-09, pendiente para Sprint 2.
- Los mensajes de error y confirmación (búsqueda, playlists, toast) reutilizan las mismas clases CSS (`.mensaje-estado`, variantes `-error`/`-vacio`) para mantener un lenguaje visual consistente en toda la app.

### Refinamientos de UI aplicados post-Sprint 1

Tras cerrar el Sprint 1 funcionalmente, se ajustó la interfaz visual (sin tocar lógica de estado ni eventos) para acercarla a una densidad de información tipo YouTube Music, manteniendo la paleta clara:

- **Resultados de búsqueda**: de tarjetas grandes en grid a filas horizontales compactas (carátula 44px, título/artista truncados con ellipsis, duración alineada a la derecha).
- **Botón de agregar**: de un ícono "+" circular a un botón de texto "Agregar", más explícito.
- **Sistema de color**: se unificó un acento morado (`#6c5ce7`) para todos los elementos interactivos principales (botón Buscar, Nueva playlist, Crear, playlist activa, foco de inputs), con bordes redondeados tipo pill consistentes en toda la app.
- El tema oscuro tipo Spotify visto como referencia durante el diseño **no se implementó** — queda anotado como posible funcionalidad extra a futuro, fuera del alcance de las 10 historias de usuario del MVP.

## Pendiente — Sprint 2

- **HU-06**: Quitar canciones y eliminar playlists, con confirmación mediante modal propio.
- **HU-07**: Duración total de la playlist en formato legible.
- **HU-08**: Estadísticas de la playlist (cantidad de canciones, género más frecuente, artista más repetido).
- **HU-09**: Ordenar las canciones de una playlist (recientes/antiguas, alfabético).
- **HU-10**: Persistencia en `localStorage` y recuperación ante datos corruptos ("Empezar de cero").

## Registro de uso de IA

Todo el trabajo realizado con asistencia de IA está documentado en [`PROMPTS.md`](./PROMPTS.md), incluyendo las decisiones de UX y estructura de datos tomadas en cada historia de usuario.