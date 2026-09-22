import { useEffect, useRef, useState } from 'react'
import { CheckCircle2, Copy, FileText, Loader2, Search, Upload } from 'lucide-react'
import * as api from '@/compartido/mockApi'
import type { ConfiguracionPqr, ConsultaPqr, EstadoPqr, Radicada } from '@/compartido/mockApi'
import { RESTAURANTE } from '@/compartido/config'
import { formatoFecha, formatoFechaHora } from '@/compartido/formato'
import { Rotulo, Titular } from './Piezas'

const PESO_MAXIMO = 5 * 1024 * 1024

const CAMPO =
  'w-full min-h-toque border border-carbon-600 bg-carbon-900 px-4 text-hueso-100 transition ' +
  'placeholder:text-hueso-100/35 focus:border-dorado-400 focus:outline-none [color-scheme:dark]'

const ETIQUETA = 'mb-2 block text-[0.7rem] font-medium uppercase tracking-[0.2em] text-hueso-100/60'

const ESTADOS: Record<EstadoPqr, string> = {
  radicada: 'Radicada',
  en_tramite: 'En trámite',
  resuelta: 'Resuelta',
  cerrada: 'Cerrada',
}

type Pestana = 'radicar' | 'consultar'

export default function Pqr() {
  const [pestana, setPestana] = useState<Pestana>('radicar')

  return (
    <div className="mx-auto max-w-2xl px-5 py-12 sm:py-16">
      <header>
        <Rotulo>PQR</Rotulo>
        <Titular nivel="h1" className="mt-5">
          Peticiones, quejas y sugerencias
        </Titular>
        <p className="mt-4 max-w-lg text-base leading-relaxed text-hueso-100/70">
          Cuéntenos qué pasó. Toda solicitud recibe un número de radicado y una respuesta.
        </p>
      </header>

      {/* Dos pestañas y no dos páginas: quien viene a consultar suele llegar
          desde el correo del acuse, y buscar un enlace distinto sería una
          fricción de más para alguien que ya está molesto. */}
      <div className="mt-8 inline-flex gap-1 bg-carbon-900 p-1">
        {(
          [
            ['radicar', 'Radicar una solicitud'],
            ['consultar', 'Consultar mi radicado'],
          ] as [Pestana, string][]
        ).map(([id, etiqueta]) => (
          <button
            key={id}
            type="button"
            onClick={() => setPestana(id)}
            className={`min-h-[40px] px-4 transition text-xs font-semibold uppercase tracking-[0.18em] ${
              pestana === id
                ? 'bg-dorado-500 text-carbon-950 border border-dorado-500'
                : 'text-hueso-100/65 hover:text-hueso-50'
            }`}
          >
            {etiqueta}
          </button>
        ))}
      </div>

      {pestana === 'radicar' ? <Radicar /> : <Consultar />}
    </div>
  )
}

// ---------------------------------------------------------------------------

function Radicar() {
  const [config, setConfig] = useState<ConfiguracionPqr | null>(null)
  const [archivo, setArchivo] = useState<File | null>(null)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [radicada, setRadicada] = useState<Radicada | null>(null)
  const [copiado, setCopiado] = useState(false)
  const formulario = useRef<HTMLFormElement>(null)

  useEffect(() => {
    void api.configuracionPqr().then(setConfig).catch(() => setConfig(null))
  }, [])

  const elegirArchivo = (elegido: File | null) => {
    setError(null)
    if (!elegido) {
      setArchivo(null)
      return
    }
    if (elegido.size > PESO_MAXIMO) {
      setError('El adjunto no puede pesar más de 5 MB.')
      setArchivo(null)
      return
    }
    setArchivo(elegido)
  }

  const enviar = async (evento: React.FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    setEnviando(true)
    setError(null)
    try {
      const datos = new FormData(evento.currentTarget)
      if (archivo) datos.set('adjunto', archivo)
      else datos.delete('adjunto')
      setRadicada(await api.radicarPqr(datos))
      formulario.current?.reset()
      setArchivo(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo radicar la solicitud.')
    } finally {
      setEnviando(false)
    }
  }

  const copiar = async () => {
    if (!radicada) return
    try {
      await navigator.clipboard.writeText(radicada.radicado)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    } catch {
      // Sin portapapeles disponible el número sigue en pantalla para copiarlo
      // a mano. No vale la pena mostrar un error por esto.
    }
  }

  // ---- Después de radicar ----
  if (radicada) {
    return (
      <div className="py-12">
        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-dorado-500 text-dorado-300">
          <CheckCircle2 className="h-7 w-7" aria-hidden />
        </span>
        <Titular className="mt-6">Solicitud radicada</Titular>

        {/* El número, grande y copiable. Es su comprobante: sin él no puede
            volver a consultar, y quien acaba de quejarse no está en ánimo de
            transcribir a mano. */}
        <div className="mt-6 inline-flex items-center gap-3 bg-dorado-500 px-5 py-4">
          <span className="font-titulo text-xl text-dorado-200 font-light leading-tight">
            {radicada.radicado}
          </span>
          <button
            type="button"
            onClick={() => void copiar()}
            aria-label="Copiar el número de radicado"
            className="p-2 text-dorado-300 transition hover:bg-carbon-800"
          >
            {copiado ? (
              <CheckCircle2 className="h-4 w-4" aria-hidden />
            ) : (
              <Copy className="h-4 w-4" aria-hidden />
            )}
          </button>
        </div>

        <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-hueso-100/70">
          {radicada.mensaje}
        </p>
        {radicada.fechaLimiteRespuesta && (
          <p className="mx-auto mt-2 max-w-md text-sm text-hueso-100/55">
            Tenemos plazo para responderle hasta el{' '}
            {formatoFecha(radicada.fechaLimiteRespuesta)}.
          </p>
        )}

        <button
          type="button"
          onClick={() => setRadicada(null)}
          className="mt-8 min-h-toque px-5 text-hueso-100 transition hover:text-dorado-300 border border-hueso-100/20 hover:border-dorado-400 text-xs font-semibold uppercase tracking-[0.18em]"
        >
          Radicar otra
        </button>
      </div>
    )
  }

  return (
    <form ref={formulario} onSubmit={enviar} className="mt-8 space-y-5">
      {/* El señuelo. Ver `Trabaja.tsx`. */}
      <div className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden" aria-hidden>
        <label htmlFor="pqr-sitioWeb">Sitio web</label>
        <input id="pqr-sitioWeb" name="sitioWeb" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label className={ETIQUETA} htmlFor="tipo">
          Tipo de solicitud
        </label>
        <select id="tipo" name="tipo" required defaultValue="" className={CAMPO}>
          <option value="" disabled>
            Seleccione
          </option>
          {(config?.tipos ?? []).map((t) => (
            <option key={t.id} value={t.id}>
              {t.etiqueta}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={ETIQUETA} htmlFor="pqr-nombre">
            Nombre completo
          </label>
          <input
            id="pqr-nombre"
            name="nombreCompleto"
            required
            autoComplete="name"
            className={CAMPO}
          />
        </div>
        <div>
          <label className={ETIQUETA} htmlFor="pqr-email">
            Correo electrónico
          </label>
          <input
            id="pqr-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={CAMPO}
            placeholder="Por aquí le respondemos"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={ETIQUETA} htmlFor="pqr-telefono">
            Teléfono <span className="normal-case tracking-normal">(opcional)</span>
          </label>
          <input
            id="pqr-telefono"
            name="telefono"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            className={CAMPO}
          />
        </div>
        <div>
          <label className={ETIQUETA} htmlFor="fechaVisita">
            Fecha de la visita <span className="normal-case tracking-normal">(opcional)</span>
          </label>
          <input id="fechaVisita" name="fechaVisita" type="date" className={CAMPO} />
        </div>
      </div>

      <div>
        <label className={ETIQUETA} htmlFor="asunto">
          Asunto
        </label>
        <input
          id="asunto"
          name="asunto"
          required
          maxLength={120}
          className={CAMPO}
          placeholder="En una línea, de qué se trata"
        />
      </div>

      <div>
        <label className={ETIQUETA} htmlFor="descripcion">
          Cuéntenos qué pasó
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          required
          rows={6}
          maxLength={2000}
          className={`${CAMPO} min-h-[9rem] py-3`}
          placeholder="Con el detalle que quiera darnos: qué pidió, a qué hora, quién lo atendió."
        />
      </div>

      {/* ---------- Adjunto ---------- */}
      <div>
        <span className={ETIQUETA}>
          Adjunto <span className="normal-case tracking-normal">(opcional)</span>
        </span>
        <label
          htmlFor="adjunto"
          className="flex cursor-pointer items-center gap-3 border border-dashed border-carbon-600 bg-carbon-900 px-4 py-4 transition hover:border-dorado-400/60"
        >
          {archivo ? (
            <FileText className="h-5 w-5 shrink-0 text-dorado-300" aria-hidden />
          ) : (
            <Upload className="h-5 w-5 shrink-0 text-hueso-100/40" aria-hidden />
          )}
          <span className="min-w-0 flex-1 text-sm">
            {archivo ? (
              <>
                <span className="block truncate text-hueso-100">{archivo.name}</span>
                <span className="text-xs text-hueso-100/50">toque para cambiar</span>
              </>
            ) : (
              <>
                <span className="block text-hueso-100/80">
                  Adjunte una foto o un documento si ayuda
                </span>
                {/* Se aceptan imágenes y no solo PDF a propósito: quien se queja
                    tiene la foto del plato o del recibo en el celular, y
                    obligarlo a convertirla desde el teléfono es como se pierde
                    una queja legítima. */}
                <span className="text-xs text-hueso-100/50">Imagen o PDF, máximo 5 MB</span>
              </>
            )}
          </span>
        </label>
        <input
          id="adjunto"
          name="adjunto"
          type="file"
          accept="image/jpeg,image/png,application/pdf,.jpg,.jpeg,.png,.pdf"
          className="sr-only"
          onChange={(e) => elegirArchivo(e.target.files?.[0] ?? null)}
        />
      </div>

      <label className="flex cursor-pointer items-start gap-3 bg-carbon-900 p-4">
        <input
          type="checkbox"
          name="autorizacionDatos"
          value="true"
          required
          className="mt-0.5 h-5 w-5 shrink-0 accent-dorado-500"
        />
        <span className="text-sm leading-relaxed text-hueso-100/70">
          Autorizo a {RESTAURANTE.nombreCompleto} el tratamiento de mis datos personales para
          atender esta solicitud, conforme a la Ley 1581 de 2012 y a su{' '}
          <a
            href="/politica-de-datos"
            className="text-dorado-300 underline underline-offset-2 hover:text-dorado-200"
          >
            política de tratamiento de datos
          </a>
          .
        </span>
      </label>

      {config && (
        <p className="text-xs leading-relaxed text-hueso-100/45">
          Respondemos dentro de los {config.diasHabilesDeRespuesta} días hábiles siguientes a la
          radicación.
        </p>
      )}

      {error && (
        <p
          role="alert"
          className="bg-estado-demorado/10 px-4 py-3 text-sm text-estado-demorado"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={enviando}
        className="flex min-h-toque w-full items-center justify-center gap-2 bg-dorado-500 px-6 text-carbon-950 transition hover:bg-dorado-400 disabled:opacity-60 text-xs font-semibold uppercase tracking-[0.18em]"
      >
        {enviando && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
        {enviando ? 'Radicando…' : 'Radicar solicitud'}
      </button>
    </form>
  )
}

// ---------------------------------------------------------------------------

function Consultar() {
  const [buscando, setBuscando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resultado, setResultado] = useState<ConsultaPqr | null>(null)

  const consultar = async (evento: React.FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    const datos = new FormData(evento.currentTarget)
    setBuscando(true)
    setError(null)
    setResultado(null)
    try {
      setResultado(
        await api.consultarPqr(String(datos.get('radicado')), String(datos.get('email'))),
      )
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo consultar.')
    } finally {
      setBuscando(false)
    }
  }

  return (
    <div className="mt-8">
      <form onSubmit={consultar} className="space-y-5">
        <div>
          <label className={ETIQUETA} htmlFor="radicado">
            Número de radicado
          </label>
          <input
            id="radicado"
            name="radicado"
            required
            className={CAMPO}
            placeholder="PQR-2026-00047"
          />
        </div>
        <div>
          <label className={ETIQUETA} htmlFor="consulta-email">
            Correo con el que radicó
          </label>
          <input
            id="consulta-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={CAMPO}
          />
          {/* Se dice por qué se piden los dos: sin explicación parece un
              trámite de más, y con ella se entiende que protege al propio
              solicitante. */}
          <p className="mt-2 text-xs text-hueso-100/45">
            Pedimos los dos datos para que nadie más pueda ver su solicitud.
          </p>
        </div>

        {error && (
          <p
            role="alert"
            className="bg-estado-demorado/10 px-4 py-3 text-sm text-estado-demorado"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={buscando}
          className="flex min-h-toque w-full items-center justify-center gap-2 px-6 text-hueso-100 transition hover:text-dorado-300 disabled:opacity-60 border border-hueso-100/20 hover:border-dorado-400 text-xs font-semibold uppercase tracking-[0.18em]"
        >
          {buscando ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <Search className="h-4 w-4" aria-hidden />
          )}
          {buscando ? 'Consultando…' : 'Consultar'}
        </button>
      </form>

      {resultado && (
        <article className="mt-8 bg-carbon-900 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="font-titulo text-lg text-dorado-200 font-light leading-tight">
              {resultado.radicado}
            </span>
            <span className="border border-dorado-500/60 px-3 py-1 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-dorado-300">
              {ESTADOS[resultado.estado]}
            </span>
          </div>

          <h3 className="mt-4 font-titulo text-xl text-hueso-100 font-light leading-tight">{resultado.asunto}</h3>

          <dl className="mt-4 space-y-2 text-sm text-hueso-100/65">
            <div className="flex justify-between gap-4">
              <dt>Radicada</dt>
              <dd>{formatoFechaHora(resultado.fechaRadicacion)}</dd>
            </div>
            {resultado.fechaLimiteRespuesta && !resultado.fechaRespuesta && (
              <div className="flex justify-between gap-4">
                <dt>Plazo de respuesta</dt>
                <dd>{formatoFecha(resultado.fechaLimiteRespuesta)}</dd>
              </div>
            )}
            {resultado.fechaRespuesta && (
              <div className="flex justify-between gap-4">
                <dt>Respondida</dt>
                <dd>{formatoFechaHora(resultado.fechaRespuesta)}</dd>
              </div>
            )}
          </dl>

          {resultado.respuesta ? (
            <div className="mt-5 border-t border-carbon-700 pt-4">
              <p className="mb-2 text-xs text-dorado-300 font-semibold">
                Nuestra respuesta
              </p>
              <p className="whitespace-pre-line text-sm leading-relaxed text-hueso-100/85">
                {resultado.respuesta}
              </p>
            </div>
          ) : (
            <p className="mt-5 border-t border-carbon-700 pt-4 text-sm text-hueso-100/55">
              Su solicitud está en trámite. Le responderemos al correo con el que la radicó.
            </p>
          )}
        </article>
      )}
    </div>
  )
}
