# Mi Setlist — Historias de Usuario (2 Sprints, 1 sesión c/u)

**Desarrollador:** 1 persona
**Formato:** Como... quiero... para... + criterios de aceptación (resultados observables en pantalla)

---

## SPRINT 1 — Búsqueda, creación y visualización de playlists

### HU-01: Buscar canciones en el catálogo
**Como** usuario, **quiero** buscar canciones por artista o título, **para** encontrar música que quiero agregar a mis playlists.

**Criterios de aceptación:**
- Al escribir un término y disparar la búsqueda, la pantalla muestra una lista de resultados con carátula, nombre de canción, artista y duración.
- Cada resultado se ve como una tarjeta/fila diferenciada, con la carátula visible aunque sea pequeña.
- Si el campo de búsqueda está vacío, no se dispara ninguna búsqueda ni se muestra un listado.
- La duración de cada canción se muestra en formato legible (min:seg), no en milisegundos.

---

### HU-02: Comunicar el estado de la búsqueda
**Como** usuario, **quiero** saber qué está pasando mientras busco, **para** no pensar que la app está rota o colgada.

**Criterios de aceptación:**
- Mientras la búsqueda está en curso, se ve un indicador de carga (spinner, texto "Buscando...", etc.).
- Si la API falla o no responde, aparece un mensaje de error claro y no técnico, sin dejar la pantalla en blanco.
- Si la búsqueda no arroja resultados, aparece un mensaje amigable (ej. "No encontramos canciones con ese nombre. Probá con otro término.").
- El indicador de carga desaparece apenas se muestran resultados, error o mensaje de "sin resultados".

---

### HU-03: Crear una playlist
**Como** usuario, **quiero** crear playlists con un nombre elegido por mí, **para** organizar mi música por ocasión o gusto.

**Criterios de aceptación:**
- Al ingresar un nombre y confirmar, la nueva playlist aparece inmediatamente en el listado de playlists.
- No se puede crear una playlist con nombre vacío (se muestra un aviso o el botón queda deshabilitado).
- Se pueden crear varias playlists con nombres distintos y todas quedan visibles en la lista.
- La playlist recién creada aparece vacía, con un estado vacío amigable (ej. "Todavía no agregaste canciones").

---

### HU-04: Agregar canciones desde la búsqueda a una playlist
**Como** usuario, **quiero** agregar canciones encontradas en la búsqueda a una playlist existente, **para** ir armando mi lista.

**Criterios de aceptación:**
- Desde cada resultado de búsqueda hay una acción visible para agregarlo a una playlist (botón o selector).
- Si hay más de una playlist creada, el usuario puede elegir a cuál agregar la canción.
- Tras agregar, se ve una confirmación visual breve (ej. mensaje "Agregada a Road trip" o cambio de ícono).
- Si se intenta agregar la misma canción dos veces a la misma playlist, la app lo permite o avisa según la regla elegida, pero nunca rompe la pantalla ni duplica sin control visible.

---

### HU-05: Ver el contenido de una playlist
**Como** usuario, **quiero** ver el detalle de una playlist, **para** revisar qué canciones tiene y cuándo las agregué.

**Criterios de aceptación:**
- Al seleccionar una playlist, se muestra la lista de sus canciones con carátula, nombre, artista y duración.
- Cada canción muestra la fecha (y idealmente hora) en que fue agregada, en formato legible (no timestamp crudo).
- Si la playlist no tiene canciones, se ve el estado vacío amigable en lugar de una lista en blanco.
- El nombre de la playlist seleccionada es visible como título de la vista de detalle.

---

## SPRINT 2 — Gestión, estadísticas, orden y persistencia robusta

### HU-06: Quitar canciones y eliminar playlists con confirmación
**Como** usuario, **quiero** quitar canciones o eliminar playlists completas con una confirmación previa, **para** no perder información por error.

**Criterios de aceptación:**
- Al intentar quitar una canción o eliminar una playlist, se abre un modal propio (no `confirm()` del navegador) pidiendo confirmación.
- El modal indica claramente qué se va a eliminar (nombre de canción o de playlist).
- Si se confirma, el elemento desaparece de la pantalla inmediatamente; si se cancela, no cambia nada.
- Al eliminar la última canción de una playlist, se vuelve a mostrar el estado vacío amigable.
- Al eliminar una playlist, deja de aparecer en el listado general de playlists.

---

### HU-07: Ver la duración total de una playlist
**Como** usuario, **quiero** ver cuánto dura mi playlist en total, **para** saber si alcanza para un viaje, ensayo, etc.

**Criterios de aceptación:**
- En la vista de detalle de la playlist se muestra la duración total sumando todas las canciones.
- El formato es legible para humanos (ej. "1 h 23 min"), nunca en milisegundos ni segundos crudos.
- Si la playlist está vacía, la duración total se muestra como "0 min" (o equivalente), no en blanco ni con error.
- La duración total se actualiza en pantalla apenas se agrega o quita una canción.

---

### HU-08: Ver estadísticas de la playlist
**Como** usuario, **quiero** ver estadísticas de mi playlist, **para** entender mejor mis gustos musicales.

**Criterios de aceptación:**
- Se muestra la cantidad total de canciones en la playlist.
- Se muestra el género más frecuente entre las canciones de la playlist.
- Se muestra el artista más repetido en la playlist.
- Si hay empate entre géneros o artistas, se muestra al menos uno de forma consistente (sin error ni pantalla rota).
- Si la playlist está vacía, las estadísticas muestran un estado neutro (ej. "Sin datos todavía") en vez de valores erróneos.

---

### HU-09: Ordenar las canciones de una playlist
**Como** usuario, **quiero** ordenar las canciones de una playlist, **para** encontrarlas más fácil según lo que necesite.

**Criterios de aceptación:**
- Hay una opción visible para ordenar por "más recientes" y otra por "más antiguas" (según fecha de agregado).
- Hay una opción visible para ordenar alfabéticamente (por nombre de canción o artista).
- Al cambiar el criterio de orden, la lista en pantalla se reordena inmediatamente sin recargar la página.
- El orden elegido se refleja visualmente sin alterar los datos originales de la playlist (mismas canciones, solo cambia el orden mostrado).

---

### HU-10: Persistir todo y recuperarse de datos corruptos
**Como** usuario, **quiero** que mis playlists se guarden solas y estén ahí cuando vuelva, **para** no perder mi trabajo al recargar o cerrar el navegador.

**Criterios de aceptación:**
- Al recargar la página, todas las playlists, sus canciones y fechas de agregado siguen presentes tal como estaban.
- Si los datos guardados están corruptos o dañados, la app no se rompe ni queda en blanco.
- Ante datos corruptos, se muestra una pantalla o mensaje ofreciendo la opción "Empezar de cero".
- Al elegir "Empezar de cero", la app queda en un estado inicial limpio y utilizable (sin playlists, listo para crear nuevas).

---

## EXTRAS — Funcionalidades fuera de las 10 historias del MVP

### HU-11: Modo oscuro
**Como** usuario, **quiero** poder cambiar la app a un tema oscuro, **para** usarla cómodamente en ambientes con poca luz o según mi preferencia visual.

**Criterios de aceptación:**
- Si el usuario nunca cambió el tema manualmente, la app respeta la preferencia del sistema operativo (claro u oscuro).
- El control para cambiar de tema está siempre visible y disponible, sin importar la preferencia del sistema.
- Una vez que el usuario elige un tema manualmente, esa elección se guarda y prevalece sobre la preferencia del sistema en visitas futuras.
- El cambio de tema es inmediato, sin recargar la página.

---

### HU-12: Marcar canciones como favoritas
**Como** usuario, **quiero** marcar canciones como favoritas con una estrella, **para** identificar rápido mis canciones preferidas dentro de una playlist.

**Criterios de aceptación:**
- Cada canción dentro de una playlist tiene un ícono de estrella clickeable para marcarla/desmarcarla como favorita.
- El estado de favorito se ve claramente distinto (estrella llena vs. vacía).
- Hay una forma de filtrar o ver solo las canciones favoritas dentro de una playlist.
- El estado de favorito persiste al recargar la página (mismo mecanismo de localStorage que ya tenemos).

---

### HU-13: Ver las playlists en un panel lateral
**Como** usuario, **quiero** ver mis playlists en un panel al costado de la pantalla, **para** acceder a ellas sin tener que desplazarme hasta el final de la página.
 
**Criterios de aceptación:**s
- En pantallas anchas, el panel de playlists se muestra fijo al lado derecho de los resultados de búsqueda, visible sin necesidad de scroll adicional.
- En pantallas angostas (mobile), el panel de playlists queda oculto por defecto y aparece un botón visible para mostrarlo u ocultarlo.
- Al mostrar el panel en mobile, se puede seguir usando normalmente (crear playlist, seleccionar, ver detalle) sin que tape permanentemente los resultados de búsqueda.
- El cambio entre el layout de escritorio y el de mobile ocurre automáticamente según el ancho de pantalla, sin acción del usuario.
---
 
### HU-14: Reproducir un preview de las canciones
**Como** usuario, **quiero** escuchar un preview de las canciones desde la búsqueda y desde mis playlists, **para** decidir si me gustan antes de agregarlas o simplemente disfrutarlas.
 
**Criterios de aceptación:**
- Cada canción, tanto en los resultados de búsqueda como dentro de una playlist, tiene un botón para reproducir su preview de audio.
- Hay un reproductor visible en la parte inferior central de la pantalla que muestra qué canción está sonando (título y artista) y permite pausar/reanudar.
- Dentro de una playlist, hay una acción para reproducir todas sus canciones en secuencia, respetando el criterio de orden actualmente seleccionado (recientes, antiguas, alfabético).
- Al terminar la reproducción de una canción durante "Reproducir todo", comienza automáticamente la siguiente de la cola, sin acción del usuario.
- Si una canción no tiene preview disponible, la reproducción no se rompe ni queda trabada: se informa y continúa (o se omite) de forma que la experiencia siga siendo utilizable.
---
 
## Resumen de cobertura
 
| Sprint | Historias | Funcionalidades del MVP cubiertas |
|--------|-----------|-------------------------------------|
| Sprint 1 | HU-01 a HU-05 | Búsqueda, estados de búsqueda, crear playlist, agregar canciones, ver contenido |
| Sprint 2 | HU-06 a HU-10 | Quitar/eliminar con confirmación, duración total, estadísticas, orden, persistencia y recuperación |
| Extra | HU-11 a HU-14 | Modo oscuro, canciones favoritas, panel lateral de playlists, reproductor de preview — fuera del alcance original del MVP |
 
**Nota:** las historias HU-01 a HU-10 cubren la totalidad del MVP definido. HU-11 a HU-14 son funcionalidades adicionales, incorporadas después de cerrar ambos sprints.