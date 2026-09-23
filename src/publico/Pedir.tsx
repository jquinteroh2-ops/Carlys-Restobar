import { useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Bike, Check, Clock, Crosshair, MapPin, ShoppingBag, Trash2 } from 'lucide-react'
import * as api from '@/compartido/mockApi'
import type { PedidoCreado } from '@/compartido/mockApi'
import { DIGITOS_TELEFONO } from '@/compartido/config'
import { useFichaSitio } from '@/compartido/sitio'
import { formatoCOP } from '@/compartido/formato'
import { useSyncedState } from '@/compartido/useSyncedState'
import type {
  EstadoCanal,
  MetodoPago,
  TipoPedido,
  UbicacionEntrega,
  ZonaDomicilio,
} from '@/compartido/tipos'
import { MapaEntrega } from '@/componentes/MapaEntrega'
import { useCarrito, precioLinea } from './carrito'
import { PRECISION_ACEPTABLE_METROS, pedirUbicacion } from './ubicacion'
import { Titular } from './Piezas'

/**
 * Confirmación del pedido desde el sitio público.
 *
 * Todas las validaciones que hay aquí se repiten en el servidor. Esta capa
 * existe para que el cliente no se equivoque y se entere en el momento; la del
 * servidor existe porque un `fetch` a mano se salta esta pantalla, no aquella.
 */

type Canal = Exclude<TipoPedido, 'mesa'>

const METODOS: { valor: MetodoPago; etiqueta: string }[] = [
  { valor: 'efectivo', etiqueta: 'Efectivo' },
  { valor: 'tarjeta', etiqueta: 'Tarjeta' },
  { valor: 'transferencia', etiqueta: 'Transferencia' },
]

/** Un celular colombiano tiene diez dígitos y empieza por 3. */
const telefonoValido = (valor: string): boolean => {
  const digitos = valor.replace(/\D/g, '')
  return digitos.length === DIGITOS_TELEFONO && digitos.startsWith('3')
}

export default function Pedir() {
  const navegar = useNavigate()
  const carrito = useCarrito()
  const ficha = useFichaSitio()

  const { datos: canal } = useSyncedState<EstadoCanal | null>(
    () => api.estadoCanal(),
    null,
    [],
    ['pedidos', 'ajustes', 'todo'],
  )

  const [tipo, setTipo] = useState<Canal>('domicilio')
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [direccion, setDireccion] = useState('')
  const [zonaId, setZonaId] = useState('')
  const [metodo, setMetodo] = useState<MetodoPago>('efectivo')
  const [notas, setNotas] = useState('')

  // La ubicación es opcional en todo momento: si el cliente no la comparte, el
  // pedido entra igual y la dirección escrita es la que manda.
  const [ubicacion, setUbicacion] = useState<UbicacionEntrega | null>(null)
  const [buscandoUbicacion, setBuscandoUbicacion] = useState(false)
  const [avisoUbicacion, setAvisoUbicacion] = useState<string | null>(null)

  const [intentado, setIntentado] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmado, setConfirmado] = useState<PedidoCreado | null>(null)

  const zonas = canal?.zonas ?? []
  const zona: ZonaDomicilio | undefined = zonas.find((z) => z.id === zonaId)

  const costoEnvio = tipo === 'domicilio' ? (zona?.tarifa ?? 0) : 0
  const minimo = tipo === 'domicilio' ? (zona?.montoMinimo ?? 0) : 0
  const faltaParaElMinimo = Math.max(0, minimo - carrito.subtotal)

  const problemas = useMemo(() => {
    const lista: string[] = []
    if (!nombre.trim()) lista.push('Escriba su nombre')
    if (!telefonoValido(telefono)) lista.push('El teléfono debe tener 10 dígitos y empezar por 3')
    if (tipo === 'domicilio') {
      if (!zonaId) lista.push('Escoja el barrio')
      if (!direccion.trim()) lista.push('Escriba la dirección')
      if (faltaParaElMinimo > 0) {
        lista.push(`Faltan ${formatoCOP(faltaParaElMinimo)} para el mínimo de ${zona?.nombre}`)
      }
    }
    if (carrito.lineas.length === 0) lista.push('El pedido está vacío')
    return lista
  }, [nombre, telefono, tipo, zonaId, direccion, faltaParaElMinimo, zona, carrito.lineas.length])

  const tomarUbicacion = async () => {
    setBuscandoUbicacion(true)
    setAvisoUbicacion(null)
    const resultado = await pedirUbicacion()
    setBuscandoUbicacion(false)

    switch (resultado.estado) {
      case 'lista':
        setUbicacion(resultado.ubicacion)
        break
      case 'negada':
        setAvisoUbicacion(
          'No autorizó la ubicación. No hay problema: llegamos con la dirección que escribió.',
        )
        break
      case 'sin_soporte':
        setAvisoUbicacion('Su navegador no puede compartir la ubicación. Siga con la dirección.')
        break
      case 'fallo':
        setAvisoUbicacion(resultado.mensaje)
        break
    }
  }

  const enviar = async (evento: FormEvent) => {
    evento.preventDefault()
    setIntentado(true)
    setError(null)
    if (problemas.length > 0) return

    setEnviando(true)
    try {
      const creado = await api.crearPedidoExterno({
        tipo,
        nombre: nombre.trim(),
        telefono: telefono.replace(/\D/g, ''),
        direccion: tipo === 'domicilio' ? direccion.trim() : undefined,
        barrio: tipo === 'domicilio' ? zona?.nombre : undefined,
        zonaDomicilioId: tipo === 'domicilio' ? zonaId : undefined,
        metodoPagoPrevisto: metodo,
        notas: notas.trim() || undefined,
        // Solo viaja si el cliente la compartió y el pedido es a domicilio.
        latitud: tipo === 'domicilio' ? ubicacion?.latitud : undefined,
        longitud: tipo === 'domicilio' ? ubicacion?.longitud : undefined,
        precisionMetros: tipo === 'domicilio' ? ubicacion?.precisionMetros : undefined,
        items: carrito.lineas.map((l) => ({
          itemCartaId: l.itemCartaId,
          cantidad: l.cantidad,
          modificadoresSeleccionados: l.modificadores,
          notaCocina: l.nota,
        })),
      })
      // El carrito se vacía solo cuando el servidor confirmó: si falla, lo que
      // el cliente escogió sigue ahí y no tiene que armarlo otra vez.
      carrito.vaciar()
      setConfirmado(creado)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo enviar el pedido')
    } finally {
      setEnviando(false)
    }
  }

  // ---------------------------------------------------------------------------
  // Confirmación
  // ---------------------------------------------------------------------------

  if (confirmado) {
    return (
      <div className="mx-auto max-w-lg px-5 py-16 sm:py-20">
        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-dorado-500 text-dorado-300">
          <Check className="h-7 w-7" aria-hidden />
        </span>
        <Titular nivel="h1" className="subir demora-1 mt-6">
          Pedido recibido
        </Titular>

        {/* El número, grande y en dorado: es lo que el cliente va a dictar
            si llama, así que tiene que ser lo más grande de la pantalla. */}
        <div className="mt-8 border-l-2 border-dorado-500 bg-carbon-900 p-6">
          <p className="text-[0.7rem] font-medium uppercase tracking-[0.25em] text-hueso-100/55">
            Su número de pedido
          </p>
          <p className="mt-2 font-titulo text-7xl font-light leading-none text-dorado-300">
            {confirmado.numero}
          </p>
        </div>

        {confirmado.minutosEstimados && (
          <p className="mt-6 inline-flex items-center gap-2 text-base text-hueso-100/75">
            <Clock className="h-4 w-4 text-dorado-300" aria-hidden />
            {tipo === 'domicilio'
              ? `Se lo llevamos en unos ${confirmado.minutosEstimados} minutos`
              : `Puede recogerlo en unos ${confirmado.minutosEstimados} minutos`}
          </p>
        )}

        <p className="mt-6 text-sm leading-relaxed text-hueso-100/60">
          Le confirmamos por WhatsApp al {telefono}. Si necesita cambiar algo, escríbanos a ese
          mismo número.
        </p>

        <div className="mt-6 p-4 text-left text-sm bg-carbon-900">
          <div className="flex justify-between text-hueso-100/70">
            <span>Productos</span>
            <span className="tabular-nums">{formatoCOP(confirmado.cuenta.subtotal)}</span>
          </div>
          <div className="flex justify-between text-hueso-100/70">
            <span>Impuesto al consumo {confirmado.cuenta.porcentajeInc}%</span>
            <span className="tabular-nums">{formatoCOP(confirmado.cuenta.inc)}</span>
          </div>
          {confirmado.cuenta.costoEnvio > 0 && (
            <div className="flex justify-between text-hueso-100/70">
              <span>Domicilio</span>
              <span className="tabular-nums">{formatoCOP(confirmado.cuenta.costoEnvio)}</span>
            </div>
          )}
          <div className="mt-2 flex justify-between border-t border-carbon-700 pt-2 font-titulo text-lg text-hueso-100 font-light leading-tight">
            <span>Total</span>
            <span className="tabular-nums text-dorado-300">
              {formatoCOP(confirmado.cuenta.total)}
            </span>
          </div>
        </div>

        <Link
          to="/carta"
          className="boton-relleno mt-8 inline-flex min-h-[48px] items-center gap-2 px-5 text-hueso-100 border border-hueso-100/20 text-xs font-semibold uppercase tracking-[0.18em]"
        >
          Volver a la carta
        </Link>
      </div>
    )
  }

  // ---------------------------------------------------------------------------
  // Canal cerrado o carrito vacío
  // ---------------------------------------------------------------------------

  if (carrito.lineas.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-5 py-16 sm:py-24">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-carbon-900">
          <ShoppingBag className="h-6 w-6 text-hueso-100/60" aria-hidden />
        </span>
        <Titular nivel="h1" className="subir demora-1 mt-6">
          Todavía no ha escogido nada
        </Titular>
        <p className="mt-3 text-sm text-hueso-100/60">
          Mire la carta y agregue lo que quiera pedir.
        </p>
        <Link
          to="/carta"
          className="boton-relleno mt-8 inline-flex min-h-[48px] items-center gap-2 px-5 text-hueso-100 border border-hueso-100/20 text-xs font-semibold uppercase tracking-[0.18em]"
        >
          Ver la carta
        </Link>
      </div>
    )
  }

  if (canal && !canal.abierto) {
    const hora = (t: string) => t.slice(0, 5)
    return (
      <div className="mx-auto max-w-lg px-5 py-16 sm:py-24">
        <Titular nivel="h1">
          {canal.pausado ? 'No estamos recibiendo pedidos' : 'Estamos fuera de horario'}
        </Titular>
        <p className="mt-4 text-sm leading-relaxed text-hueso-100/65">
          {canal.pausado
            ? 'La cocina está a tope en este momento. Inténtelo en un rato: lo que escogió se le queda guardado.'
            : `Recibimos pedidos entre las ${hora(canal.desde)} y las ${hora(canal.hasta)}. Lo que escogió se le queda guardado.`}
        </p>
        <p className="mt-4 text-sm text-hueso-100/50">
          También puede visitarnos en {ficha.direccion}, {ficha.ciudad}.
        </p>
      </div>
    )
  }

  // ---------------------------------------------------------------------------
  // Formulario
  // ---------------------------------------------------------------------------

  const etiquetaCampo = 'mb-2 block text-[0.7rem] font-medium uppercase tracking-[0.2em] text-hueso-100/60'
  const campo =
    'w-full min-h-[48px] border border-carbon-600 bg-carbon-900 px-4 text-hueso-100 outline-none transition focus:border-dorado-400 [color-scheme:dark]'

  return (
    <div className="mx-auto max-w-lg px-5 py-12">
      <button
        type="button"
        onClick={() => navegar(-1)}
        className="mb-8 inline-flex items-center gap-2 text-sm text-hueso-100/60 transition hover:text-dorado-300"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Seguir viendo la carta
      </button>

      <Titular nivel="h1" tamano="grande" className="subir">
        Su pedido
      </Titular>

      {/* ---------- Resumen ---------- */}
      <ul className="mt-8 space-y-3 border-b border-carbon-700 pb-6">
        {carrito.lineas.map((linea) => (
          <li key={linea.id} className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-hueso-100">
                <span className="mr-1.5 text-dorado-300">{linea.cantidad}×</span>
                {linea.nombre}
              </p>
              {linea.modificadores.length > 0 && (
                <p className="text-xs text-hueso-100/50">
                  {linea.modificadores.map((m) => m.valor).join(' · ')}
                </p>
              )}
              {linea.nota && <p className="text-xs italic text-hueso-100/50">{linea.nota}</p>}
              <div className="mt-1.5 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => carrito.cambiarCantidad(linea.id, linea.cantidad - 1)}
                  className="h-8 w-8 rounded-full text-hueso-100/70 transition hover:bg-carbon-800 bg-carbon-900"
                  aria-label="Quitar uno"
                >
                  –
                </button>
                <span className="w-6 text-center text-sm tabular-nums text-hueso-100">
                  {linea.cantidad}
                </span>
                <button
                  type="button"
                  onClick={() => carrito.cambiarCantidad(linea.id, linea.cantidad + 1)}
                  className="h-8 w-8 rounded-full text-hueso-100/70 transition hover:bg-carbon-800 bg-carbon-900"
                  aria-label="Agregar uno"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => carrito.quitar(linea.id)}
                  className="ml-1 text-hueso-100/40 transition hover:text-dorado-300"
                  aria-label={`Quitar ${linea.nombre}`}
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                </button>
              </div>
            </div>
            <span className="shrink-0 tabular-nums text-hueso-100/80">
              {formatoCOP(precioLinea(linea))}
            </span>
          </li>
        ))}
      </ul>

      <form onSubmit={enviar} className="subir demora-2 mt-8 space-y-6">
        {/* ---------- Tipo ---------- */}
        <div>
          <span className={etiquetaCampo}>¿Cómo lo quiere?</span>
          <div className="grid grid-cols-2 gap-2">
            {(['domicilio', 'llevar'] as const).map((valor) => (
              <button
                key={valor}
                type="button"
                onClick={() => setTipo(valor)}
                className={`flex min-h-[56px] items-center justify-center gap-2 text-sm transition ${
                  tipo === valor
                    ? 'bg-dorado-500 text-carbon-950 border border-dorado-500'
                    : 'text-hueso-100/70 border border-hueso-100/20 hover:border-dorado-400 hover:text-dorado-300'
                }`}
              >
                {valor === 'domicilio' ? (
                  <Bike className="h-4 w-4" aria-hidden />
                ) : (
                  <ShoppingBag className="h-4 w-4" aria-hidden />
                )}
                {valor === 'domicilio' ? 'A domicilio' : 'Para llevar'}
              </button>
            ))}
          </div>
        </div>

        {/* ---------- Contacto ---------- */}
        <div>
          <label className={etiquetaCampo} htmlFor="nombre">
            Su nombre
          </label>
          <input
            id="nombre"
            className={campo}
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            autoComplete="name"
            required
          />
        </div>

        <div>
          <label className={etiquetaCampo} htmlFor="telefono">
            Teléfono
          </label>
          <input
            id="telefono"
            className={campo}
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            inputMode="tel"
            autoComplete="tel"
            placeholder="300 123 4567"
            required
          />
          <p className="mt-1.5 text-xs text-hueso-100/45">
            Le confirmamos el pedido por WhatsApp a este número.
          </p>
        </div>

        {/* ---------- Domicilio ---------- */}
        {tipo === 'domicilio' && (
          <>
            <div>
              <label className={etiquetaCampo} htmlFor="zona">
                Barrio
              </label>
              <select
                id="zona"
                className={campo}
                value={zonaId}
                onChange={(e) => setZonaId(e.target.value)}
                required
              >
                <option value="">Escoja su barrio</option>
                {zonas.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.nombre} · envío {formatoCOP(z.tarifa)} · {z.minutosEstimados} min
                  </option>
                ))}
              </select>
              {zona && (
                <p className="mt-1.5 text-xs text-hueso-100/45">
                  Pedido mínimo en {zona.nombre}: {formatoCOP(zona.montoMinimo)}
                </p>
              )}
            </div>

            <div>
              <label className={etiquetaCampo} htmlFor="direccion">
                Dirección
              </label>
              <input
                id="direccion"
                className={campo}
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                autoComplete="street-address"
                placeholder="Calle 12 #4-33, casa de dos pisos"
                required
              />
            </div>

            {/*
              Ubicación exacta. Es opcional a propósito y el texto lo dice: en
              Turbaco muchas casas no tienen nomenclatura clara y el punto le
              ahorra al domiciliario la llamada de «¿por dónde es?». Si el
              cliente no quiere darla, el pedido entra igual.
            */}
            <div className="p-4 bg-carbon-900">
              <p className={etiquetaCampo}>Ubicación exacta (opcional)</p>

              {ubicacion ? (
                <div>
                  <p className="flex items-start gap-2 text-sm text-hueso-100">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-dorado-300" aria-hidden />
                    <span>
                      Ubicación compartida
                      {ubicacion.precisionMetros !== undefined && (
                        <span className="block text-xs text-hueso-100/50">
                          {ubicacion.precisionMetros <= PRECISION_ACEPTABLE_METROS
                            ? `Precisión de unos ${ubicacion.precisionMetros} m`
                            : `Precisión de ${ubicacion.precisionMetros} m: es aproximada, así que la dirección sigue siendo importante`}
                        </span>
                      )}
                    </span>
                  </p>

                  {/*
                    El mapa no es adorno. El GPS de un celular a veces cae en la
                    casa de al lado o en la esquina, y el único que puede darse
                    cuenta es el cliente, que sabe dónde vive. Que lo vea antes
                    de enviar ahorra la llamada de después.
                  */}
                  <MapaEntrega
                    ubicacion={ubicacion}
                    titulo="El punto que va a compartir con el restaurante"
                    alto="h-56"
                    className="mt-3 bg-carbon-900"
                  />
                  <p className="mt-2 text-xs leading-relaxed text-hueso-100/50">
                    ¿El punto cae donde va a recibir el pedido? Si no, tóquelo otra vez desde el
                    lugar de entrega con «Volver a tomarla».
                  </p>
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={tomarUbicacion}
                      disabled={buscandoUbicacion}
                      className="boton-relleno min-h-[40px] px-3.5 text-xs text-hueso-100/70 disabled:opacity-60 border border-hueso-100/20 font-semibold uppercase tracking-[0.18em]"
                    >
                      {buscandoUbicacion ? 'Buscando…' : 'Volver a tomarla'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setUbicacion(null)
                        setAvisoUbicacion(null)
                      }}
                      className="boton-relleno min-h-[40px] px-3.5 text-xs text-hueso-100/50 border border-hueso-100/20 font-semibold uppercase tracking-[0.18em]"
                    >
                      Quitarla
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="mb-3 text-xs leading-relaxed text-hueso-100/50">
                    Si está en el lugar de entrega, compartir su ubicación nos ayuda a llegar sin
                    llamarlo. Si está pidiendo desde otro sitio, mejor déjelo así: vale la dirección
                    que escribió arriba.
                  </p>
                  <button
                    type="button"
                    onClick={tomarUbicacion}
                    disabled={buscandoUbicacion}
                    className="boton-relleno inline-flex min-h-[48px] items-center gap-2 px-4 text-hueso-100 disabled:opacity-60 border border-hueso-100/20 text-xs font-semibold uppercase tracking-[0.18em]"
                  >
                    <Crosshair className="h-4 w-4" aria-hidden />
                    {buscandoUbicacion ? 'Buscando su ubicación…' : 'Estoy aquí, usar mi ubicación'}
                  </button>
                </>
              )}

              {avisoUbicacion && (
                <p className="mt-3 text-xs leading-relaxed text-hueso-100/50">{avisoUbicacion}</p>
              )}
            </div>
          </>
        )}

        {/* ---------- Pago previsto ---------- */}
        <div>
          <span className={etiquetaCampo}>¿Con qué va a pagar?</span>
          <div className="grid grid-cols-3 gap-2">
            {METODOS.map((m) => (
              <button
                key={m.valor}
                type="button"
                onClick={() => setMetodo(m.valor)}
                className={`min-h-[48px] text-sm transition ${
                  metodo === m.valor
                    ? 'bg-dorado-500 text-carbon-950 border border-dorado-500'
                    : 'text-hueso-100/70 border border-hueso-100/20 hover:border-dorado-400 hover:text-dorado-300'
                }`}
              >
                {m.etiqueta}
              </button>
            ))}
          </div>
          <p className="mt-1.5 text-xs text-hueso-100/45">
            Es solo para tenerlo previsto; el cobro se hace en la entrega.
          </p>
        </div>

        {/* ---------- Notas ---------- */}
        <div>
          <label className={etiquetaCampo} htmlFor="notas">
            Indicaciones (opcional)
          </label>
          <textarea
            id="notas"
            rows={2}
            className={`${campo} min-h-[72px] py-2.5`}
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            placeholder="Portón verde, timbre dañado, preguntar por…"
          />
        </div>

        {/* ---------- Totales ---------- */}
        <div className="p-4 text-sm bg-carbon-900">
          <div className="flex justify-between text-hueso-100/70">
            <span>Productos</span>
            <span className="tabular-nums">{formatoCOP(carrito.subtotal)}</span>
          </div>
          {costoEnvio > 0 && (
            <div className="flex justify-between text-hueso-100/70">
              <span>Domicilio a {zona?.nombre}</span>
              <span className="tabular-nums">{formatoCOP(costoEnvio)}</span>
            </div>
          )}
          <p className="mt-2 text-xs text-hueso-100/45">
            El impuesto al consumo se calcula sobre los productos y se le muestra al confirmar. El
            domicilio no lleva impuesto.
          </p>
        </div>

        {intentado && problemas.length > 0 && (
          <ul className="p-3 text-sm border border-estado-demorado/40 bg-estado-demorado/10 text-hueso-100">
            {problemas.map((p) => (
              <li key={p}>· {p}</li>
            ))}
          </ul>
        )}

        {error && (
          <p className="p-3 text-sm border border-estado-demorado/40 bg-estado-demorado/10 text-hueso-100">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={enviando}
          className="boton-brillo flex min-h-[56px] w-full items-center justify-center gap-2 bg-dorado-500 px-5 text-carbon-950 transition hover:bg-dorado-400 disabled:opacity-60 text-xs font-semibold uppercase tracking-[0.18em]"
        >
          {enviando ? 'Enviando…' : 'Confirmar pedido'}
        </button>
      </form>
    </div>
  )
}
