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
 ---------------------------------------------------------------------------
 Estas son mis 10 historias DE USUARIO: (El resultado de ello, se visualiza en SPRINTS.md)

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
**Nota:** ninguna historia incluye funcionalidades fuera de las 10 del MVP definido.

Propón cómo distribuirlas en Sprint 1 y Sprint 2 (una clase cada uno).
Justifica cada asignación, señala las dependencias (qué necesito
tener antes de qué) y dime cuál historia es la más difícil técnicamente.

Generame el resultado en una estructura similar a esta:
## Sprint 1 (Clase 18) — Meta: [qué se ve funcionando al final, en 1 línea]
LISTA DE HU EN ORDEN
- HU__: ______ (por qué va primero)
...

## Sprint 2 (Clase 19) — Meta: [1 línea]
- HU__: ______
...

## Dependencias detectadas
- Para HU__ necesito antes HU__ porque ______.

## Mi reto técnico principal
La HU que más me intimida es ______ porque ______.

-----------------------------------------------------
PROMP HU-01
CONTEXTO: 
El contrato técnico es:
Stack: HTML5 semántico + CSS3 (propio o Tailwind Play CDN, a tu criterio) + JavaScript vanilla con módulos ESM (import/export, <script type="module">).
Arquitectura: estado central plano + patrón “cambias el estado → llamas render()”. CRUD inmutable (.filter/.map/spread). Delegación de eventos para las listas. Ids con crypto.randomUUID().
Persistencia: localStorage + JSON.stringify/parse envueltos en try/catch; fechas rehidratadas al cargar.
UX: confirmaciones con modal propio (nada de confirm() nativo); estados vacíos amigables.
API: iTunes Search API (solo lectura, sin key).
Deploy: GitHub Pages. ESM no corre con file:// → usar Live Server.
No se permite: frameworks JS (React, Vue…), librerías de manejo de estado, backend, copiar código de la IA sin registrarlo en PROMPTS.md.

Esta será mi estructura de archivos:
mi-setlist/
├── index.html
├── css/styles.css
├── js/
│   ├── app.js             # Punto de entrada, inicialización
│   ├── models/Cancion.js  # Clase que modela una canción
│   ├── state.js           # Estado central (playlists)
│   ├── storage.js         # localStorage (guardar/cargar/limpiar)
│   ├── api.js             # fetch a la API de iTunes
│   └── ui.js              # render + eventos del DOM
├── PROMPTS.md             # Registro de trabajo con la IA
├── README.md              # Documentación del proyecto
└── .gitignore

TAREA: Implementemos JUNTOS esta historia:
HU-01: Buscar canciones en el catálogo
**Como** usuario, **quiero** buscar canciones por artista o título, **para** encontrar música que quiero agregar a mis playlists.

**Criterios de aceptación:**
- Al escribir un término y disparar la búsqueda, la pantalla muestra una lista de resultados con carátula, nombre de canción, artista y duración.
- Cada resultado se ve como una tarjeta/fila diferenciada, con la carátula visible aunque sea pequeña.
- Si el campo de búsqueda está vacío, no se dispara ninguna búsqueda ni se muestra un listado.
- La duración de cada canción se muestra en formato legible (min:seg), no en milisegundos.


MODO: Antes de escribir código, hazme 2 o 3 preguntas estratégicas necesarias
sobre decisiones que me corresponden a mí (experiencia de usuario,
casos borde, estructura de datos). Espera mis respuestas. Después
dame el código en porciones pequeñas, explicando qué hace cada una
y en qué archivo va.

RESTRICCIONES: Respeta el contrato técnico que te compartí en mensajes anteriores. No reescribas archivos que no te pedí. Si el contrato te impide algo, dímelo en vez de saltártelo. No supongas nada.
P: ¿Cómo se dispara la búsqueda?
R: Ambas: botón + Enter en el input

P: ¿Qué pasa si un resultado de iTunes viene con datos incompletos (ej. sin carátula o sin género)?
R: Se muestra igual, con un placeholder genérico para el dato faltante

P: ¿Cuántos resultados como máximo mostramos por búsqueda?
R: 25 (default típico de iTunes API)

Chequeo contra los criterios de HU-01:

✅ Muestra carátula, nombre, artista y duración por resultado.
✅ Cada resultado es una tarjeta diferenciada (.tarjeta-cancion).
✅ Input vacío no dispara búsqueda (if (termino === '') return;).
✅ Duración en m:ss, no milisegundos.
------------------------------------------------------------------------------
HU-02
Como ya tienes el contrato técnico y la estructura de archivo, no es necesito repetirlo, ahora continuemos con la HU-02
TAREA: Implementemos JUNTOS esta historia:
HU-02: Comunicar el estado de la búsqueda
**Como** usuario, **quiero** saber qué está pasando mientras busco, **para** no pensar que la app está rota o colgada.
**Criterios de aceptación:**
- Mientras la búsqueda está en curso, se ve un indicador de carga (spinner, texto "Buscando...", etc.).
- Si la API falla o no responde, aparece un mensaje de error claro y no técnico, sin dejar la pantalla en blanco.
- Si la búsqueda no arroja resultados, aparece un mensaje amigable (ej. "No encontramos canciones con ese nombre. Probá con otro término.").
- El indicador de carga desaparece apenas se muestran resultados, error o mensaje de "sin resultados".
MODO: Antes de escribir código, hazme 2 o 3 preguntas estratégicas necesarias
sobre decisiones que me corresponden a mí (experiencia de usuario,
casos borde, estructura de datos). Espera mis respuestas. Después
dame el código en porciones pequeñas, explicando qué hace cada una
y en qué archivo va.
RESTRICCIONES: Respeta el contrato técnico que te compartí en mensajes anteriores. No reescribas archivos que no te pedí. Si el contrato te impide algo, dímelo en vez de saltártelo. No supongas nada.

P: ¿Qué pasa si el usuario dispara una nueva búsqueda mientras la anterior todavía está en curso (ej. escribe rápido y manda varias)?
R: Se ignora la nueva mientras haya una en curso (botón deshabilitado durante la carga)

P: ¿Dónde querés que se vea el indicador de carga y los mensajes?
R: En una zona de estado separada, arriba de los resultados, sin tocar el contenedor de resultados

P: Para el mensaje de error de la API, ¿querés incluir un botón para reintentar la misma búsqueda?
R: Sí, botón "Reintentar" además del mensaje

Estado central: agrego un campo estadoBusqueda con valores explícitos ('idle' | 'cargando' | 'error' | 'vacio' | 'ok') en vez de banderas sueltas (cargando: true/false, error: true/false). Con banderas sueltas es fácil terminar en estados imposibles (ej. cargando: true y error: true al mismo tiempo); con un solo campo de "estado con nombre" eso no puede pasar.
Botón deshabilitado durante carga: lo controlamos leyendo estadoBusqueda === 'cargando' en cada render, no con una variable aparte — así el HTML siempre refleja el estado central, nunca se desincroniza.
Reintentar: guardo el último término buscado en el estado para poder repetir la búsqueda con el botón, usando delegación de eventos (como pide el contrato) en vez de poner un addEventListener nuevo cada vez que se pinta el mensaje de error.

Chequeo contra los criterios de HU-02:

✅ Indicador de carga visible (spinner + "Buscando...") mientras estadoBusqueda === 'cargando'.
✅ Mensaje de error claro, no técnico, con botón "Reintentar" (tu decisión).
✅ Mensaje amigable de "sin resultados" cuando la búsqueda no arroja nada.
✅ El indicador desaparece apenas se llega a 'ok', 'error' o 'vacio' — nunca queda "cargando" pegado.
✅ Bonus de tu primera respuesta: el botón se deshabilita durante la carga, evitando búsquedas superpuestas.
------------------------------------------------------------------
Como ya tienes el contrato técnico y la estructura de archivo, no es necesito repetirlo, ahora continuemos con la HU-03
TAREA: Implementemos JUNTOS esta historia:
HU-03: Crear una playlist
**Como** usuario, **quiero** crear playlists con un nombre elegido por mí, **para** organizar mi música por ocasión o gusto.
**Criterios de aceptación:**
- Al ingresar un nombre y confirmar, la nueva playlist aparece inmediatamente en el listado de playlists.
- No se puede crear una playlist con nombre vacío (se muestra un aviso o el botón queda deshabilitado).
- Se pueden crear varias playlists con nombres distintos y todas quedan visibles en la lista.
- La playlist recién creada aparece vacía, con un estado vacío amigable (ej. "Todavía no agregaste canciones").
MODO: Antes de escribir código, hazme 2 o 3 preguntas estratégicas necesarias
sobre decisiones que me corresponden a mí (experiencia de usuario,
casos borde, estructura de datos). Espera mis respuestas. Después
dame el código en porciones pequeñas, explicando qué hace cada una
y en qué archivo va.
RESTRICCIONES: Respeta el contrato técnico que te compartí en mensajes anteriores. No reescribas archivos que no te pedí. Si el contrato te impide algo, dímelo en vez de saltártelo. No supongas nada.

P: ¿Se permite crear dos playlists con el mismo nombre?
R: No, si el nombre ya existe se avisa y no se crea

P: Al crear una playlist nueva, ¿se selecciona automáticamente para mostrar su detalle vacío (adelantando parte de HU-05), o solo aparece en el listado general?
R: Sí, al crearla queda seleccionada y se ve su detalle vacío de inmediato

P: ¿Cómo querés que se vea el formulario para crear una playlist?
R: Botón 'Nueva playlist' que despliega/oculta el formulario

Con esas respuestas, así construimos HU-03:

Nombre duplicado: la validación de "¿ya existe este nombre?" la hago comparando en minúsculas y sin espacios extra (trim().toLowerCase()), para que "Rock" y "rock " se traten como el mismo nombre.
Selección automática: al crear la playlist, la marco como seleccionada en el estado y agrego una vista de detalle mínima que muestra su nombre y el estado vacío amigable. Ojo: esta vista de detalle todavía es básica — en HU-05 la vamos a expandir para listar canciones reales. Por ahora solo cumple lo que pide HU-03.
Formulario colapsable: agrego un flag en el estado central (mostrarFormularioPlaylist) en vez de manejar el show/hide solo con CSS/DOM suelto — así seguimos el patrón "cambia estado → render()" también para esta interacción, no solo para los datos.
Decisión que tomo yo (no me la preguntaste, pero el criterio de aceptación deja abierto "aviso o botón deshabilitado"): uso un mensaje de aviso inline, igual que hicimos con los errores de búsqueda en HU-02, para mantener el mismo lenguaje visual en toda la app. Si preferís botón deshabilitado en su lugar, lo cambiamos.

Chequeo contra los criterios de HU-03:

✅ Al crear, la playlist aparece de inmediato en #lista-playlists.
✅ Nombre vacío → aviso, no se crea (errorFormularioPlaylist).
✅ Nombres duplicados → aviso, no se crea (existeNombrePlaylist).
✅ Varias playlists con nombres distintos, todas visibles en la lista.
✅ Playlist recién creada se selecciona sola y muestra "Todavía no agregaste canciones" en #detalle-playlist.
-------------------------------------------------------------------------
