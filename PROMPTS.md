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
HU-04
Sigamos con la HU-04: Agregar canciones desde la búsqueda a una playlist (es el punto de unión: necesita que HU-01 y HU-03 ya funcionen).
**Como** usuario, **quiero** agregar canciones encontradas en la búsqueda a una playlist existente, **para** ir armando mi lista.
**Criterios de aceptación:**
- Desde cada resultado de búsqueda hay una acción visible para agregarlo a una playlist (botón o selector).
- Si hay más de una playlist creada, el usuario puede elegir a cuál agregar la canción.
- Tras agregar, se ve una confirmación visual breve (ej. mensaje "Agregada a Road trip" o cambio de ícono).
- Si se intenta agregar la misma canción dos veces a la misma playlist, la app lo permite o avisa según la regla elegida, pero nunca rompe la pantalla ni duplica sin control visible.

P: Si el usuario intenta agregar la misma canción dos veces a la misma playlist, ¿qué regla aplicamos?
R: Se avisa y NO se agrega de nuevo (evita duplicados exactos)

P: ¿Cómo elige el usuario a qué playlist agregar, cuando hay varias creadas?
R: Botón '+' en la tarjeta que abre un pequeño menu/popover con la lista de playlists para elegir

P: ¿Qué pasa si todavía no hay ninguna playlist creada y el usuario quiere agregar una canción desde los resultados?
R: Permitir hacer clic igual, y ahí mismo ofrecer crear una playlist nueva al vuelo

Chequeo contra los criterios de HU-04:

✅ Acción visible para agregar en cada resultado (botón "+").
✅ Con varias playlists, el popover deja elegir a cuál agregar.
✅ Confirmación visual breve tras agregar (toast "Agregada a X").
✅ Duplicado exacto → se avisa (toast) y no se agrega de nuevo; nunca duplica sin control ni rompe pantalla.
✅ Bonus de tu tercera decisión: sin playlists, se puede crear una al vuelo y queda agregada en el mismo paso.
-------------------------------------------------------------------
HU-05:
Sigamos con la misma estructura para HU-05:  Ver el contenido de una playlist (cierra el sprint como la prueba visual de que HU-03 y HU-04 realmente funcionan de punta a punta).
Como usuario, quiero ver el detalle de una playlist, para revisar qué canciones tiene y cuándo las agregué.
Criterios de aceptación:
- Al seleccionar una playlist, se muestra la lista de sus canciones con carátula, nombre, artista y duración.
- Cada canción muestra la fecha (y idealmente hora) en que fue agregada, en formato legible (no timestamp crudo).
- Si la playlist no tiene canciones, se ve el estado vacío amigable en lugar de una lista en blanco.
- El nombre de la playlist seleccionada es visible como título de la vista de detalle.

P: ¿En qué formato querés mostrar la fecha en que se agregó cada canción?
R: Fecha y hora absolutas (ej. '28/07/2026 14:30')

P: Mientras no implementemos HU-09 (ordenar), ¿en qué orden por defecto querés ver las canciones dentro de una playlist?
R: Orden de agregado (la más reciente agregada al final, como en un historial)

P: ¿Querés que las canciones dentro de la playlist se vean con el mismo estilo de tarjeta que usamos en los resultados de búsqueda (HU-01)?
R: Estilo más compacto tipo lista de texto, sin tarjetas grandes

Con esas respuestas, así construimos HU-05 — y es una historia liviana en términos de archivos tocados, porque el estado y los datos (playlist.canciones, cada uno con su cancion y fechaAgregada) ya existen desde HU-04. Solo falta mostrarlos.

Formato de fecha: como fechaAgregada ya es un objeto Date real (lo guardamos así en HU-04), armo un helper simple con los métodos nativos (getDate(), getMonth(), etc.) en vez de sumar una librería nueva — no hace falta para un formato tan sencillo.
Orden por defecto: no necesito tocar nada de lógica — playlist.canciones ya es un array donde cada agregarCancionAPlaylist hace push (vía spread) al final, así que "más reciente al final" ya es el orden natural sin cambios.
Estilo compacto: uso una lista <ul> con filas angostas en vez de reusar .tarjeta-cancion (que es más grande, pensada para resultados de búsqueda).

Chequeo contra los criterios de HU-05:

✅ Al seleccionar una playlist, se ve la lista de canciones con carátula, nombre, artista y duración.
✅ Cada canción muestra fecha y hora de agregado, en formato legible (28/07/2026 14:30), no timestamp crudo.
✅ Playlist sin canciones → sigue mostrando el estado vacío amigable (esa rama no la toqué).
✅ El nombre de la playlist es el <h2> visible como título del detalle.

Con esto se cierra el Sprint 1 completo (HU-01 a HU-05) con el flujo de punta a punta funcionando: buscar → crear playlist → agregar canción → ver el detalle real.
----------------------------------------------------------
HU-06
Ahora seguimos con la HU-06: Quitar canciones y eliminar playlists con confirmación (primero porque introduce el modal propio, una pieza de UI nueva que el resto del sprint no necesita pero que conviene tener resuelta temprano).
Como usuario, quiero quitar canciones o eliminar playlists completas con una confirmación previa, **para** no perder información por error.
Criterios de aceptación:
- Al intentar quitar una canción o eliminar una playlist, se abre un modal propio (no `confirm()` del navegador) pidiendo confirmación.
- El modal indica claramente qué se va a eliminar (nombre de canción o de playlist).
- Si se confirma, el elemento desaparece de la pantalla inmediatamente; si se cancela, no cambia nada.
- Al eliminar la última canción de una playlist, se vuelve a mostrar el estado vacío amigable.
- Al eliminar una playlist, deja de aparecer en el listado general de playlists.

P: ¿Cómo se ve la acción de quitar una canción dentro del detalle de playlist?
R: Aparece solo al pasar el mouse sobre la fila (hover)

P: Si eliminan la playlist que está actualmente seleccionada/abierta, ¿qué pasa con la vista de detalle?
R: Queda deseleccionada (no se muestra ningún detalle, como al inicio)

P: ¿El modal debería poder cerrarse haciendo clic afuera de él o con la tecla Esc?
R: Sí, clic afuera del modal o tecla Esc lo cierran (como cancelar)

Chequeo contra los criterios de HU-06:

✅ Modal propio (no confirm() nativo) para ambas acciones.
✅ El modal indica el nombre exacto (de la canción o de la playlist) en su mensaje.
✅ Confirmar → desaparece de inmediato; cancelar → nada cambia (el estado nunca se tocó hasta confirmar).
✅ Al quitar la última canción, playlist.canciones.length === 0 vuelve a ser true, así que renderDetallePlaylist muestra el estado vacío automáticamente — sin código extra.
✅ Al eliminar una playlist, .filter() la saca del array, así que desaparece de #lista-playlists en el próximo render.
✅ Bonus de tus decisiones: hover-only en canciones, deselección automática, Esc/clic-afuera cierran el modal.
--------------------------------------------------------------------------
HU-07
Sigamos con la HU-07: Ver la duración total de una playlist (cálculo simple sobre datos que ya existen desde el sprint 1).
Como usuario, quiero ver cuánto dura mi playlist en total, para saber si alcanza para un viaje, ensayo, etc.
Criterios de aceptación:
- En la vista de detalle de la playlist se muestra la duración total sumando todas las canciones.
- El formato es legible para humanos (ej. "1 h 23 min"), nunca en milisegundos ni segundos crudos.
- Si la playlist está vacía, la duración total se muestra como "0 min" (o equivalente), no en blanco ni con error.
- La duración total se actualiza en pantalla apenas se agrega o quita una canción.

P: Cuando la playlist dura menos de 1 hora, ¿mostramos igual el '0 h' adelante, o lo omitimos y mostramos solo los minutos?
R: No, si dura menos de 1h se omite la parte de horas (ej. '23 min')

P: ¿Querés incluir los segundos en el total, o redondear solo a minutos?
R: No, solo horas y minutos (ej. '1 h 23 min'), sin segundos

P: ¿Dónde querés que se vea la duración total dentro de la vista de detalle?
R: Junto al título, en el header de detalle (al lado del nombre de la playlist)

Chequeo contra los criterios de HU-07:

✅ Se muestra la duración total sumando todas las canciones (.reduce() sobre duracionMs).
✅ Formato legible: "1 h 23 min", o solo "23 min" si dura menos de 1 hora (tu primera decisión) — nunca milisegundos ni segundos crudos.
✅ Playlist vacía → duracionTotalMs es 0, formatearDuracionTotal(0) devuelve "0 min" (porque horas === 0 cuando no hay canciones), no queda en blanco ni tira error.
✅ Se actualiza automáticamente al agregar/quitar canciones, porque renderDetallePlaylist() ya se ejecuta en esos flujos desde HU-04 y HU-06 — no hace falta ningún cambio en app.js.
------------------------------------------------------------------------
HU-08
Sigamos con la HU-08: Ver estadísticas de la playlist (mismo tipo de trabajo que HU-07 —cálculo derivado del estado—, así que se agrupan).
Como usuario, quiero ver estadísticas de mi playlist, para entender mejor mis gustos musicales.
Criterios de aceptación:
- Se muestra la cantidad total de canciones en la playlist.
- Se muestra el género más frecuente entre las canciones de la playlist.
- Se muestra el artista más repetido en la playlist.
- Si hay empate entre géneros o artistas, se muestra al menos uno de forma consistente (sin error ni pantalla rota).
- Si la playlist está vacía, las estadísticas muestran un estado neutro (ej. "Sin datos todavía") en vez de valores erróneos.

P: Ante un empate (dos géneros o dos artistas con la misma cantidad), ¿qué regla de desempate consistente usamos?
R: El primero que aparece en la playlist (orden de agregado)

P: Recordás que en HU-01 pusimos 'Género desconocido' como placeholder cuando la API no devuelve género. ¿Cuenta ese placeholder como un género más para el cálculo de 'más frecuente'?
R: No, se excluye del cálculo de género más frecuente

P: ¿Dónde querés ver las estadísticas dentro del detalle de la playlist?
R: En una sección aparte, con sus propias etiquetas (ej. 'Canciones: 5 | Género: Pop | Artista: X')

Con esas respuestas, así construimos HU-08 — otra historia liviana, solo js/ui.js, mismo patrón que HU-07.

Desempate por orden de agregado: como playlist.canciones ya está en ese orden (HU-05), recorrerlo con un for normal (no .sort(), que reordenaría) y quedarme con el primer género/artista que alcance el máximo conteo, resuelve el empate naturalmente sin código extra de desempate.
Excluir "Género desconocido": lo filtro antes de contar, así nunca puede "ganar" como más frecuente.
Sección aparte: agrego un bloque nuevo .estadisticas-playlist entre el header y la lista de canciones.

Chequeo contra los criterios de HU-08:

✅ Cantidad total de canciones (playlist.canciones.length).
✅ Género más frecuente, excluyendo el placeholder de género desconocido.
✅ Artista más repetido.
✅ Empate → gana el primero en orden de agregado, de forma determinística (no cambia entre renders).
✅ Playlist vacía → bloque "Sin datos todavía." en vez de valores erróneos o NaN/undefined.
-------------------------------------------------------------
HU-09
Sigamos con la HU-09: Ordenar las canciones de una playlist (lógica de presentación sobre la lista ya renderizada, no toca el modelo de datos).
Como usuario, quiero ordenar las canciones de una playlist, para encontrarlas más fácil según lo que necesite.
Criterios de aceptación:
- Hay una opción visible para ordenar por "más recientes" y otra por "más antiguas" (según fecha de agregado).
- Hay una opción visible para ordenar alfabéticamente (por nombre de canción o artista).
- Al cambiar el criterio de orden, la lista en pantalla se reordena inmediatamente sin recargar la página.
- El orden elegido se refleja visualmente sin alterar los datos originales de la playlist (mismas canciones, solo cambia el orden mostrado).

P: ¿Cómo querés que se vea el control para elegir el orden?
R: Botones/pills, uno por cada criterio (más visual, como los filtros que ya usamos)

P: El criterio dice 'alfabético (por nombre de canción o artista)' — ¿cuál de las dos preferís, o querés ambas como opciones distintas?
R: Dos opciones separadas: una alfabética por título y otra por artista

P: Si cambiás de playlist y volvés a la anterior, ¿querés que recuerde el orden que habías elegido, o que vuelva siempre al orden por defecto?
R: No, siempre vuelve al orden por defecto (agregado) al cambiar de playlist

Con esas respuestas, así construimos HU-09:

Pills de orden: reusamos el mismo lenguaje visual que ya tenés en .item-playlist (pill con estado activo).
Reset al cambiar de playlist: agrego el criterio de orden al estado central, y lo reseteo a su valor por defecto ('antiguas' = el orden natural de agregado, que ya es lo que se ve hoy) en los dos lugares donde cambia la playlist seleccionada: setPlaylistSeleccionada y crearPlaylist.
No altera los datos: el ordenamiento se hace sobre una copia del array ([...canciones]) justo antes de renderizar, dentro de js/ui.js — playlist.canciones en el estado nunca se toca. Esto es puramente de presentación, como pedía la historia.

Chequeo contra los criterios de HU-09:

✅ Opción visible para "más recientes" y "más antiguas" (pills separadas).
✅ Opción alfabética, dividida en título y artista como pediste.
✅ Cambiar el criterio reordena de inmediato — setCriterioOrdenPlaylist + renderDetallePlaylist() en el mismo clic, sin recargar.
✅ No altera los datos originales: ordenarCanciones siempre trabaja sobre [...canciones], playlist.canciones en el estado nunca se toca por .sort().
✅ Bonus de tu tercera decisión: el criterio vuelve a 'antiguas' cada vez que se selecciona o crea una playlist.
----------------------------------------------------------------------------------
HU-10
Sigamos con la HU-10: Persistir todo y recuperarse de datos corruptos (al final, deliberadamente: envuelve la forma final del estado —playlists, canciones, fechas, orden— así que conviene implementarla cuando ya no va a cambiar la estructura de datos).
Criterios de aceptación:
- Al recargar la página, todas las playlists, sus canciones y fechas de agregado siguen presentes tal como estaban.
- Si los datos guardados están corruptos o dañados, la app no se rompe ni queda en blanco.
- Ante datos corruptos, se muestra una pantalla o mensaje ofreciendo la opción "Empezar de cero".
- Al elegir "Empezar de cero", la app queda en un estado inicial limpio y utilizable (sin playlists, listo para crear nuevas).

P: Te propongo persistir SOLO las playlists (nombre, canciones, fechas) — es lo más fácil de explicar porque es 'lo único que el usuario no quiere perder'. ¿Te sirve así?
R: Sí, así está bien: solo las playlists persisten, la búsqueda siempre arranca vacía

P: Te propongo guardar automáticamente cada vez que cambian las playlists (crear, agregar, quitar, eliminar) — es lo más fácil de explicar: 'cada vez que algo cambia, se guarda'. ¿Te sirve así?
R: Sí, así está bien: se guarda solo después de cambios en playlists

Chequeo contra los criterios de HU-10:

✅ Al recargar, las playlists con sus canciones y fechas siguen ahí (se guardan en cada cambio, se leen y reconstruyen al cargar).
✅ Datos corruptos → JSON.parse o la reconstrucción fallan, se atrapan con try/catch, la app no se rompe.
✅ Se muestra pantalla con botón "Empezar de cero".
✅ Al presionarlo, se borra localStorage y se recarga la página — queda como recién instalada, lista para crear playlists de nuevo.
----------------------------------------------------------------------------------
HU-11
Ahora viene la implementación de 2 HU nuevas, una te dije que sería el modo oscuro y creo que la otra sería el de Favoritos, que se represente por el ícono de una estrella en la canción, vista o filtros.

hagamos un ajuste, en el modo oscuro, se puede habilitar en caso la preferencia del sistema sea claro, en caso la preferencia del sistema este oscuro, la aplicación se muestra oscura. Si no, de igual forma se puede habilitar el modo oscuro. me dejé entender?

P: Para el modo oscuro: ¿cómo imaginás el control para cambiarlo?
R: Switch/toggle más tradicional

P: Para favoritos: ¿cómo querés que se vea el filtro de 'solo favoritas' dentro de una playlist?
R: Filtro tipo pill, junto a las de ordenar (HU-09)

P: ¿Por cuál de las dos empezamos a programar?
R: Sí, empezamos por HU-11 (modo oscuro)

Repasando los 4 criterios que definimos para HU-11:

✅ "Si el usuario nunca cambió el tema manualmente, la app respeta la preferencia del sistema operativo (claro u oscuro)."
Lo cumple obtenerTemaInicial(): si no hay nada en localStorage, consulta window.matchMedia('(prefers-color-scheme: dark)').matches y arranca en oscuro o claro según lo que diga el sistema.
✅ "El control para cambiar de tema está siempre visible y disponible, sin importar la preferencia del sistema."
El switch (#toggle-tema) está en el HTML de forma fija, siempre presente, sin ningún if que lo oculte según el tema actual.
✅ "Una vez que el usuario elige un tema manualmente, esa elección se guarda y prevalece sobre la preferencia del sistema en visitas futuras."
Lo cumple manejarCambioTema(): guarda 'oscuro' o 'claro' en localStorage, y obtenerTemaInicial() siempre revisa primero si hay algo guardado ahí antes de mirar la preferencia del sistema — por eso la elección manual gana.
✅ "El cambio de tema es inmediato, sin recargar la página."
aplicarTema() solo agrega/saca la clase tema-oscuro del <body> con classList.toggle(...) — el CSS reacciona al instante porque las variables cambian de valor apenas cambia esa clase, sin ningún location.reload().
---------------------------------------------------------------------------
HU-12
sigamos con la HU-12: Marcar canciones como favoritas
Como usuario, quiero marcar canciones como favoritas con una estrella, para identificar rápido mis canciones preferidas dentro de una playlist.
Criterios de aceptación (propuesta, a confirmar):
Cada canción dentro de una playlist tiene un ícono de estrella clickeable para marcarla/desmarcarla como favorita.
El estado de favorito se ve claramente distinto (estrella llena vs. vacía).
Hay una forma de filtrar o ver solo las canciones favoritas dentro de una playlist.
El estado de favorito persiste al recargar la página (mismo mecanismo de localStorage que ya tenemos).

P: ¿Dónde va la estrella en cada fila de canción dentro de la playlist?
R: A la izquierda, antes de la carátula

Chequeo contra los criterios de HU-12:

✅ Estrella clickeable en cada canción dentro de una playlist (a la izquierda, como pediste).
✅ Estado visualmente distinto: ★ dorado (activa) vs ☆ gris (inactiva).
✅ Filtro "Solo favoritas" tipo pill, junto a las de orden.
✅ Persiste al recargar: toggleFavorita llama a guardarPlaylists, y favorita viaja intacta a través del ...item en rehidratarPlaylists de HU-10 — no hizo falta tocar storage.js.