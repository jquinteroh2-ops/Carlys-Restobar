import type { ReactNode } from 'react'

type Tono = 'neutro' | 'listo' | 'proceso' | 'demorado' | 'reservada' | 'oro'

const TONOS: Record<Tono, string> = {
  neutro: 'bg-noche-800 text-noche-300',
  listo: 'bg-estado-listo/20 text-estado-listo',
  proceso: 'bg-estado-proceso/20 text-estado-proceso',
  demorado: 'bg-estado-demorado/20 text-estado-demorado',
  reservada: 'bg-estado-reservada/20 text-estado-reservada',
  oro: 'bg-dorado-500 text-carbon-950',
}

interface Props {
  tono?: Tono
  children: ReactNode
  className?: string
}

export function Insignia({ tono = 'neutro', children, className = '' }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-sm px-2 py-0.5 text-xs font-semibold ${TONOS[tono]} ${className}`}
    >
      {children}
    </span>
  )
}
