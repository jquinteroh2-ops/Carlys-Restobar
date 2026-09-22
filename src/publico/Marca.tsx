/**
 * La marca de la casa: el emblema junto al nombre.
 *
 * El emblema es la «C» inicial del logotipo —la que lleva la silueta calada
 * dentro—, separada del resto de las letras. El logotipo completo sí lleva
 * «Carly's» escrito, pero aquí el nombre ya va al lado como texto: usar el
 * logotipo entero pondría el nombre dos veces, una junto a otra.
 *
 * ── De dónde sale ────────────────────────────────────────────────────────────
 * La casa no tiene el logotipo en alta resolución: lo único que existe es el
 * avatar de Instagram, un JPG de 150 px. De ahí se calcó a vector
 * (`public/logo.svg` y `public/emblema.svg`, en claro y sin fondo), y esos
 * dos SVG son desde entonces el original: los PNG de iconos y de la imagen
 * para compartir se sacaron de ellos. Si algún día aparece el archivo del
 * diseñador, se reemplazan los dos SVG y se vuelven a exportar los PNG.
 * ─────────────────────────────────────────────────────────────────────────────
 */

interface Props {
  /** Alto del emblema en píxeles. */
  tamano?: number
  className?: string
}

export function Emblema({ tamano = 34, className = '' }: Props) {
  return (
    /*
     * El emblema solo, en claro sobre el negro: sin disco, sin halo, sin
     * marco. Cualquier cosa alrededor lo convierte en un sello, y la casa
     * quiere que se lea como una firma.
     */
    <span
      className={`inline-flex shrink-0 items-center justify-center ${className}`}
      style={{ width: tamano, height: tamano }}
    >
      <img
        src="/emblema.svg"
        alt=""
        /*
         * `alt` vacío y `aria-hidden`: el nombre «CARLY’S» va como texto justo
         * al lado. Con un alt descriptivo, un lector de pantalla leería «Carly’s,
         * Carly’s» —el emblema y el texto—, que es el error clásico al poner un
         * logo junto a su propio nombre.
         */
        aria-hidden
        /*
         * `width` y `height` explícitos: sin ellos el navegador no reserva el
         * espacio hasta que la imagen carga, y el encabezado da un salto con
         * la página ya a la vista.
         */
        width={tamano}
        height={tamano}
        /*
         * El emblema viene sin fondo, así que se asienta directamente sobre
         * lo que tenga detrás.
         */
        style={{ width: tamano, height: tamano }}
      />
    </span>
  )
}

/**
 * El bloque completo del encabezado: emblema y nombre, con el halo detrás.
 *
 * Va junto en un componente porque el resplandor abarca las dos cosas: el
 * usuario lo pidió así y además es lo que hace que se lean como una sola marca
 * y no como una imagen al lado de unas letras.
 */
export function MarcaConNombre({ className = '' }: { className?: string }) {
  // El nombre en la geométrica fina, en mayúsculas y muy espaciado: es la
  // firma de la casa, y se escribe como se escribe el nombre de un hotel.
  return (
    <span className={`flex items-center gap-2 sm:gap-3 ${className}`}>
      <Emblema tamano={28} className="sm:hidden" />
      <Emblema tamano={32} className="hidden sm:inline-flex" />
      <span className="font-marca text-sm font-normal uppercase tracking-[0.25em] sm:text-lg sm:tracking-[0.35em]">
        Carly’s
      </span>
    </span>
  )
}
