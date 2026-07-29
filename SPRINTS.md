Sprint 1 (Clase 18) — Meta: poder buscar una canción real, crear una playlist y verla con sus canciones agregadas, todo persistiendo en pantalla durante la sesión.
HU-01: Buscar canciones en el catálogo (va primero porque es la fuente de datos de la que depende todo lo demás; sin resultados no hay nada que crear ni agregar).
HU-02: Comunicar el estado de la búsqueda (se construye junto con HU-01, sobre los mismos componentes de fetch y renderizado de resultados).
HU-03: Crear una playlist (independiente de la búsqueda, pero tiene que existir antes de poder agregar algo a algún lado).
HU-04: Agregar canciones desde la búsqueda a una playlist (es el punto de unión: necesita que HU-01 y HU-03 ya funcionen).
HU-05: Ver el contenido de una playlist (cierra el sprint como la prueba visual de que HU-03 y HU-04 realmente funcionan de punta a punta).
Sprint 2 (Clase 19) — Meta: poder gestionar playlists con seguridad (borrar con confirmación), entender la música guardada (duración, estadísticas, orden) y que nada se pierda al recargar o si los datos se corrompen.
HU-06: Quitar canciones y eliminar playlists con confirmación (primero porque introduce el modal propio, una pieza de UI nueva que el resto del sprint no necesita pero que conviene tener resuelta temprano).
HU-07: Ver la duración total de una playlist (cálculo simple sobre datos que ya existen desde el sprint 1).
HU-08: Ver estadísticas de la playlist (mismo tipo de trabajo que HU-07 —cálculo derivado del estado—, así que se agrupan).
HU-09: Ordenar las canciones de una playlist (lógica de presentación sobre la lista ya renderizada, no toca el modelo de datos).
HU-10: Persistir todo y recuperarse de datos corruptos (al final, deliberadamente: envuelve la forma final del estado —playlists, canciones, fechas, orden— así que conviene implementarla cuando ya no va a cambiar la estructura de datos).
Dependencias detectadas
Para HU-04 necesito antes HU-01 y HU-03, porque agregar una canción requiere tener resultados de búsqueda y al menos una playlist destino.
Para HU-05 necesito antes HU-04, porque sin canciones agregadas la vista de detalle está siempre vacía y no se puede validar.
Para HU-06, HU-07, HU-08 y HU-09 necesito antes HU-05, porque las cuatro operan sobre la vista de detalle de playlist que HU-05 construye.
Para HU-07 y HU-09 necesito antes HU-01, porque dependen de que cada canción ya traiga su duración y su fecha de agregado (capturada en HU-04).
Para HU-10 necesito que todo el resto (HU-01 a HU-09) esté razonablemente estable, porque persiste la forma completa del estado; si el modelo de datos cambia después, hay que retocar el guardado/carga.
Mi reto técnico principal

La HU que más me intimida es HU-10 (persistir todo y recuperarse de datos corruptos), porque no es una feature aislada sino transversal: toca cada CRUD de la app (crear, agregar, quitar, ordenar), exige rehidratar correctamente las fechas al leer desde JSON (si no, HU-07 y HU-09 fallan en silencio), y requiere definir y probar de verdad qué cuenta como "dato corrupto" —rompiendo manualmente el localStorage— en vez de solo cubrir el caso feliz. Como segunda mención, HU-08 (estadísticas) también tiene su complejidad porque depende de la calidad real del campo género que devuelve la API de iTunes, que no siempre viene limpio, y necesita una regla de desempate explícita para que "más frecuente" sea consistente en cada render.