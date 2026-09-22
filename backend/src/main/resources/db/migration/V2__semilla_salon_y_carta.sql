-- Datos operativos de arranque: salon y carta de Carly’s Restobar.
--
-- ─────────────────────────────────────────────────────────────────────────────
-- ESTA CARTA ES UN MARCADOR DE POSICION, NO LA CARTA DE LA CASA.
--
-- Son las categorias, los platos y los precios tipicos de un restobar de la
-- region, puestos aqui para que el sistema arranque con algo que se pueda
-- tocar: se puede tomar una orden, mandarla a cocina o a barra, cobrarla y
-- cerrar la caja el primer dia, sin esperar a que llegue el menu real.
--
-- LA CARTA DE VERDAD NO SE CARGA AQUI: se carga desde /admin/carta, que es
-- donde la edita el restaurante sin que nadie despliegue nada. Borrar estos
-- platos cuando llegue la carta real es un boton por plato, y no afecta
-- ninguna venta ya cobrada: `items_orden` guarda su propia copia del nombre y
-- del precio de cada linea, asi que una comanda de anoche sigue diciendo que
-- se vendio y a cuanto aunque el plato ya no exista.
--
-- EL SALON TAMBIEN ES UN MARCADOR. Son 23 mesas repartidas en cuatro zonas
-- —salon, barra, terraza y un privado— porque es un reparto creible para un
-- restobar; el real se arma en /admin/configuracion, mesa por mesa.
-- ─────────────────────────────────────────────────────────────────────────────
--
-- Los usuarios NO se siembran aqui: los crea SembradorUsuarios al arrancar por
-- primera vez, con claves aleatorias que se imprimen una sola vez en consola.
-- Una clave escrita en una migracion es una clave publicada.

-- Salon
INSERT INTO mesas (id, numero, nombre, zona, capacidad, estado) VALUES ('m1', 1, NULL, 'salon', 2, 'libre');
INSERT INTO mesas (id, numero, nombre, zona, capacidad, estado) VALUES ('m2', 2, NULL, 'salon', 2, 'libre');
INSERT INTO mesas (id, numero, nombre, zona, capacidad, estado) VALUES ('m3', 3, NULL, 'salon', 2, 'libre');
INSERT INTO mesas (id, numero, nombre, zona, capacidad, estado) VALUES ('m4', 4, NULL, 'salon', 2, 'libre');
INSERT INTO mesas (id, numero, nombre, zona, capacidad, estado) VALUES ('m5', 5, NULL, 'salon', 4, 'libre');
INSERT INTO mesas (id, numero, nombre, zona, capacidad, estado) VALUES ('m6', 6, NULL, 'salon', 4, 'libre');
INSERT INTO mesas (id, numero, nombre, zona, capacidad, estado) VALUES ('m7', 7, NULL, 'salon', 4, 'libre');
INSERT INTO mesas (id, numero, nombre, zona, capacidad, estado) VALUES ('m8', 8, NULL, 'salon', 4, 'libre');
INSERT INTO mesas (id, numero, nombre, zona, capacidad, estado) VALUES ('m9', 9, NULL, 'salon', 6, 'libre');
INSERT INTO mesas (id, numero, nombre, zona, capacidad, estado) VALUES ('m10', 10, NULL, 'salon', 6, 'libre');
INSERT INTO mesas (id, numero, nombre, zona, capacidad, estado) VALUES ('m11', 11, 'Barra 1', 'barra', 1, 'libre');
INSERT INTO mesas (id, numero, nombre, zona, capacidad, estado) VALUES ('m12', 12, 'Barra 2', 'barra', 1, 'libre');
INSERT INTO mesas (id, numero, nombre, zona, capacidad, estado) VALUES ('m13', 13, 'Barra 3', 'barra', 1, 'libre');
INSERT INTO mesas (id, numero, nombre, zona, capacidad, estado) VALUES ('m14', 14, 'Barra 4', 'barra', 1, 'libre');
INSERT INTO mesas (id, numero, nombre, zona, capacidad, estado) VALUES ('m15', 15, 'Barra 5', 'barra', 1, 'libre');
INSERT INTO mesas (id, numero, nombre, zona, capacidad, estado) VALUES ('m16', 16, 'Barra 6', 'barra', 1, 'libre');
INSERT INTO mesas (id, numero, nombre, zona, capacidad, estado) VALUES ('m17', 17, 'Terraza 1', 'terraza', 4, 'libre');
INSERT INTO mesas (id, numero, nombre, zona, capacidad, estado) VALUES ('m18', 18, 'Terraza 2', 'terraza', 4, 'libre');
INSERT INTO mesas (id, numero, nombre, zona, capacidad, estado) VALUES ('m19', 19, 'Terraza 3', 'terraza', 4, 'libre');
INSERT INTO mesas (id, numero, nombre, zona, capacidad, estado) VALUES ('m20', 20, 'Terraza 4', 'terraza', 4, 'libre');
INSERT INTO mesas (id, numero, nombre, zona, capacidad, estado) VALUES ('m21', 21, 'Terraza 5', 'terraza', 6, 'libre');
INSERT INTO mesas (id, numero, nombre, zona, capacidad, estado) VALUES ('m22', 22, 'Terraza 6', 'terraza', 6, 'libre');
INSERT INTO mesas (id, numero, nombre, zona, capacidad, estado) VALUES ('m23', 23, 'Privado', 'privado', 10, 'libre');

-- Categorias de la carta
INSERT INTO categorias_carta (id, nombre, orden) VALUES ('c1', 'Para picar', 1);
INSERT INTO categorias_carta (id, nombre, orden) VALUES ('c2', 'Hamburguesas y sánduches', 2);
INSERT INTO categorias_carta (id, nombre, orden) VALUES ('c3', 'Platos fuertes', 3);
INSERT INTO categorias_carta (id, nombre, orden) VALUES ('c4', 'Postres', 4);
INSERT INTO categorias_carta (id, nombre, orden) VALUES ('c5', 'Coctelería', 5);
INSERT INTO categorias_carta (id, nombre, orden) VALUES ('c6', 'Cervezas y licores', 6);
INSERT INTO categorias_carta (id, nombre, orden) VALUES ('c7', 'Bebidas sin alcohol', 7);

-- Productos
--
-- `destino` decide en que pantalla aparece la linea cuando el mesero envia el
-- turno: 'cocina' sale en la pantalla de cocina y 'bar' en la de barra. En un
-- restobar esa division es la mitad del servicio, y un coctel marcado como
-- 'cocina' es un coctel que nadie prepara.
INSERT INTO items_carta (id, categoria_id, nombre, descripcion, precio, disponible, tiempo_preparacion_min, destino, modificadores) VALUES ('p01', 'c1', 'Papas a la francesa', 'Con salsa de la casa.', 14000, TRUE, 10, 'cocina', '[]'::jsonb);
INSERT INTO items_carta (id, categoria_id, nombre, descripcion, precio, disponible, tiempo_preparacion_min, destino, modificadores) VALUES ('p02', 'c1', 'Alitas BBQ', 'Ocho alitas con salsa BBQ y aderezo ranch.', 28000, TRUE, 18, 'cocina', '[{"id":"mod_picante","nombre":"Punto de picante","tipo":"seleccion_unica","obligatorio":false,"opciones":[{"nombre":"Sin picante","precioAdicional":0},{"nombre":"Suave","precioAdicional":0},{"nombre":"Fuerte","precioAdicional":0}]}]'::jsonb);
INSERT INTO items_carta (id, categoria_id, nombre, descripcion, precio, disponible, tiempo_preparacion_min, destino, modificadores) VALUES ('p03', 'c1', 'Nachos con carne', 'Nachos gratinados con carne desmechada, guacamole y pico de gallo.', 26000, TRUE, 15, 'cocina', '[{"id":"mod_picante","nombre":"Punto de picante","tipo":"seleccion_unica","obligatorio":false,"opciones":[{"nombre":"Sin picante","precioAdicional":0},{"nombre":"Suave","precioAdicional":0},{"nombre":"Fuerte","precioAdicional":0}]}]'::jsonb);
INSERT INTO items_carta (id, categoria_id, nombre, descripcion, precio, disponible, tiempo_preparacion_min, destino, modificadores) VALUES ('p04', 'c1', 'Picada de la casa', 'Para compartir: chorizo, chicharrón, carne, papa criolla y patacón.', 48000, TRUE, 20, 'cocina', '[]'::jsonb);
INSERT INTO items_carta (id, categoria_id, nombre, descripcion, precio, disponible, tiempo_preparacion_min, destino, modificadores) VALUES ('p05', 'c1', 'Dedos de queso', 'Seis unidades con salsa de piña picante.', 22000, TRUE, 12, 'cocina', '[]'::jsonb);
INSERT INTO items_carta (id, categoria_id, nombre, descripcion, precio, disponible, tiempo_preparacion_min, destino, modificadores) VALUES ('p06', 'c1', 'Patacones con guacamole', 'Cuatro patacones con guacamole y suero costeño.', 18000, TRUE, 12, 'cocina', '[]'::jsonb);
INSERT INTO items_carta (id, categoria_id, nombre, descripcion, precio, disponible, tiempo_preparacion_min, destino, modificadores) VALUES ('p07', 'c2', 'Hamburguesa Carly’s', 'Carne de res 160 g, queso cheddar, tocineta, lechuga y tomate. Con papas.', 32000, TRUE, 18, 'cocina', '[{"id":"mod_termino","nombre":"Término de la carne","tipo":"seleccion_unica","obligatorio":true,"opciones":[{"nombre":"Sellado","precioAdicional":0},{"nombre":"Término medio","precioAdicional":0},{"nombre":"Tres cuartos","precioAdicional":0},{"nombre":"Bien asado","precioAdicional":0}]},{"id":"mod_acompanante","nombre":"Acompañante","tipo":"seleccion_unica","obligatorio":true,"opciones":[{"nombre":"Papa francesa","precioAdicional":0},{"nombre":"Patacón","precioAdicional":0},{"nombre":"Ensalada","precioAdicional":0},{"nombre":"Yuca frita","precioAdicional":0}]}]'::jsonb);
INSERT INTO items_carta (id, categoria_id, nombre, descripcion, precio, disponible, tiempo_preparacion_min, destino, modificadores) VALUES ('p08', 'c2', 'Hamburguesa de pollo', 'Pechuga apanada, queso, lechuga y salsa de la casa. Con papas.', 29000, TRUE, 18, 'cocina', '[]'::jsonb);
INSERT INTO items_carta (id, categoria_id, nombre, descripcion, precio, disponible, tiempo_preparacion_min, destino, modificadores) VALUES ('p09', 'c2', 'Sánduche de carne desmechada', 'Pan artesanal, carne desmechada, queso fundido y cebolla caramelizada.', 27000, TRUE, 15, 'cocina', '[]'::jsonb);
INSERT INTO items_carta (id, categoria_id, nombre, descripcion, precio, disponible, tiempo_preparacion_min, destino, modificadores) VALUES ('p10', 'c2', 'Perro caliente especial', 'Salchicha americana, queso, tocineta, papas al hilo y salsas.', 19000, TRUE, 12, 'cocina', '[]'::jsonb);
INSERT INTO items_carta (id, categoria_id, nombre, descripcion, precio, disponible, tiempo_preparacion_min, destino, modificadores) VALUES ('p11', 'c3', 'Churrasco 300 g', 'A la parrilla, con chimichurri y un acompañante.', 52000, TRUE, 25, 'cocina', '[{"id":"mod_termino","nombre":"Término de la carne","tipo":"seleccion_unica","obligatorio":true,"opciones":[{"nombre":"Sellado","precioAdicional":0},{"nombre":"Término medio","precioAdicional":0},{"nombre":"Tres cuartos","precioAdicional":0},{"nombre":"Bien asado","precioAdicional":0}]},{"id":"mod_acompanante","nombre":"Acompañante","tipo":"seleccion_unica","obligatorio":true,"opciones":[{"nombre":"Papa francesa","precioAdicional":0},{"nombre":"Patacón","precioAdicional":0},{"nombre":"Ensalada","precioAdicional":0},{"nombre":"Yuca frita","precioAdicional":0}]}]'::jsonb);
INSERT INTO items_carta (id, categoria_id, nombre, descripcion, precio, disponible, tiempo_preparacion_min, destino, modificadores) VALUES ('p12', 'c3', 'Pechuga a la plancha', 'Pechuga de pollo con ensalada fresca y un acompañante.', 34000, TRUE, 20, 'cocina', '[]'::jsonb);
INSERT INTO items_carta (id, categoria_id, nombre, descripcion, precio, disponible, tiempo_preparacion_min, destino, modificadores) VALUES ('p13', 'c3', 'Filete de pescado', 'Pescado del día apanado o a la plancha, con patacón y ensalada.', 42000, TRUE, 22, 'cocina', '[]'::jsonb);
INSERT INTO items_carta (id, categoria_id, nombre, descripcion, precio, disponible, tiempo_preparacion_min, destino, modificadores) VALUES ('p14', 'c3', 'Cazuela de mariscos', 'Camarón, calamar y pescado en leche de coco. Con arroz y patacón.', 55000, TRUE, 25, 'cocina', '[]'::jsonb);
INSERT INTO items_carta (id, categoria_id, nombre, descripcion, precio, disponible, tiempo_preparacion_min, destino, modificadores) VALUES ('p15', 'c4', 'Torta de chocolate', 'Porción con helado de vainilla.', 14000, TRUE, 5, 'cocina', '[]'::jsonb);
INSERT INTO items_carta (id, categoria_id, nombre, descripcion, precio, disponible, tiempo_preparacion_min, destino, modificadores) VALUES ('p16', 'c4', 'Cheesecake de frutos rojos', 'Porción individual.', 16000, TRUE, 5, 'cocina', '[]'::jsonb);
INSERT INTO items_carta (id, categoria_id, nombre, descripcion, precio, disponible, tiempo_preparacion_min, destino, modificadores) VALUES ('p17', 'c5', 'Mojito', 'Ron, hierbabuena, limón y soda.', 24000, TRUE, 6, 'bar', '[{"id":"mod_bar","nombre":"Preparación del bar","tipo":"seleccion_multiple","obligatorio":false,"opciones":[{"nombre":"Sin hielo","precioAdicional":0},{"nombre":"Menos dulce","precioAdicional":0},{"nombre":"Doble licor","precioAdicional":9000}]}]'::jsonb);
INSERT INTO items_carta (id, categoria_id, nombre, descripcion, precio, disponible, tiempo_preparacion_min, destino, modificadores) VALUES ('p18', 'c5', 'Daiquiri de fresa', 'Ron blanco, fresa y limón.', 24000, TRUE, 6, 'bar', '[{"id":"mod_bar","nombre":"Preparación del bar","tipo":"seleccion_multiple","obligatorio":false,"opciones":[{"nombre":"Sin hielo","precioAdicional":0},{"nombre":"Menos dulce","precioAdicional":0},{"nombre":"Doble licor","precioAdicional":9000}]}]'::jsonb);
INSERT INTO items_carta (id, categoria_id, nombre, descripcion, precio, disponible, tiempo_preparacion_min, destino, modificadores) VALUES ('p19', 'c5', 'Piña colada', 'Ron, crema de coco y piña.', 26000, TRUE, 6, 'bar', '[{"id":"mod_bar","nombre":"Preparación del bar","tipo":"seleccion_multiple","obligatorio":false,"opciones":[{"nombre":"Sin hielo","precioAdicional":0},{"nombre":"Menos dulce","precioAdicional":0},{"nombre":"Doble licor","precioAdicional":9000}]}]'::jsonb);
INSERT INTO items_carta (id, categoria_id, nombre, descripcion, precio, disponible, tiempo_preparacion_min, destino, modificadores) VALUES ('p20', 'c5', 'Margarita', 'Tequila, triple sec y limón.', 26000, TRUE, 6, 'bar', '[{"id":"mod_bar","nombre":"Preparación del bar","tipo":"seleccion_multiple","obligatorio":false,"opciones":[{"nombre":"Sin hielo","precioAdicional":0},{"nombre":"Menos dulce","precioAdicional":0},{"nombre":"Doble licor","precioAdicional":9000}]}]'::jsonb);
INSERT INTO items_carta (id, categoria_id, nombre, descripcion, precio, disponible, tiempo_preparacion_min, destino, modificadores) VALUES ('p21', 'c5', 'Cuba libre', 'Ron y gaseosa de cola.', 20000, TRUE, 4, 'bar', '[{"id":"mod_bar","nombre":"Preparación del bar","tipo":"seleccion_multiple","obligatorio":false,"opciones":[{"nombre":"Sin hielo","precioAdicional":0},{"nombre":"Menos dulce","precioAdicional":0},{"nombre":"Doble licor","precioAdicional":9000}]}]'::jsonb);
INSERT INTO items_carta (id, categoria_id, nombre, descripcion, precio, disponible, tiempo_preparacion_min, destino, modificadores) VALUES ('p22', 'c5', 'Gin tonic', 'Ginebra, tónica y cítricos.', 28000, TRUE, 5, 'bar', '[{"id":"mod_bar","nombre":"Preparación del bar","tipo":"seleccion_multiple","obligatorio":false,"opciones":[{"nombre":"Sin hielo","precioAdicional":0},{"nombre":"Menos dulce","precioAdicional":0},{"nombre":"Doble licor","precioAdicional":9000}]}]'::jsonb);
INSERT INTO items_carta (id, categoria_id, nombre, descripcion, precio, disponible, tiempo_preparacion_min, destino, modificadores) VALUES ('p23', 'c5', 'Copa de vino tinto', 'Copa de la casa.', 22000, TRUE, 3, 'bar', '[]'::jsonb);
INSERT INTO items_carta (id, categoria_id, nombre, descripcion, precio, disponible, tiempo_preparacion_min, destino, modificadores) VALUES ('p24', 'c6', 'Cerveza nacional', 'Botella 330 ml.', 7000, TRUE, 2, 'bar', '[]'::jsonb);
INSERT INTO items_carta (id, categoria_id, nombre, descripcion, precio, disponible, tiempo_preparacion_min, destino, modificadores) VALUES ('p25', 'c6', 'Cerveza importada', 'Botella 330 ml.', 12000, TRUE, 2, 'bar', '[]'::jsonb);
INSERT INTO items_carta (id, categoria_id, nombre, descripcion, precio, disponible, tiempo_preparacion_min, destino, modificadores) VALUES ('p26', 'c6', 'Michelada', 'Cerveza nacional preparada con limón y sal.', 10000, TRUE, 4, 'bar', '[]'::jsonb);
INSERT INTO items_carta (id, categoria_id, nombre, descripcion, precio, disponible, tiempo_preparacion_min, destino, modificadores) VALUES ('p27', 'c6', 'Botella de ron', 'Media botella, con mezcladores.', 95000, TRUE, 5, 'bar', '[]'::jsonb);
INSERT INTO items_carta (id, categoria_id, nombre, descripcion, precio, disponible, tiempo_preparacion_min, destino, modificadores) VALUES ('p28', 'c6', 'Botella de aguardiente', 'Media botella, con mezcladores.', 85000, TRUE, 5, 'bar', '[]'::jsonb);
INSERT INTO items_carta (id, categoria_id, nombre, descripcion, precio, disponible, tiempo_preparacion_min, destino, modificadores) VALUES ('p29', 'c6', 'Botella de whisky', 'Botella, con mezcladores.', 220000, TRUE, 5, 'bar', '[]'::jsonb);
INSERT INTO items_carta (id, categoria_id, nombre, descripcion, precio, disponible, tiempo_preparacion_min, destino, modificadores) VALUES ('p30', 'c7', 'Gaseosa', 'Botella personal.', 5000, TRUE, 2, 'bar', '[]'::jsonb);
INSERT INTO items_carta (id, categoria_id, nombre, descripcion, precio, disponible, tiempo_preparacion_min, destino, modificadores) VALUES ('p31', 'c7', 'Limonada natural', 'Vaso 16 oz.', 8000, TRUE, 5, 'bar', '[{"id":"mod_bar","nombre":"Preparación del bar","tipo":"seleccion_multiple","obligatorio":false,"opciones":[{"nombre":"Sin hielo","precioAdicional":0},{"nombre":"Menos dulce","precioAdicional":0},{"nombre":"Doble licor","precioAdicional":9000}]}]'::jsonb);
INSERT INTO items_carta (id, categoria_id, nombre, descripcion, precio, disponible, tiempo_preparacion_min, destino, modificadores) VALUES ('p32', 'c7', 'Limonada de coco', 'Vaso 16 oz.', 12000, TRUE, 6, 'bar', '[{"id":"mod_bar","nombre":"Preparación del bar","tipo":"seleccion_multiple","obligatorio":false,"opciones":[{"nombre":"Sin hielo","precioAdicional":0},{"nombre":"Menos dulce","precioAdicional":0},{"nombre":"Doble licor","precioAdicional":9000}]}]'::jsonb);
INSERT INTO items_carta (id, categoria_id, nombre, descripcion, precio, disponible, tiempo_preparacion_min, destino, modificadores) VALUES ('p33', 'c7', 'Jugo natural en agua', 'Mora, maracuyá, lulo o mango.', 9000, TRUE, 5, 'bar', '[{"id":"mod_bar","nombre":"Preparación del bar","tipo":"seleccion_multiple","obligatorio":false,"opciones":[{"nombre":"Sin hielo","precioAdicional":0},{"nombre":"Menos dulce","precioAdicional":0},{"nombre":"Doble licor","precioAdicional":9000}]}]'::jsonb);
INSERT INTO items_carta (id, categoria_id, nombre, descripcion, precio, disponible, tiempo_preparacion_min, destino, modificadores) VALUES ('p34', 'c7', 'Agua', 'Botella 600 ml.', 4000, TRUE, 1, 'bar', '[]'::jsonb);
