import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Instagram, MapPin, MessageCircle, Phone } from 'lucide-react'
import { DATOS_FISCALES, RESTAURANTE } from '@/compartido/config'
import { enlaceInstagram, useFichaSitio } from '@/compartido/sitio'
import { enlaceWhatsApp } from '@/compartido/whatsapp'
import { MarcaConNombre } from './Marca'
import { OtroRestaurante } from './OtroRestaurante'

const SALUDO_WHATSAPP = `Hola, quisiera información sobre ${RESTAURANTE.nombreCompleto}.`

export default function LayoutPublico() {
  const { pathname } = useLocation()
  // Direccion, telefono y redes salen de la base: los edita el panel.
  const ficha = useFichaSitio()

  // Arriba del todo el encabezado se funde con la portada; al bajar aparece
  // su fondo y una sombra, para que se separe de lo que pasa por debajo.
  const [bajo, setBajo] = useState(false)
  useEffect(() => {
    const medir = () => setBajo(window.scrollY > 12)
    medir()
    window.addEventListener('scroll', medir, { passive: true })
    return () => window.removeEventListener('scroll', medir)
  }, [])
  const whatsapp = enlaceWhatsApp(ficha.whatsapp, SALUDO_WHATSAPP)

  return (
    <div className="flex min-h-dvh flex-col bg-carbon-950 text-hueso-100">
      <header
        className={`sticky top-0 z-40 border-b backdrop-blur transition-[background-color,border-color,box-shadow] duration-500 ${
          bajo
            ? 'border-carbon-800 bg-carbon-950/95 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.9)]'
            : 'border-transparent bg-carbon-950/40'
        }`}
      >
        {/* Altura fija: la barra de categorías de la carta se pega debajo (top-16). */}
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          {/* El símbolo y el nombre son UN solo enlace al inicio, no dos: dos
              enlaces contiguos al mismo sitio obligan a un lector de pantalla a
              anunciarlo dos veces, y con el teclado hay que pasar dos veces por
              lo mismo. */}
          <Link to="/" className="group text-hueso-50 transition hover:text-dorado-300">
            <MarcaConNombre />
          </Link>

          {/* El menú es texto, pequeño y espaciado; la página activa lleva una
              línea dorada debajo. El único bloque de color es «Reservar», que
              es lo que la casa quiere que se haga. */}
          <div className="flex items-center gap-3.5 text-[0.65rem] font-medium uppercase tracking-[0.14em] sm:gap-8 sm:text-[0.7rem] sm:tracking-[0.22em]">
            <NavLink to="/carta" className={enlace}>
              Carta
            </NavLink>
            <NavLink to="/pedir" className={enlace}>
              Pedir
            </NavLink>
            {/* «Trabaja con nosotros» se esconde en móvil y queda en el pie,
                donde lo busca quien lo busca a propósito. */}
            <NavLink
              to="/trabaja-con-nosotros"
              className={(estado) => `hidden md:inline-flex ${enlace(estado)}`}
            >
              Empleo
            </NavLink>
            <NavLink
              to="/reservar"
              className="boton-brillo inline-flex min-h-[40px] items-center bg-dorado-500 px-3 text-carbon-950 hover:bg-dorado-400 sm:px-5"
            >
              Reservar
            </NavLink>
          </div>
        </nav>
      </header>

      <main key={pathname} className="entrada-de-panel flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-carbon-800 bg-carbon-950">
        {/* Una línea dorada fina arriba: cierra la página con la marca. */}
        <div className="h-px bg-gradient-to-r from-transparent via-dorado-500/60 to-transparent" />

        <div className="mx-auto max-w-6xl px-5 pt-14 pb-10 sm:px-6 sm:pt-16">
          {/* Móvil: la marca y la dirección a lo ancho, los dos grupos de
              enlaces lado a lado. Tableta: dos columnas. Escritorio: cuatro. */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-x-10 lg:grid-cols-[1.5fr_1.2fr_1fr_1fr] lg:gap-12">
            <div className="col-span-2 sm:col-span-1 lg:col-span-1">
              <Link to="/" className="inline-block text-hueso-50 transition hover:text-dorado-300">
                <MarcaConNombre />
              </Link>
              <p className="mt-5 max-w-xs text-sm leading-relaxed text-hueso-100/55">
                {RESTAURANTE.lema}. {RESTAURANTE.descripcionCorta} en {ficha.ciudad}.
              </p>
              <div className="mt-6 flex items-center gap-3">
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Escríbenos por WhatsApp"
                  className={redSocial}
                >
                  <MessageCircle className="h-[18px] w-[18px]" strokeWidth={1.5} aria-hidden />
                </a>
                <a
                  href={enlaceInstagram(ficha.instagram)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Instagram @${ficha.instagram}`}
                  className={redSocial}
                >
                  <Instagram className="h-[18px] w-[18px]" strokeWidth={1.5} aria-hidden />
                </a>
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 lg:col-span-1">
              <p className={titulo}>Visítanos</p>
              <a
                href={RESTAURANTE.fichaMaps}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-5 items-start ${enlacePie}`}
              >
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-dorado-400" strokeWidth={1.5} aria-hidden />
                <span className="leading-relaxed">
                  {ficha.direccion}
                  <br />
                  {ficha.ciudad}
                </span>
              </a>
              <a href={`tel:${ficha.telefono.replace(/[^\d+]/g, '')}`} className={`mt-4 ${enlacePie}`}>
                <Phone className="h-4 w-4 shrink-0 text-dorado-400" strokeWidth={1.5} aria-hidden />
                <span className="tabular-nums">{ficha.telefono}</span>
              </a>
              <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={`mt-4 ${enlacePie}`}>
                <MessageCircle className="h-4 w-4 shrink-0 text-dorado-400" strokeWidth={1.5} aria-hidden />
                WhatsApp
              </a>
            </div>

            <nav aria-label="El restaurante">
              <p className={titulo}>Carly’s</p>
              <ul className="mt-5 space-y-3.5">
                <li><Link to="/carta" className={enlacePie}>Carta</Link></li>
                <li><Link to="/pedir" className={enlacePie}>Pedir a domicilio</Link></li>
                <li><Link to="/reservar" className={enlacePie}>Reservar mesa</Link></li>
              </ul>
            </nav>

            <nav aria-label="Atención">
              <p className={titulo}>Atención</p>
              <ul className="mt-5 space-y-3.5">
                <li><Link to="/trabaja-con-nosotros" className={enlacePie}>Trabaja con nosotros</Link></li>
                {/* PQR va en el pie y NO en el encabezado: es un canal de
                    servicio, no un llamado a la accion comercial. */}
                <li><Link to="/pqr" className={enlacePie}>Peticiones y quejas</Link></li>
                <li><Link to="/politica-de-datos" className={enlacePie}>Política de datos</Link></li>
              </ul>
            </nav>
          </div>

          <div className="mt-12">
            <OtroRestaurante />
          </div>
        </div>

        <div className="border-t border-carbon-800">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-5 py-6 text-center text-xs text-hueso-100/40 sm:flex-row sm:justify-between sm:px-6 sm:text-left">
            <span>
              © {new Date().getFullYear()} {RESTAURANTE.nombreCompleto} · {ficha.ciudad}
              {/* El NIT solo sale cuando ya está el del RUT: un «por definir»
                  a la vista del cliente se ve a medio hacer. */}
              {DATOS_FISCALES.nit ? ` · NIT ${DATOS_FISCALES.nitCompleto}` : ''}
            </span>
            {/* Acceso del personal: existe, pero no compite con la carta ni la reserva. */}
            <Link to="/acceso" className="uppercase tracking-[0.18em] transition hover:text-dorado-300">
              Acceso personal
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

const titulo = 'text-[0.7rem] font-medium uppercase tracking-[0.3em] text-dorado-400'

const enlacePie =
  'flex gap-3 text-sm text-hueso-100/70 transition hover:text-dorado-300'

const redSocial =
  'inline-flex h-10 w-10 items-center justify-center rounded-full border border-hueso-100/15 text-hueso-100/70 transition hover:border-dorado-400 hover:text-dorado-300'

function enlace({ isActive }: { isActive: boolean }) {
  // El subrayado dorado crece al pasar el cursor y se queda en la activa.
  return `subrayado py-1 transition ${
    isActive ? 'activo text-hueso-50' : 'text-hueso-100/60 hover:text-hueso-50'
  }`
}
