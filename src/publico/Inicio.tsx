import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock, Flame, MapPin, MessageCircle, Navigation, Sparkles, Wine } from 'lucide-react'
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

          Negro, aire y el nombre. Nada de focos de luz, cintas ni bloques de
          color: la portada de una casa seria no compite por la atención, la
          espera. El dorado aparece en tres sitios —la línea del rótulo, el
          lema y el botón de la carta— y en ninguno más. */}
      <section className="border-b border-carbon-800">
        <div className="mx-auto max-w-6xl px-4 pb-20 pt-20 sm:px-6 sm:pb-28 sm:pt-32">
          <Rotulo>{ficha.ciudad}</Rotulo>

          <h1 className="mt-8 font-titulo text-5xl font-light uppercase leading-none tracking-[0.2em] text-hueso-50 sm:text-7xl lg:text-8xl">
            Carly’s
          </h1>

          <p className="mt-6 text-sm font-medium uppercase tracking-[0.3em] text-dorado-400">
            {RESTAURANTE.lema}
          </p>

          <p className="mt-10 max-w-lg text-base leading-relaxed text-hueso-100/65">
            Restobar en Turbaco. Cocina, barra y una mesa bien servida, para el almuerzo largo
            del sábado, el after office del jueves y las noches que se alargan.
          </p>

          <div className="mt-12 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/carta"
              className="inline-flex min-h-[52px] items-center justify-center bg-dorado-500 px-10 text-xs font-semibold uppercase tracking-[0.2em] text-carbon-950 transition hover:bg-dorado-400"
            >
              Ver la carta
            </Link>
            <Link
              to="/reservar"
              className="inline-flex min-h-[52px] items-center justify-center border border-hueso-100/20 px-10 text-xs font-semibold uppercase tracking-[0.2em] text-hueso-100 transition hover:border-dorado-400 hover:text-dorado-300"
            >
              Reservar mesa
            </Link>
          </div>
        </div>

        {/* Franja de datos prácticos, en una línea y sin iconos de colores */}
        <div className="border-t border-carbon-800">
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
              {ficha.ciudad}
            </span>
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 transition hover:text-dorado-300"
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

            <div className="entrada-escalonada mt-12 grid gap-px bg-carbon-800 sm:grid-cols-2">
              {anuncios.map((p) => (
                <article key={p.id} className="bg-carbon-950">
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

            <div className="mt-12 grid auto-rows-[10rem] grid-cols-2 gap-1 sm:auto-rows-[13rem] sm:grid-cols-4">
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
        <div className="revelar mx-auto grid max-w-6xl gap-10 px-4 py-24 sm:px-6 lg:grid-cols-[1fr_1fr] lg:gap-20">
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
        <div className="revelar mx-auto grid max-w-6xl gap-px bg-carbon-800 sm:grid-cols-3">
          {DISTINTIVOS.map(({ icono: Icono, titulo, texto }, i) => (
            <article key={titulo} className="bg-carbon-950 px-4 py-12 sm:px-8">
              <div className="flex items-center justify-between">
                <Icono className="h-6 w-6 text-dorado-400" strokeWidth={1.25} aria-hidden />
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
        <div className="revelar grid gap-16 lg:grid-cols-2">
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
                className="inline-flex min-h-toque items-center gap-2 bg-dorado-500 px-6 text-xs font-semibold uppercase tracking-[0.18em] text-carbon-950 transition hover:bg-dorado-400"
              >
                <Navigation className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                Poner la ruta
              </a>
              <a
                href={RESTAURANTE.fichaMaps}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-toque items-center gap-2 border border-hueso-100/20 px-6 text-xs font-semibold uppercase tracking-[0.18em] text-hueso-100 transition hover:border-dorado-400 hover:text-dorado-300"
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
                <div key={franja.dias} className="flex justify-between gap-4 py-4">
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
        <div className="mt-16 border border-carbon-800">
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

      {/* ---------------- Cierre ----------------
          Un marco fino dorado alrededor de la invitación a reservar: es lo
          último que se ve y la única acción que importa, así que es el único
          recuadro dorado de la página. */}
      <section className="px-4 pb-24 sm:px-6">
        <div className="revelar mx-auto max-w-6xl border border-dorado-500/50 px-6 py-16 text-center sm:px-12">
          <p className="text-[0.7rem] font-medium uppercase tracking-[0.3em] text-dorado-400">
            Reservas
          </p>
          <Titular tamano="grande" className="mx-auto mt-6 max-w-2xl">
            Reserve su mesa
          </Titular>
          <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-hueso-100/65">
            Cuéntenos la fecha y la ocasión. Le confirmamos por WhatsApp y dejamos todo listo.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/reservar"
              className="inline-flex min-h-[52px] items-center justify-center bg-dorado-500 px-10 text-xs font-semibold uppercase tracking-[0.2em] text-carbon-950 transition hover:bg-dorado-400"
            >
              Solicitar reserva
            </Link>
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[52px] items-center justify-center gap-2 border border-hueso-100/20 px-10 text-xs font-semibold uppercase tracking-[0.2em] text-hueso-100 transition hover:border-dorado-400 hover:text-dorado-300"
            >
              <MessageCircle className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
