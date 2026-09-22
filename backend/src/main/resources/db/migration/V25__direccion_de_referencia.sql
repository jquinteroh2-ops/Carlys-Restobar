-- La direccion del sitio, por referencia de esquina.
--
-- La casa no tiene una direccion con numero de placa, y el perfil no la
-- publica. Lo que si se sabe es donde esta: la ficha del negocio en Google Maps
-- («Carlys Parrilla Turbaco») pone el punto sobre la Carrera 27, junto a la
-- Calle 28, y OpenStreetMap confirma la carrera. En Turbaco la gente se ubica
-- asi, por esquinas, y el boton «Poner la ruta» lleva al punto exacto de todos
-- modos.
--
-- Solo se cambia si sigue el marcador: si alguien ya escribio la direccion
-- desde el panel, esa manda.
update ficha_sitio
   set direccion = 'Carrera 27 con Calle 28',
       actualizado_en = now()
 where id = 1
   and direccion = 'Por confirmar';
