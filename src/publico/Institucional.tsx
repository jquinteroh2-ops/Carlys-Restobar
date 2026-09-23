import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import * as api from '@/compartido/mockApi'
import type { ContenidoInstitucional } from '@/compartido/mockApi'
import { Rotulo, Titular } from './Piezas'

/**
 * La sección institucional del sitio: quiénes somos, misión, visión, valores.
 *
 * El texto no está aquí: viene de la base y lo edita el restaurante desde el
 * panel. Este componente solo sabe pintarlo.
 *
 * Si no hay nada visible —porque el restaurante todavía no escribió su texto, o
 * porque el servidor no contesta— NO se pinta la sección. Es deliberado: una
 * sección con títulos y párrafos vacíos se ve como un error del sitio, y es
 * peor que no tenerla.
 */
export default function Institucional() {
  const [bloques, setBloques] = useState<ContenidoInstitucional[]>([])

  useEffect(() => {
    void api.contenidoInstitucional().then(setBloques).catch(() => setBloques([]))
  }, [])

  if (bloques.length === 0) return null

  const [principal, ...resto] = bloques

  return (
    <section id="quienes-somos">
      <div className="revelar mx-auto max-w-6xl px-4 py-20 sm:px-6">
        {/* El primer bloque manda: es «quiénes somos» y lleva el peso visual.
            Los demás van debajo, más discretos, para que la sección tenga una
            entrada clara en vez de cuatro títulos del mismo tamaño compitiendo. */}
        <header>
          <Rotulo>Quiénes somos</Rotulo>
          <Titular className="mt-5 max-w-3xl">{principal.titulo}</Titular>
        </header>

        {/* `whitespace-pre-line` respeta los saltos de línea que escribió el
            dueño. Es todo el formato que hace falta: el cuerpo es texto plano y
            no HTML, justamente para que nadie pueda meter un script por aquí. */}
        <p className="mt-6 max-w-3xl whitespace-pre-line text-base leading-relaxed text-hueso-100/75 sm:text-lg">
          {principal.cuerpo}
        </p>

        {resto.length > 0 && (
          <div className="escalonar mt-10 grid gap-3 sm:grid-cols-2">
            {resto.map((bloque) => (
              <article key={bloque.clave} className="tarjeta-viva bg-carbon-900 p-6">
                <h3 className="font-titulo text-xl uppercase text-hueso-50 font-light tracking-[0.1em] leading-tight">
                  {bloque.titulo}
                </h3>
                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-hueso-100/70">
                  {bloque.cuerpo}
                </p>
              </article>
            ))}
          </div>
        )}

        {/* ---------- El CTA de reclutamiento ----------
            Cierra la sección institucional y no el sitio entero: quien acaba de
            leer quiénes son y qué valores tienen es exactamente quien puede
            querer trabajar ahí. En el encabezado compite con reservar; aquí no
            compite con nada. */}
        <div className="mt-12 flex flex-col gap-5 border-t border-carbon-700 pt-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-titulo text-xl uppercase text-hueso-50 font-light tracking-[0.1em] leading-tight">
            ¿Le gustaría hacer parte del equipo?
          </p>
          <Link
            to="/trabaja-con-nosotros"
            className="boton-relleno inline-flex min-h-toque shrink-0 items-center self-start border border-dorado-500 px-6 text-dorado-300 sm:self-auto text-xs font-semibold uppercase tracking-[0.18em]"
          >
            Trabaja con nosotros
          </Link>
        </div>
      </div>
    </section>
  )
}
