import { useEffect, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Bike,
  CalendarDays,
  Clock,
  Flame,
  MapPin,
  MessageCircle,
  Navigation,
  Sparkles,
  Wine,
} from 'lucide-react'
import { useFichaSitio } from '@/compartido/sitio'
import { RESTAURANTE } from '@/compartido/config'
import { formatoFechaLarga } from '@/compartido/formato'
import * as api from '@/compartido/mockApi'
import type { Publicacion } from '@/compartido/tipos'
import { enlaceWhatsApp } from '@/compartido/whatsapp'
import { enlaceMapaEmbebido, enlaceRutaHacia } from './ubicacion'
import { Rotulo, Titular } from './Piezas'
import Institucional from './Institucional'

const SALUDO = `Hola, quisiera reservar una mesa en ${RESTAURANTE.nombreCompleto}.`

const DISTINTIVOS = [
  {
    icono: Flame,
    titulo: 'Cocina hasta tarde',
    texto: 'Para picar, hamburguesas y platos fuertes, sin que la cocina cierre temprano.',
  },
  {
    icono: Wine,
    titulo: 'Barra propia',
    texto: 'Cocteles clásicos, cerveza fría y botella para la mesa que se queda.',
  },
  {
    icono: Sparkles,
    titulo: 'Para cualquier plan',
    texto: 'Un after office de dos, una mesa de doce o el cumpleaños de alguien.',
  },
]

export default function Inicio() {
  // Horario y contacto salen de la base, no del codigo: los edita el panel.
  const ficha = useFichaSitio()
  const whatsapp = enlaceWhatsApp(ficha.whatsapp, SALUDO)

  // Lo que el restaurante esta anunciando ahora. Se pide aparte y sin bloquear:
  // la portada tiene que pintarse completa aunque esto no llegue, porque una
  // promocion es un extra y la carta y la reserva son el motivo de la visita.
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([])
  useEffect(() => {
    let vigente = true
    api
      .publicacionesVisibles()
      .then((datos) => {
        if (vigente) setPublicaciones(datos)
      })
      .catch(() => undefined)
    return () => {
      vigente = false
    }
  }, [])

  // Promociones y eventos van juntos: los dos anuncian algo que pasa. Las fotos
  // del local son otra cosa y tienen su propio espacio mas abajo.
  const anuncios = publicaciones.filter((p) => p.tipo !== 'galeria')
  const galeria = publicaciones.filter((p) => p.tipo === 'galeria' && p.imagen)

  return (
    <>
      {/* ---------------- Portada ----------------

          El nombre a la izquierda y, al lado, lo que la gente viene a hacer:
          PEDIR y RESERVAR. Van dentro de la portada y no más abajo porque son
          el motivo de casi todas las visitas; nadie debería tener que bajar
          para encontrarlos. En el celular quedan justo debajo del nombre, en
          la primera pantalla.

          Todo entra en cadena: rótulo, nombre letra por letra, lema y
          tarjetas. Detrás, una luz dorada muy tenue se desplaza despacio. */}
      <section className="relative overflow-hidden border-b border-carbon-800">
        <div
          aria-hidden
          className="luz-dorada pointer-events-none absolute -left-40 -top-48 h-[38rem] w-[38rem]"
        />

        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 pb-14 pt-10 sm:px-6 sm:pt-14 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16 lg:pb-20 lg:pt-16">
          <div>
            <Rotulo className="subir">{ficha.ciudad}</Rotulo>

            {/* El nombre se escribe letra por letra. Las letras sueltas van
                ocultas a los lectores de pantalla, que leen el aria-label
                entero en vez de «C, A, R…». */}
            <h1
              aria-label="Carly’s"
              className="mt-7 font-titulo text-5xl font-light uppercase leading-none tracking-[0.2em] text-hueso-50 sm:text-7xl"
            >
              {[...'Carly’s'].map((letra, i) => (
                <span
                  key={i}
                  aria-hidden
                  className="letra"
                  style={{ '--i': i } as CSSProperties}
                >
                  {letra}
                </span>
              ))}
            </h1>

            <p className="subir demora-4 mt-6 text-sm font-medium uppercase tracking-[0.3em] text-dorado-400">
              {RESTAURANTE.lema}
            </p>

            <p className="subir demora-5 mt-7 max-w-md text-base leading-relaxed text-hueso-100/65">
              Restobar en Turbaco. Cocina, barra y una mesa bien servida, para el almuerzo largo
              del sábado, el after office del jueves y las noches que se alargan.
            </p>
          </div>

          {/* ---- Lo que se viene a hacer ---- */}
          <div className="grid gap-3">
            <Link
              to="/carta"
              className="subir demora-3 tarjeta-viva group flex items-center gap-5 bg-carbon-900 p-5 sm:p-7"
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center border border-dorado-500/60 text-dorado-300">
                <Bike className="icono-flota h-6 w-6" strokeWidth={1.25} aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[0.7rem] font-medium uppercase tracking-[0.25em] text-dorado-400">
                  Domicilio o para llevar
                </span>
                <span className="mt-1.5 block font-titulo text-2xl font-light uppercase leading-tight tracking-[0.1em] text-hueso-50">
                  Hacer un pedido
                </span>
                <span className="mt-1 block text-sm text-hueso-100/60">
                  Escoge en la carta y te lo llevamos.
                </span>
              </span>
              <ArrowRight className="flecha h-5 w-5 shrink-0 text-dorado-400" strokeWidth={1.5} aria-hidden />
            </Link>

            <Link
              to="/reservar"
              className="subir demora-4 tarjeta-viva group flex items-center gap-5 bg-carbon-900 p-5 sm:p-7"
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center border border-dorado-500/60 text-dorado-300">
                <CalendarDays
                  className="icono-flota h-6 w-6 [animation-delay:1.6s]"
                  strokeWidth={1.25}
                  aria-hidden
                />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[0.7rem] font-medium uppercase tracking-[0.25em] text-dorado-400">
                  Tu mesa lista
                </span>
                <span className="mt-1.5 block font-titulo text-2xl font-light uppercase leading-tight tracking-[0.1em] text-hueso-50">
                  Reservar mesa
                </span>
                <span className="mt-1 block text-sm text-hueso-100/60">
                  Te confirmamos por WhatsApp.
                </span>
              </span>
              <ArrowRight className="flecha h-5 w-5 shrink-0 text-dorado-400" strokeWidth={1.5} aria-hidden />
            </Link>

            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="subir demora-5 boton-relleno group flex min-h-[52px] items-center justify-between border border-hueso-100/20 px-5 text-xs font-semibold uppercase tracking-[0.2em] text-hueso-100 sm:px-7"
            >
              <span className="flex items-center gap-3">
                <MessageCircle className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                Escríbenos por WhatsApp
              </span>
              <ArrowRight className="flecha h-4 w-4" strokeWidth={1.5} aria-hidden />
            </a>
          </div>
        </div>

        {/* Franja de datos prácticos, en una línea y sin iconos de colores */}
        <div className="subir demora-6 relative border-t border-carbon-800">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-5 text-xs uppercase tracking-[0.18em] text-hueso-100/55 sm:flex-row sm:items-center sm:gap-10 sm:px-6">
            {/*
              La primera franja del horario, no una frase escrita a mano: si
              alguien corrige el horario en el panel y esta linea se quedara
              fija, la portada anunciaria unas horas y la seccion de abajo otras.
            */}
            {ficha.horario[0] && (
              <span className="flex items-center gap-3">
                <Clock className="h-3.5 w-3.5 shrink-0 text-dorado-400" strokeWidth={1.5} aria-hidden />
                {ficha.horario[0].dias} · {ficha.horario[0].horas}
              </span>
            )}
            <span className="flex items-center gap-3">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-dorado-400" strokeWidth={1.5} aria-hidden />
              {ficha.direccion}, {ficha.ciudad}
            </span>
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="subrayado flex items-center gap-3 self-start transition hover:text-dorado-300 sm:self-auto"
            >
              <MessageCircle className="h-3.5 w-3.5 shrink-0 text-dorado-400" strokeWidth={1.5} aria-hidden />
              {ficha.telefono}
            </a>
          </div>
        </div>
      </section>

      {/* ---------------- Lo que esta pasando ----------------
          Promociones y eventos. Solo aparece si hay algo que anunciar: una
          seccion vacia con un «no hay promociones» ocuparia el mejor lugar de
          la portada para no decir nada. */}
      {anuncios.length > 0 && (
        <section className="border-b border-carbon-800">
          <div className="revelar mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <Rotulo>Ahora en Carly’s</Rotulo>
            <Titular className="mt-6">Lo que está pasando</Titular>

            <div className="escalonar mt-12 grid gap-px bg-carbon-800 sm:grid-cols-2">
              {anuncios.map((p) => (
                <article key={p.id} className="tarjeta-viva overflow-hidden bg-carbon-950">
                  {p.imagen && (
                    <img
                      src={api.urlImagen(p.imagen, 900)}
                      alt={p.titulo}
                      loading="lazy"
                      className="h-56 w-full object-cover"
                    />
                  )}
                  <div className="p-8">
                    <p className="text-[0.7rem] font-medium uppercase tracking-[0.25em] text-dorado-400">
                      {p.tipo === 'promocion' ? 'Promoción' : 'Evento'}
                    </p>
                    <h3 className="mt-3 font-titulo text-2xl font-light uppercase leading-tight tracking-[0.08em] text-hueso-50">
                      {p.titulo}
                    </h3>
                    {p.cuerpo && (
                      <p className="mt-4 whitespace-pre-line text-[0.95rem] leading-relaxed text-hueso-100/60">
                        {p.cuerpo}
                      </p>
                    )}
                    {/* La vigencia solo se anuncia cuando de verdad termina.
                        «Hasta siempre» no informa. */}
                    {p.hasta && (
                      <p className="mt-5 text-xs uppercase tracking-[0.18em] text-hueso-100/45">
                        Hasta el {formatoFechaLarga(p.hasta)}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------------- El local, en collage ----------------
          Las fotos no van en una rejilla pareja sino en mosaico: la primera
          manda y las demas la acompanan. Una cuadricula de recuadros iguales
          se lee como un catalogo; un collage se lee como un lugar.

          El alto de la fila es fijo y las fotos se recortan al ocupar su
          casilla. Es a proposito: fotos de celular vienen en proporciones
          distintas, y dejarlas a su aire haria que el mosaico quedara con
          escalones. */}
      {galeria.length > 0 && (
        <section className="border-b border-carbon-800">
          <div className="revelar mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <Rotulo>El local</Rotulo>
            <Titular className="mt-6">Así se ve por dentro</Titular>

            <div className="escalonar mt-12 grid auto-rows-[10rem] grid-cols-2 gap-1 sm:auto-rows-[13rem] sm:grid-cols-4">
              {galeria.map((foto, i) => (
                <figure
                  key={foto.id}
                  className={`group relative overflow-hidden ${
                    // La primera manda: ocupa cuatro casillas. Cada cuarta de
                    // las siguientes toma dos de ancho, para que el mosaico no
                    // caiga en un patron repetido y aburrido.
                    i === 0 ? 'col-span-2 row-span-2' : i % 4 === 3 ? 'col-span-2' : ''
                  }`}
                >
                  <img
                    src={api.urlImagen(foto.imagen ?? '', i === 0 ? 1000 : 600)}
                    alt={foto.titulo}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                  />
                  {/* El titulo se lee sobre la foto, no debajo: un pie de foto
                      por cada casilla romperia el mosaico. El degradado existe
                      para que el texto siga leyendose sobre una foto clara. */}
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-carbon-950/90 to-transparent px-4 pb-3 pt-10 text-xs uppercase tracking-[0.18em] text-hueso-100">
                    {foto.titulo}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------------- El lugar ---------------- */}
      <section className="border-b border-carbon-800">
        <div className="revelar escalonar mx-auto grid max-w-6xl gap-10 px-4 py-24 sm:px-6 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div>
            <Rotulo>El lugar</Rotulo>
            <Titular className="mt-6" tamano="grande">
              Mesa, barra y terraza
            </Titular>
          </div>
          <p className="self-end text-base leading-relaxed text-hueso-100/65 lg:text-lg">
            Salón para la mesa larga, barra para los que llegan de a dos y terraza para las
            noches templadas de Turbaco. Una carta que sirve igual para almorzar que para cerrar
            la noche, y una barra que se toma en serio lo que sirve.
          </p>
        </div>
      </section>

      {/* ---------------- Quiénes somos ----------------
          Va después de «el lugar» y antes de los distintivos: quien llega al
          sitio busca primero la carta y la reserva; lo institucional se lee
          cuando ya decidió mirar. Ponerlo arriba estorbaría a la mayoría. */}
      <Institucional />

      {/* ---------------- Distintivos ----------------
          Tres columnas separadas por una línea de un píxel, con el número de
          orden en dorado y el icono en trazo fino. Nada de discos de color: lo
          que se lee es el texto. */}
      <section className="border-y border-carbon-800">
        <div className="revelar escalonar mx-auto grid max-w-6xl gap-px bg-carbon-800 sm:grid-cols-3">
          {DISTINTIVOS.map(({ icono: Icono, titulo, texto }, i) => (
            <article
              key={titulo}
              className="group bg-carbon-950 px-4 py-12 transition-colors duration-500 hover:bg-carbon-900 sm:px-8"
            >
              <div className="flex items-center justify-between">
                <Icono
                  className="h-6 w-6 text-dorado-400 transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-110"
                  strokeWidth={1.25}
                  aria-hidden
                />
                <span className="font-titulo text-sm font-light tracking-[0.2em] text-dorado-400">
                  0{i + 1}
                </span>
              </div>
              <h3 className="mt-8 font-titulo text-lg font-light uppercase leading-tight tracking-[0.12em] text-hueso-50">
                {titulo}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-hueso-100/60">{texto}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ---------------- Ubicación y horario ---------------- */}
      <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <div className="revelar escalonar grid gap-16 lg:grid-cols-2">
          <div>
            <Rotulo>Encuéntrenos</Rotulo>
            <Titular className="mt-6">Dónde estamos</Titular>
            <p className="mt-6 text-base leading-relaxed text-hueso-100/75">
              {ficha.direccion}
              <br />
              {ficha.ciudad}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {/*
                Dos acciones y no una: quien esta en el sofa quiere ver donde
                queda, y quien ya salio quiere que el telefono lo lleve. El
                primer enlace abre la aplicacion nativa con la ruta empezada
                desde donde este, sin escribir el origen.
              */}
              <a
                href={enlaceRutaHacia(
                  RESTAURANTE.coordenadas.latitud,
                  RESTAURANTE.coordenadas.longitud,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="boton-brillo inline-flex min-h-toque items-center gap-2 bg-dorado-500 px-6 text-xs font-semibold uppercase tracking-[0.18em] text-carbon-950 hover:bg-dorado-400"
              >
                <Navigation className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                Poner la ruta
              </a>
              <a
                href={RESTAURANTE.fichaMaps}
                target="_blank"
                rel="noopener noreferrer"
                className="boton-relleno inline-flex min-h-toque items-center gap-2 border border-hueso-100/20 px-6 text-xs font-semibold uppercase tracking-[0.18em] text-hueso-100"
              >
                <MapPin className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                Google Maps
              </a>
            </div>
          </div>

          <div>
            <Rotulo>Horario</Rotulo>
            <Titular className="mt-6">Cuándo abrimos</Titular>
            <dl className="mt-6 divide-y divide-carbon-800 border-y border-carbon-800">
              {ficha.horario.map((franja) => (
                <div
                  key={franja.dias}
                  className="flex justify-between gap-4 py-4 transition-[padding,background-color] duration-300 hover:bg-carbon-900 hover:px-3"
                >
                  <dt className="text-sm text-hueso-100/60">{franja.dias}</dt>
                  <dd
                    className={`text-sm tabular-nums ${
                      franja.horas === 'Cerrado' ? 'text-hueso-100/35' : 'text-hueso-50'
                    }`}
                  >
                    {franja.horas}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/*
          El mapa va embebido sin llave de API: una llave en el paquete
          compilado es una llave publica, y aqui solo hay que enseñar un punto
          que nunca se mueve. `loading="lazy"` para que la portada no espere por
          el a pintarse. Va en escala de grises para que los colores de Google
          no rompan el negro y dorado de la página; el pin se sigue viendo.
        */}
        <div className="revelar mt-16 border border-carbon-800">
          <iframe
            title={`Ubicación de ${RESTAURANTE.nombreCompleto} en ${ficha.ciudad}`}
            src={enlaceMapaEmbebido(
              RESTAURANTE.coordenadas.latitud,
              RESTAURANTE.coordenadas.longitud,
            )}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-[320px] w-full border-0 grayscale sm:h-[420px]"
          />
        </div>
      </section>

    </>
  )
}
