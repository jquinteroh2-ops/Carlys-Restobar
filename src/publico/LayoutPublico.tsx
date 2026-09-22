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
  const whatsapp = enlaceWhatsApp(ficha.whatsapp, SALUDO_WHATSAPP)

  return (
    <div className="flex min-h-dvh flex-col bg-carbon-950 text-hueso-100">
      <header className="sticky top-0 z-40 border-b border-carbon-800 bg-carbon-950/95 backdrop-blur">
        {/* Altura fija: la barra de categorías de la carta se pega debajo (top-16). */}
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          {/* El símbolo y el nombre son UN solo enlace al inicio, no dos: dos
              enlaces contiguos al mismo sitio obligan a un lector de pantalla a
              anunciarlo dos veces, y con el teclado hay que pasar dos veces por
              lo mismo. */}
          <Link to="/" className="text-hueso-50 transition hover:text-dorado-300">
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
              className="inline-flex min-h-[40px] items-center bg-dorado-500 px-3 text-carbon-950 transition hover:bg-dorado-400 sm:px-5"
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
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:grid-cols-3 sm:px-6">
          <div>
            <span className="text-hueso-50">
              <MarcaConNombre />
            </span>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-hueso-100/55">
              {RESTAURANTE.lema}. {RESTAURANTE.descripcionCorta} en {ficha.ciudad}.
            </p>
          </div>

          <div>
            <p className={titulo}>Visítanos</p>
            <p className="mt-4 flex items-start gap-3 text-sm leading-relaxed text-hueso-100/70">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-dorado-400" strokeWidth={1.5} aria-hidden />
              <span>
                {ficha.direccion}
                <br />
                {ficha.ciudad}
              </span>
            </p>
            <p className="mt-3 flex items-center gap-3 text-sm text-hueso-100/70">
              <Phone className="h-4 w-4 shrink-0 text-dorado-400" strokeWidth={1.5} aria-hidden />
              {ficha.telefono}
            </p>
          </div>

          <div>
            <p className={titulo}>Escríbenos</p>
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center gap-3 text-sm text-hueso-100/70 transition hover:text-dorado-300"
            >
              <MessageCircle className="h-4 w-4 shrink-0 text-dorado-400" strokeWidth={1.5} aria-hidden />
              WhatsApp
            </a>
            <a
              href={enlaceInstagram(ficha.instagram)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center gap-3 text-sm text-hueso-100/70 transition hover:text-dorado-300"
            >
              <Instagram className="h-4 w-4 shrink-0 text-dorado-400" strokeWidth={1.5} aria-hidden />
              @{ficha.instagram}
            </a>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <OtroRestaurante />
        </div>

        <div className="border-t border-carbon-800">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 text-[0.7rem] uppercase tracking-[0.18em] text-hueso-100/40 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <span>
              {RESTAURANTE.nombreCompleto} · NIT {DATOS_FISCALES.nitCompleto}
            </span>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <Link to="/trabaja-con-nosotros" className="transition hover:text-dorado-300">
                Trabaja con nosotros
              </Link>
              {/* PQR va en el pie y NO en el encabezado: es un canal de
                  servicio, no un llamado a la accion comercial. */}
              <Link to="/pqr" className="transition hover:text-dorado-300">
                PQR
              </Link>
              <Link to="/politica-de-datos" className="transition hover:text-dorado-300">
                Política de datos
              </Link>
              {/* Acceso del personal: existe, pero no compite con la carta ni la reserva. */}
              <Link to="/acceso" className="transition hover:text-dorado-300">
                Acceso personal
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

const titulo = 'text-[0.7rem] font-medium uppercase tracking-[0.3em] text-dorado-400'

function enlace({ isActive }: { isActive: boolean }) {
  return `border-b py-1 transition ${
    isActive
      ? 'border-dorado-500 text-hueso-50'
      : 'border-transparent text-hueso-100/60 hover:text-hueso-50'
  }`
}
