import { ArrowRight } from 'lucide-react'
import { HAY_RESTAURANTE_HERMANO, RESTAURANTE_HERMANO } from '@/compartido/config'

/**
 * La invitación al otro restaurante de la casa.
 *
 * El dueño tiene dos locales, y quien ya está mirando la carta de uno es
 * exactamente la persona a la que le interesa saber que existe el otro. Va en el
 * pie y no en la barra de navegación a propósito: la barra es para moverse
 * DENTRO de este sitio —la carta, la reserva, el pedido— y meterle un enlace que
 * saca al cliente del sitio compite con el botón de reservar, que es lo que este
 * restaurante quiere que se pulse.
 *
 * Es el mismo `VITE_URL_HERMANO` que usa el selector del panel administrativo:
 * la portada del otro restaurante y su panel viven en el mismo dominio. Sin esa
 * variable esto no se pinta, igual que el selector.
 *
 * No lleva emblema. El logo del otro restaurante es un archivo que este
 * proyecto no tiene y que tendría que copiarse a mano cada vez que cambie;
 * el nombre escrito envejece mejor.
 */
export function OtroRestaurante() {
  if (!HAY_RESTAURANTE_HERMANO) return null

  return (
    <div className="mt-3">
      <a
        href={RESTAURANTE_HERMANO.url}
        /*
         * En la misma pestaña, no en una nueva.
         *
         * Abrir pestañas que el usuario no pidió es de los tics que más
         * molestan en un móvil, y aquí no hace falta: el botón de atrás
         * devuelve a esta página intacta.
         */
        className="group flex flex-col gap-2 bg-carbon-900 p-6 transition hover:bg-carbon-800 sm:flex-row sm:items-center sm:gap-4"
      >
        <span className="self-start bg-dorado-500 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-carbon-950 sm:self-auto">
          La otra sede
        </span>

        <span className="flex items-center gap-2">
          <span className="font-titulo text-xl uppercase text-hueso-50 font-light tracking-[0.1em] leading-tight">
            {RESTAURANTE_HERMANO.nombreCompleto}
          </span>
          {/* La flecha se corre al pasar por encima: es lo que dice «esto lleva
              a otra parte» sin escribir «ir a». */}
          <ArrowRight
            className="h-4 w-4 shrink-0 text-dorado-300 transition-transform group-hover:translate-x-1"
            aria-hidden
          />
        </span>

        <span className="text-sm text-hueso-100/50">{RESTAURANTE_HERMANO.descripcionCorta}</span>
      </a>
    </div>
  )
}
