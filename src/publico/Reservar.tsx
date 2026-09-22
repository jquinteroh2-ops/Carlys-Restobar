import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Check, MessageCircle } from 'lucide-react'
import * as api from '@/compartido/mockApi'
import { useFichaSitio } from '@/compartido/sitio'
import { claveDia, formatoFechaLarga, formatoHora } from '@/compartido/formato'
import { enlaceWhatsApp } from '@/compartido/whatsapp'
import type { Ocasion } from '@/compartido/tipos'
import { Rotulo, Titular } from './Piezas'

const OCASIONES: { id: Ocasion; etiqueta: string }[] = [
  { id: 'ninguna', etiqueta: 'Sin ocasión especial' },
  { id: 'cumpleanos', etiqueta: 'Cumpleaños' },
  { id: 'aniversario', etiqueta: 'Aniversario' },
  { id: 'negocios', etiqueta: 'Negocios' },
]

/** Horas de servicio, en pasos de media hora. */
const HORAS = Array.from({ length: 21 }, (_, i) => {
  const minutos = 12 * 60 + i * 30
  const h = Math.floor(minutos / 60)
  return `${String(h).padStart(2, '0')}:${minutos % 60 === 0 ? '00' : '30'}`
})

const CAMPO =
  'w-full min-h-[52px] border border-carbon-600 bg-carbon-900 px-4 text-hueso-100 transition ' +
  'placeholder:text-hueso-100/35 focus:border-dorado-400 focus:outline-none [color-scheme:dark]'

export default function Reservar() {
  const ficha = useFichaSitio()
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [fecha, setFecha] = useState(claveDia())
  const [hora, setHora] = useState('19:00')
  const [personas, setPersonas] = useState(2)
  const [ocasion, setOcasion] = useState<Ocasion>('ninguna')
  const [notas, setNotas] = useState('')

  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [enviada, setEnviada] = useState<{ fechaHora: string } | null>(null)

  const enviar = async (evento: FormEvent) => {
    evento.preventDefault()
    setError(null)

    const digitos = telefono.replace(/\D/g, '')
    if (digitos.length < 10) {
      setError('Escribe un número de celular de 10 dígitos para poder confirmarte.')
      return
    }

    setEnviando(true)
    try {
      const fechaHora = new Date(`${fecha}T${hora}:00`).toISOString()
      await api.crearReserva({
        nombreCliente: nombre.trim(),
        telefono: digitos,
        fechaHora,
        personas,
        ocasion,
        notas: notas.trim() || undefined,
      })
      setEnviada({ fechaHora })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo enviar la solicitud')
    } finally {
      setEnviando(false)
    }
  }

  // ---- Confirmación ----
  if (enviada) {
    return (
      <section className="mx-auto max-w-xl px-5 py-16 sm:py-24">
        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-dorado-500 text-dorado-300">
          <Check className="h-7 w-7" aria-hidden />
        </span>

        <Titular nivel="h1" className="mt-6">
          Recibimos tu solicitud
        </Titular>
        <p className="mt-4 text-lg text-hueso-100/75">Te confirmamos por WhatsApp.</p>

        <div className="mt-8 bg-carbon-900 p-6">
          <dl className="space-y-2.5 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-hueso-100/55">A nombre de</dt>
              <dd className="text-hueso-100">{nombre}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-hueso-100/55">Día</dt>
              <dd className="text-right text-hueso-100">{formatoFechaLarga(enviada.fechaHora)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-hueso-100/55">Hora</dt>
              <dd className="text-hueso-100">{formatoHora(enviada.fechaHora)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-hueso-100/55">Personas</dt>
              <dd className="text-hueso-100">{personas}</dd>
            </div>
          </dl>
        </div>

        <p className="mx-auto mt-7 max-w-md text-sm leading-relaxed text-hueso-100/55">
          La reserva queda apartada cuando te escribamos. Si necesitas algo antes, escríbenos
          directamente.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href={enlaceWhatsApp(
              ficha.whatsapp,
              `Hola, acabo de solicitar una reserva a nombre de ${nombre} para el ${formatoFechaLarga(enviada.fechaHora)} a las ${formatoHora(enviada.fechaHora)}.`,
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[52px] items-center justify-center gap-2 px-8 text-hueso-100 transition hover:text-dorado-300 border border-hueso-100/20 hover:border-dorado-400 text-xs font-semibold uppercase tracking-[0.18em]"
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            Escribir por WhatsApp
          </a>
          <Link
            to="/carta"
            className="min-h-[52px] bg-dorado-500 px-8 leading-[52px] text-carbon-950 transition hover:bg-dorado-400 text-xs font-semibold uppercase tracking-[0.18em]"
          >
            Ver la carta
          </Link>
        </div>
      </section>
    )
  }

  // ---- Formulario ----
  return (
    <section className="mx-auto max-w-xl px-5 py-16">
      <div>
        <Rotulo>Reservas</Rotulo>
        <Titular nivel="h1" tamano="grande" className="mt-5">
          Reserve su mesa
        </Titular>
        <p className="mt-5 max-w-md text-base leading-relaxed text-hueso-100/70">
          Déjenos sus datos y le confirmamos por WhatsApp. Toma menos de un minuto.
        </p>
      </div>

      <form onSubmit={enviar} className="mt-10 space-y-5">
        <label className="block">
          <span className="mb-2 block text-[0.7rem] font-medium uppercase tracking-[0.2em] text-hueso-100/60">
            Nombre completo
          </span>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            autoComplete="name"
            placeholder="Carolina Mendoza"
            className={CAMPO}
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-[0.7rem] font-medium uppercase tracking-[0.2em] text-hueso-100/60">
            Celular
          </span>
          <input
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            required
            inputMode="tel"
            autoComplete="tel"
            placeholder="300 123 4567"
            className={CAMPO}
          />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="mb-2 block text-[0.7rem] font-medium uppercase tracking-[0.2em] text-hueso-100/60">
              Día
            </span>
            <input
              type="date"
              value={fecha}
              min={claveDia()}
              onChange={(e) => setFecha(e.target.value)}
              required
              className={CAMPO}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-[0.7rem] font-medium uppercase tracking-[0.2em] text-hueso-100/60">
              Hora
            </span>
            <select value={hora} onChange={(e) => setHora(e.target.value)} className={CAMPO}>
              {HORAS.map((h) => (
                <option key={h} value={h}>
                  {formatoHora(new Date(`2026-01-01T${h}:00`))}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div>
          <span className="mb-2 block text-[0.7rem] font-medium uppercase tracking-[0.2em] text-hueso-100/60">
            ¿Cuántas personas?
          </span>
          <div className="flex flex-wrap gap-2">
            {[2, 3, 4, 6, 8, 10, 12].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setPersonas(n)}
                className={`min-h-[48px] w-14 text-base transition ${
                  personas === n
                    ? 'bg-dorado-500 text-carbon-950 border border-dorado-500'
                    : 'text-hueso-100/70 border border-hueso-100/20 hover:border-dorado-400 hover:text-dorado-300'
                }`}
              >
                {n}
              </button>
            ))}
            <input
              inputMode="numeric"
              value={personas}
              onChange={(e) => setPersonas(Math.max(1, Number(e.target.value.replace(/\D/g, '')) || 1))}
              aria-label="Otro número de personas"
              className="min-h-[48px] w-20 bg-carbon-900 px-3 text-center text-hueso-100 focus:outline-none border border-carbon-600 focus:border-dorado-400"
            />
          </div>
        </div>

        <div>
          <span className="mb-2 block text-[0.7rem] font-medium uppercase tracking-[0.2em] text-hueso-100/60">
            Ocasión <span className="normal-case tracking-normal text-hueso-100/35">(opcional)</span>
          </span>
          <div className="flex flex-wrap gap-2">
            {OCASIONES.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => setOcasion(o.id)}
                className={`min-h-[48px] px-4 transition text-xs font-semibold uppercase tracking-[0.18em] ${
                  ocasion === o.id
                    ? 'bg-dorado-500 text-carbon-950 border border-dorado-500'
                    : 'text-hueso-100/70 border border-hueso-100/20 hover:border-dorado-400 hover:text-dorado-300'
                }`}
              >
                {o.etiqueta}
              </button>
            ))}
          </div>
        </div>

        <label className="block">
          <span className="mb-2 block text-[0.7rem] font-medium uppercase tracking-[0.2em] text-hueso-100/60">
            Algo que debamos saber{' '}
            <span className="normal-case tracking-normal text-hueso-100/35">(opcional)</span>
          </span>
          <textarea
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            rows={3}
            placeholder="Preferencia de mesa, alergias, decoración…"
            className={`${CAMPO} py-3`}
          />
        </label>

        {error && (
          <p className="px-4 py-3 text-sm border border-estado-demorado/40 bg-estado-demorado/10 text-hueso-100">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={enviando}
          className="min-h-[56px] w-full bg-dorado-500 text-sm text-carbon-950 transition hover:bg-dorado-400 disabled:opacity-60 font-semibold"
        >
          {enviando ? 'Enviando…' : 'Solicitar reserva'}
        </button>

        <p className="text-center text-xs leading-relaxed text-hueso-100/45">
          Es una solicitud, no una reserva confirmada. Le escribimos por WhatsApp para apartarla.
        </p>
      </form>
    </section>
  )
}
