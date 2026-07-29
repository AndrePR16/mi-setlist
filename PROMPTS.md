[CONTEXTO] : ESTOY CONSTRUYENDO MI SETLIST , una aplicación web que permita buscar canciones en un catálogo real (API de iTunes) y organizarlas en playlists personales que sobreviven al recargar la página. La app calcula la duración total de cada playlist y 
 muestra estadísticas de tu música.
 Stack: HTML5 semántico + CSS3 (propio o Tailwind Play CDN, a tu criterio) + JavaScript vanilla con módulos ESM (import/export, <script type="module">).
 Arquitectura: estado central plano + patrón “cambias el estado → llamas render()”. CRUD inmutable (.filter/.map/spread). Delegación de eventos para las listas. Ids con crypto.randomUUID().
 Persistencia: localStorage + JSON.stringify/parse envueltos en try/catch; fechas rehidratadas al cargar.
 UX: confirmaciones con modal propio (nada de confirm() nativo); estados vacíos amigables.
 API: iTunes Search API (solo lectura, sin key).
 Deploy: GitHub Pages. ESM no corre con file:// → usar Live Server.
 No se permite: frameworks JS (React, Vue…), librerías de manejo de estado, backend, copiar código de la IA sin registrarlo en PROMPTS.md
 EL MVP tiene estas 10 funcionalidades
 Buscar canciones por artista o título en la API, mostrando carátula, nombre, artista y duración.
 Comunicar el estado de la búsqueda: indicador de carga, mensaje de error si la API falla, mensaje amigable si no hay resultados.
 Crear playlists con nombre propio (ej: “Road trip”, “Ensayo sábado”).
 Agregar canciones desde los resultados de búsqueda a una playlist.
 Ver el contenido de una playlist con los datos de cada canción y la fecha en que se agregó.
 Quitar canciones y eliminar playlists con confirmación previa (modal propio).
 Ver la duración total de la playlist en formato legible (ej: “1 h 23 min”).
 Ver estadísticas de la playlist: cantidad de canciones, género más frecuente, artista más repetido.
 Ordenar las canciones de una playlist (recientes/antiguas, alfabético).
 Persistir todo en LocalStorage y restaurar al recargar; si los datos están corruptos, la app no se rompe y ofrece “Empezar de cero”.
 [TAREA] Pídele descomponer el MVP en historias de usuario para UNA persona
 desarrollando en 2 sprints de una sesión cada uno.
 [FORMATO] Historia ("Como... quiero... para...") + 3-5 criterios de aceptación.
 [RESTRICCIÓN] Los criterios describen RESULTADOS observables en pantalla, no implementación. Nada fuera del MVP.
 Generame un documento con el resultado