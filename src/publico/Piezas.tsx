import type { ReactNode } from 'react'

/**
 * Las piezas con las que se arma el sitio público.
 *
 * ── Por qué existen ──────────────────────────────────────────────────────────
 * Todas las páginas públicas abren igual: una etiqueta pequeña, un titular y
 * un párrafo. Cuando ese trío está escrito a mano en cada archivo, cambiar el
 * tono de la casa obliga a tocar ocho páginas y a acertar ocho veces; la que
 * se olvide se queda con el aire de antes, y nadie lo nota hasta que un
 * cliente ve las dos.
 *
 * ── El tono ──────────────────────────────────────────────────────────────────
 * Carly’s es una casa seria, y el sitio es minimalista: negro, aire y el
 * dorado solo donde hay que mirar. Tres decisiones de forma se aplican en todas
 * partes:
 *
 *   1. TODO VA A LA IZQUIERDA, con mucho espacio alrededor. Nada de adornos,
 *      ramas ni filetes decorativos: lo que no informa, sobra.
 *   2. LOS TITULARES SON FINOS Y ESPACIADOS, en una sin serifa geométrica y
 *      ligera. La elegancia la pone el peso bajo y el aire entre letras, no un
 *      remate clásico.
 *   3. ESQUINAS RECTAS. Sin pastillas ni tarjetas redondeadas: el rectángulo
 *      es lo sobrio; lo redondo es lo amable, y esta casa no busca eso.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * La etiqueta que encabeza una sección: una línea dorada corta y una palabra.
 *
 * La línea es el único dorado de la cabecera, y basta: es lo que dice «aquí
 * empieza algo» sin levantar la voz.
 */
export function Rotulo({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-dorado-400 ${className}`}
    >
      {/* Se dibuja sola: al cargar la página o cuando su bloque aparece. */}
      <span className="linea-dorada h-px w-8 bg-dorado-500" aria-hidden />
      {children}
    </span>
  )
}

/**
 * El titular de una sección.
 *
 * Peso 300 y espaciado ancho: con una geométrica fina, apretar las letras las
 * hace parecer baratas; separadas, se leen como el letrero de un hotel.
 */
export function Titular({
  children,
  className = '',
  tamano = 'normal',
  nivel = 'h2',
}: {
  children: ReactNode
  className?: string
  tamano?: 'normal' | 'grande'
  /** `h1` en la cabecera de cada página; `h2` en sus secciones. */
  nivel?: 'h1' | 'h2'
}) {
  const Etiqueta = nivel
  const medidas =
    tamano === 'grande'
      ? 'text-4xl sm:text-5xl lg:text-6xl tracking-[0.12em]'
      : 'text-2xl sm:text-3xl lg:text-4xl tracking-[0.1em]'
  return (
    <Etiqueta
      className={`font-titulo font-light uppercase leading-tight text-hueso-50 ${medidas} ${className}`}
    >
      {children}
    </Etiqueta>
  )
}

/**
 * La cabecera de una página interior: rótulo, titular grande y entradilla,
 * todo a la izquierda.
 *
 * Es la misma para la carta, las reservas, los pedidos y los formularios, y
 * por eso vive aquí: si mañana cambia el tono, cambia en un solo sitio.
 */
export function CabeceraDePagina({
  rotulo,
  titulo,
  children,
}: {
  rotulo: string
  titulo: ReactNode
  children?: ReactNode
}) {
  return (
    <header className="mx-auto max-w-6xl px-4 pb-10 pt-14 sm:px-6 sm:pt-20">
      {/* Los tres entran en cadena: rótulo, titular y entradilla. */}
      <Rotulo className="subir">{rotulo}</Rotulo>
      <Titular nivel="h1" tamano="grande" className="subir demora-1 mt-6 max-w-4xl">
        {titulo}
      </Titular>
      {children && (
        <div className="subir demora-2 mt-6 max-w-2xl text-base leading-relaxed text-hueso-100/65">
          {children}
        </div>
      )}
    </header>
  )
}
