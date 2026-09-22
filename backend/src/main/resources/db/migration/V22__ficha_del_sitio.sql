-- La ficha del sitio: a qué horas abrimos y cómo nos encuentran.
--
-- Hasta hoy esto vivía en `src/compartido/config.ts`, escrito a mano. Cambiar
-- el horario de un festivo o corregir un dígito del teléfono costaba un
-- despliegue, que es exactamente lo que no puede pasar con el dato que más se
-- mueve del sitio. Ahora sale de aquí y lo edita recepción o administración.
--
-- El horario va en su propia tabla y no en cuatro columnas porque las franjas
-- no son cuatro por naturaleza: un restaurante parte el domingo en dos turnos,
-- otro cierra dos días. Una fila por franja deja agregar y quitar sin migrar.
--
-- Ojo con lo que NO está aquí: la franja en que se reciben domicilios sigue en
-- `ajustes` (`domicilios_desde` / `domicilios_hasta`). Son cosas distintas y se
-- separan a propósito: el salón puede estar abierto hasta medianoche mientras
-- la cocina dejó de despachar a domicilio a las nueve.

create table ficha_sitio (
    id          integer     not null primary key,
    direccion   text        not null,
    ciudad      text        not null,
    telefono    text        not null,
    -- El mismo número en el formato que exige wa.me: solo dígitos, con indicativo.
    whatsapp    text        not null,
    -- Sin arroba y sin URL: la pantalla arma el enlace.
    instagram   text        not null,
    actualizado_en timestamptz not null,
    -- Una sola fila, igual que `ajustes`: es la ficha del establecimiento, no
    -- un catálogo. El CHECK es lo que impide que un insert distraído cree una
    -- segunda y deje al sitio eligiendo cuál pintar.
    constraint ck_ficha_sitio_unica check (id = 1)
);

comment on table ficha_sitio is
  'Datos de contacto del establecimiento que se pintan en el sitio público. Fila única.';

create table franja_horario (
    id       varchar(40) not null primary key,
    -- Texto libre y no un rango de días: «Viernes y Sábado» y «Martes a Jueves»
    -- son como lo lee un cliente, y ninguna estructura de días sueltos se
    -- imprime así sin volver a componer la frase.
    dias     text        not null,
    horas    text        not null,
    orden    integer     not null
);

create index ix_franja_horario_orden on franja_horario (orden);

comment on table franja_horario is
  'Horario de atención del salón, una fila por franja, en el orden en que se pinta.';

-- ---------------------------------------------------------------------------
-- Precarga: los datos de contacto que el sitio muestra mientras nadie los toca
-- ---------------------------------------------------------------------------
--
-- Son los mismos valores de reserva que estan en config.ts, y por la misma
-- razon: que el sitio arranque diciendo algo. Desde aqui en adelante la fuente
-- de verdad es esta tabla, y se edita desde /recepcion/ajustes sin desplegar.
--
-- LA DIRECCION ESTA PENDIENTE: el perfil de la casa publica el telefono de
-- cada sede pero no la calle. Se llena desde el panel el dia que el cliente la
-- confirme; hasta entonces dice «Por confirmar», que es mejor que una
-- direccion inventada que el repartidor se crea.
--
-- EL HORARIO TAMBIEN. El de abajo es un horario tipico de restobar, puesto
-- para que la pagina no salga en blanco.

insert into ficha_sitio (id, direccion, ciudad, telefono, whatsapp, instagram, actualizado_en)
values (1, 'Por confirmar', 'Turbaco, Bolívar', '+57 314 532 0685', '573145320685',
        'carlys.restobar', now());

insert into franja_horario (id, dias, horas, orden) values
('fh-martes-jueves',   'Martes a Jueves',   '4:00 p. m. – 11:00 p. m.', 1),
('fh-viernes-sabado',  'Viernes y Sábado',  '4:00 p. m. – 2:00 a. m.',  2),
('fh-domingo',         'Domingo',           '2:00 p. m. – 11:00 p. m.', 3),
('fh-lunes',           'Lunes',             'Cerrado',                  4);
