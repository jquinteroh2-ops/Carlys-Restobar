import { useEffect, useRef, useState } from 'react'
import { CheckCircle2, FileText, Loader2, Upload } from 'lucide-react'
import * as api from '@/compartido/mockApi'
import type { CargoDeInteres, TipoDocumento } from '@/compartido/mockApi'
import { RESTAURANTE } from '@/compartido/config'
import { Rotulo, Titular } from './Piezas'

const DOCUMENTOS: { id: TipoDocumento; etiqueta: string }[] = [
  { id: 'CC', etiqueta: 'Cédula de ciudadanía' },
  { id: 'CE', etiqueta: 'Cédula de extranjería' },
  { id: 'PEP', etiqueta: 'Permiso Especial de Permanencia' },
  { id: 'PPT', etiqueta: 'Permiso por Protección Temporal' },
  { id: 'TI', etiqueta: 'Tarjeta de identidad' },
]

/** Cinco megas. El mismo tope que aplica el servidor. */
const PESO_MAXIMO = 5 * 1024 * 1024

const CAMPO =
  'w-full min-h-toque border border-carbon-600 bg-carbon-900 px-4 text-hueso-100 transition ' +
  'placeholder:text-hueso-100/35 focus:border-dorado-400 focus:outline-none [color-scheme:dark]'

const ETIQUETA = 'mb-2 block text-[0.7rem] font-medium uppercase tracking-[0.2em] text-hueso-100/60'

export default function Trabaja() {
  const [cargos, setCargos] = useState<CargoDeInteres[]>([])
  const [archivo, setArchivo] = useState<File | null>(null)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [enviada, setEnviada] = useState<string | null>(null)
  const formulario = useRef<HTMLFormElement>(null)

  useEffect(() => {
    void api.cargosDeInteres().then(setCargos).catch(() => setCargos([]))
  }, [])

  /**
   * Comprueba el archivo antes de mandarlo.
   *
   * El servidor lo vuelve a mirar —y por los bytes, no por el nombre—, pero
   * avisar aquí ahorra subir cinco megas por datos móviles para que el servidor
   * los rechace. Esto es cortesía, no seguridad.
   */
  const elegirArchivo = (elegido: File | null) => {
    setError(null)
    if (!elegido) {
      setArchivo(null)
      return
    }
    if (elegido.size > PESO_MAXIMO) {
      setError('La hoja de vida no puede pesar más de 5 MB.')
      setArchivo(null)
      return
    }
    if (!elegido.name.toLowerCase().endsWith('.pdf')) {
      setError('La hoja de vida tiene que ser un archivo PDF.')
      setArchivo(null)
      return
    }
    setArchivo(elegido)
  }

  const enviar = async (evento: React.FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    if (!archivo) {
      setError('Falta adjuntar la hoja de vida en PDF.')
      return
    }

    setEnviando(true)
    setError(null)
    try {
      const datos = new FormData(evento.currentTarget)
      datos.set('hojaDeVida', archivo)
      const respuesta = await api.enviarPostulacion(datos)
      setEnviada(respuesta.mensaje)
      formulario.current?.reset()
      setArchivo(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo enviar la hoja de vida.')
    } finally {
      setEnviando(false)
    }
  }

  // ---- Después de enviar ----
  if (enviada) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-16 sm:py-24">
        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-dorado-500 text-dorado-300">
          <CheckCircle2 className="h-7 w-7" aria-hidden />
        </span>
        <Titular nivel="h1" className="subir demora-1 mt-6">
          Hoja de vida recibida
        </Titular>
        <p className="mt-4 max-w-md text-hueso-100/70">{enviada}</p>
        <button
          type="button"
          onClick={() => setEnviada(null)}
          className="boton-relleno mt-8 min-h-toque px-5 text-hueso-100 border border-hueso-100/20 text-xs font-semibold uppercase tracking-[0.18em]"
        >
          Enviar otra
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-12 sm:py-16">
      <header>
        <Rotulo className="subir">Empleo</Rotulo>
        <Titular nivel="h1" className="subir demora-1 mt-5">
          Trabaja con nosotros
        </Titular>
        <p className="subir demora-2 mt-4 max-w-lg text-base leading-relaxed text-hueso-100/70">
          Déjenos su hoja de vida. Si su perfil encaja con una vacante en{' '}
          {RESTAURANTE.nombreCompleto}, nos comunicamos con usted.
        </p>
      </header>

      <form ref={formulario} onSubmit={enviar} className="subir demora-3 mt-10 space-y-5" noValidate={false}>
        {/*
          El señuelo. Va escondido de forma que ni se vea ni entre en el orden
          de tabulación ni lo lea un lector de pantalla: una persona nunca lo
          llena, y un robot que rellena todo lo que encuentra sí. `display:none`
          bastaría, pero algunos robots omiten justamente lo que está oculto
          así; sacarlo de la pantalla con posición absoluta lo deja «visible»
          para ellos y fuera de la vista para todos los demás.
        */}
        <div className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden" aria-hidden>
          <label htmlFor="sitioWeb">Sitio web</label>
          <input id="sitioWeb" name="sitioWeb" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <div>
          <label className={ETIQUETA} htmlFor="nombreCompleto">
            Nombre completo
          </label>
          <input
            id="nombreCompleto"
            name="nombreCompleto"
            required
            autoComplete="name"
            className={CAMPO}
            placeholder="Como aparece en su documento"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={ETIQUETA} htmlFor="tipoDocumento">
              Tipo de documento
            </label>
            <select id="tipoDocumento" name="tipoDocumento" required defaultValue="CC" className={CAMPO}>
              {DOCUMENTOS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.etiqueta}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={ETIQUETA} htmlFor="numeroDocumento">
              Número de identificación
            </label>
            <input
              id="numeroDocumento"
              name="numeroDocumento"
              required
              inputMode="numeric"
              className={CAMPO}
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={ETIQUETA} htmlFor="email">
              Correo electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className={CAMPO}
              placeholder="nombre@correo.com"
            />
          </div>
          <div>
            <label className={ETIQUETA} htmlFor="telefono">
              Teléfono o WhatsApp
            </label>
            <input
              id="telefono"
              name="telefono"
              type="tel"
              required
              autoComplete="tel"
              inputMode="tel"
              className={CAMPO}
              placeholder="300 000 0000"
            />
          </div>
        </div>

        <div>
          <label className={ETIQUETA} htmlFor="cargoInteres">
            Cargo de interés
          </label>
          <select id="cargoInteres" name="cargoInteres" required defaultValue="" className={CAMPO}>
            <option value="" disabled>
              Seleccione un cargo
            </option>
            {cargos.map((c) => (
              <option key={c.id} value={c.id}>
                {c.etiqueta}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={ETIQUETA} htmlFor="mensaje">
            Cuéntenos algo de usted <span className="normal-case tracking-normal">(opcional)</span>
          </label>
          <textarea
            id="mensaje"
            name="mensaje"
            rows={4}
            maxLength={500}
            className={`${CAMPO} min-h-[7rem] py-3`}
            placeholder="Su experiencia, su disponibilidad, lo que quiera contarnos."
          />
        </div>

        {/* ---------- Hoja de vida ---------- */}
        <div>
          <span className={ETIQUETA}>Hoja de vida (PDF)</span>
          <label
            htmlFor="hojaDeVida"
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
                  <span className="text-xs text-hueso-100/50">
                    {(archivo.size / 1024).toFixed(0)} KB · toque para cambiar
                  </span>
                </>
              ) : (
                <>
                  <span className="block text-hueso-100/80">Toque para adjuntar su hoja de vida</span>
                  <span className="text-xs text-hueso-100/50">Solo PDF, máximo 5 MB</span>
                </>
              )}
            </span>
          </label>
          <input
            id="hojaDeVida"
            name="hojaDeVida"
            type="file"
            accept="application/pdf,.pdf"
            className="sr-only"
            onChange={(e) => elegirArchivo(e.target.files?.[0] ?? null)}
          />
        </div>

        {/* ---------- Habeas data ----------
            Obligatorio por la Ley 1581 de 2012. Sin marcarlo el servidor no
            recibe la hoja de vida, y no es una formalidad: sin autorización el
            restaurante no puede guardar estos datos. */}
        <label className="flex cursor-pointer items-start gap-3 bg-carbon-900 p-4">
          <input
            type="checkbox"
            name="autorizacionDatos"
            value="true"
            required
            className="mt-0.5 h-5 w-5 shrink-0 accent-dorado-500"
          />
          <span className="text-sm leading-relaxed text-hueso-100/70">
            Autorizo a {RESTAURANTE.nombreCompleto} el tratamiento de mis datos personales
            con fines de selección de personal, conforme a la Ley 1581 de 2012 y a su{' '}
            <a
              href="/politica-de-datos"
              className="text-dorado-300 underline underline-offset-2 hover:text-dorado-200"
            >
              política de tratamiento de datos
            </a>
            .
          </span>
        </label>

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
          className="boton-brillo flex min-h-toque w-full items-center justify-center gap-2 bg-dorado-500 px-6 text-carbon-950 transition hover:bg-dorado-400 disabled:opacity-60 text-xs font-semibold uppercase tracking-[0.18em]"
        >
          {enviando && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
          {enviando ? 'Enviando…' : 'Enviar hoja de vida'}
        </button>
      </form>
    </div>
  )
}
