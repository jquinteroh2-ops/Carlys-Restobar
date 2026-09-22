import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, ShoppingBag } from 'lucide-react'
import * as api from '@/compartido/mockApi'
import type { CategoriaConItems } from '@/compartido/mockApi'
import { formatoCOP } from '@/compartido/formato'
import { enPromocion } from '@/compartido/calculos'
import { fotosDePlato } from '@/compartido/fotosDePlato'
import { useSyncedState } from '@/compartido/useSyncedState'
import type { EstadoCanal, ItemCarta } from '@/compartido/tipos'
import type { SeleccionProducto } from '@/comandera/HojaModificadores'
import { FichaDePlato } from './FichaDePlato'
import { useCarrito } from './carrito'
import { CabeceraDePagina, Titular } from './Piezas'
import { Esqueleto, EsqueletoTexto, ZonaCargando } from '@/componentes/ui/Esqueleto'

export default function Carta() {
  // Sin filtrar: un plato agotado se marca, no se esconde. El cliente merece
  // saber que existe, y manana vuelve a estar.
  const { datos: categorias, cargando } = useSyncedState<CategoriaConItems[]>(
    () => api.cartaAgrupada(),
    [],
    [],
    ['carta', 'todo'],
  )

  // El canal decide si se puede pedir: fuera de horario o con la cocina
  // saturada, la carta se sigue leyendo pero no aparece el boton de agregar.
  const { datos: canal } = useSyncedState<EstadoCanal | null>(
    () => api.estadoCanal(),
    null,
    [],
    ['pedidos', 'ajustes', 'todo'],
  )

  const carrito = useCarrito()
  /** El plato cuya ficha esta abierta. */
  const [enFicha, setEnFicha] = useState<ItemCarta | null>(null)

  const [activa, setActiva] = useState<string | null>(null)
  const navRef = useRef<HTMLDivElement>(null)

  const sePuedePedir = canal?.abierto === true

  // Resalta en la barra la categoría que se está leyendo.
  useEffect(() => {
    if (categorias.length === 0) return

    const observador = new IntersectionObserver(
      (entradas) => {
        const visible = entradas
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (visible) setActiva(visible.target.id)
      },
      { rootMargin: '-140px 0px -60% 0px', threshold: 0 },
    )

    for (const categoria of categorias) {
      const seccion = document.getElementById(categoria.id)
      if (seccion) observador.observe(seccion)
    }
    return () => observador.disconnect()
  }, [categorias])

  // Mantiene visible la pestaña activa cuando la barra se desborda.
  useEffect(() => {
    if (!activa || !navRef.current) return
    const boton = navRef.current.querySelector<HTMLElement>(`[data-categoria="${activa}"]`)
    boton?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
  }, [activa])

  const aviso = useMemo(() => {
    if (!canal) return null
    if (canal.abierto) return null
    if (canal.pausado) {
      return 'Por ahora no estamos recibiendo pedidos en línea. La cocina está a tope; inténtelo en un rato.'
    }
    const hora = (t: string) => t.slice(0, 5)
    return `Recibimos pedidos entre las ${hora(canal.desde)} y las ${hora(canal.hasta)}. Fuera de ese horario lo esperamos en el salón.`
  }, [canal])

  /**
   * El atajo: lo que no hay que elegir entra de un toque.
   *
   * Una limonada no tiene termino ni guarnicion, y hacerle abrir la ficha para
   * confirmar que quiere la limonada que acaba de pedir es un paso de mas. Lo
   * que si hay que elegir abre la ficha, que es donde estan las fotos y las
   * opciones juntas.
   */
  const alTocarAgregar = (item: ItemCarta) => {
    if ((item.modificadores?.length ?? 0) === 0) {
      carrito.agregar(item, 1, [])
      return
    }
    setEnFicha(item)
  }

  const alConfirmarSeleccion = (seleccion: SeleccionProducto) => {
    if (!enFicha) return
    carrito.agregar(enFicha, seleccion.cantidad, seleccion.modificadores, seleccion.nota)
    setEnFicha(null)
  }

  return (
    <>
      <CabeceraDePagina rotulo="La carta" titulo="Para picar, brindar y quedarse">
        <p>
          Picadas, platos fuertes, cocteles y cerveza. Los precios están en pesos colombianos e
          incluyen el impuesto al consumo.
        </p>
      </CabeceraDePagina>

      {aviso && (
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="border-l-2 border-dorado-500 bg-carbon-900 px-5 py-4 text-sm text-hueso-100/80">
            {aviso}
          </p>
        </div>
      )}

      {/* Navegación por categorías, siempre a la vista. Rectángulos con
          filete fino; la activa se rellena de dorado. */}
      <div className="sticky top-16 z-30 bg-carbon-950/95 backdrop-blur">
        <div
          ref={navRef}
          className="sin-scrollbar mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3 sm:px-6"
        >
          {categorias.map((categoria) => (
            <a
              key={categoria.id}
              href={`#${categoria.id}`}
              data-categoria={categoria.id}
              className={`inline-flex min-h-[40px] shrink-0 items-center px-4 transition text-xs font-semibold uppercase tracking-[0.18em] ${
                activa === categoria.id
                  ? 'bg-dorado-500 text-carbon-950 border border-dorado-500'
                  : 'text-hueso-100/75 hover:text-hueso-50 border border-hueso-100/20 hover:border-dorado-400'
              }`}
            >
              {categoria.nombre}
            </a>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {cargando ? (
          /*
            Dos categorias de cuatro platos. No es el numero real -no se sabe
            hasta que llega la carta- pero llena la primera pantalla, que es lo
            unico que se ve mientras carga.
          */
          <ZonaCargando etiqueta="Cargando la carta">
            <div className="space-y-14">
              {[0, 1].map((categoria) => (
                <section key={categoria}>
                  <Esqueleto claro className="h-10 w-1/2" />
                  <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                    {[0, 1, 2, 3].map((plato) => (
                      <li
                        key={plato}
                        className="animate-entrada bg-carbon-900 p-5"
                        style={{ animationDelay: `${(categoria * 4 + plato) * 45}ms` }}
                      >
                        <Esqueleto claro className="h-6 w-3/5" />
                        <div className="mt-3">
                          <EsqueletoTexto lineas={2} claro />
                        </div>
                        <Esqueleto claro className="mt-4 h-8 w-24" />
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </ZonaCargando>
        ) : (
          <div className="space-y-14">
            {categorias.map((categoria) => (
              <section key={categoria.id} id={categoria.id} className="revelar scroll-mt-36">
                <div className="flex items-end justify-between gap-4">
                  <Titular>{categoria.nombre}</Titular>
                  <span className="shrink-0 pb-1 text-sm font-semibold tabular-nums text-hueso-100/40">
                    {categoria.items.length}
                  </span>
                </div>

                {/*
                  Tarjetas y no renglones.

                  La lista de renglones finos separados por un filete es la
                  carta de un restaurante de mantel. Aquí cada plato es un
                  bloque relleno, en cuadrícula de dos, con el precio en una
                  chapa: se recorre como el tablero de una barra, a golpe de
                  vista, que es como se elige qué pedir con los amigos.
                */}
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {categoria.items.map((item) => {
                    const fotos = fotosDePlato(item)

                    /*
                      La tarjeta entera se puede tocar, y por eso es `relative`.

                      El nombre lleva un `::after` estirado hasta los bordes de
                      este `li`, así que el toque vale en cualquier parte de la
                      tarjeta sin tener que meter el `<h3>` dentro de un botón:
                      dentro de un botón solo cabe texto, y la carta se quedaría
                      sin la jerarquía de títulos con la que la recorre un
                      lector de pantalla y la lee Google.
                    */
                    return (
                      <li
                        key={item.id}
                        className={`relative flex gap-4 bg-carbon-900 p-4 transition hover:bg-carbon-800 sm:p-5 ${
                          item.disponible ? '' : 'opacity-55'
                        }`}
                      >
                        <div className="flex min-w-0 flex-1 flex-col">
                          <h3 className="font-titulo text-lg uppercase leading-tight text-hueso-50 font-light tracking-[0.1em]">
                            <button
                              type="button"
                              onClick={() => setEnFicha(item)}
                              className="text-left after:absolute after:inset-0 after:rounded-3xl after:content-['']"
                            >
                              {item.nombre}
                              {fotos.length > 1 && (
                                <span className="sr-only"> · {fotos.length} fotos</span>
                              )}
                            </button>
                          </h3>

                          {(!item.disponible || enPromocion(item)) && (
                            <div className="mt-2 flex gap-2">
                              {!item.disponible && (
                                <span className="bg-carbon-600 px-2.5 py-0.5 text-xs font-semibold text-hueso-100">
                                  Agotado
                                </span>
                              )}
                              {item.disponible && enPromocion(item) && (
                                <span className="border border-dorado-500/60 px-2 py-0.5 text-[0.65rem] font-medium uppercase tracking-[0.18em] text-dorado-300">
                                  Promoción
                                </span>
                              )}
                            </div>
                          )}

                          {item.descripcion && (
                            <p className="mt-2 text-sm leading-relaxed text-hueso-100/65">
                              {item.descripcion}
                            </p>
                          )}

                          <div className="mt-auto flex items-center justify-between gap-3 pt-4">
                            {/* En promoción van los dos precios, con el de
                                lista tachado: lo que hace atractiva la oferta
                                es cuánto se ahorra el cliente. */}
                            <span className="inline-flex items-baseline gap-2 text-base font-medium tabular-nums text-dorado-300">
                              {enPromocion(item) ? (
                                <>
                                  <span className="text-xs text-hueso-100/40 line-through">
                                    {formatoCOP(item.precio)}
                                  </span>
                                  {formatoCOP(item.precioPromocional!)}
                                </>
                              ) : (
                                formatoCOP(item.precio)
                              )}
                            </span>

                            {sePuedePedir && item.disponible && (
                              <button
                                type="button"
                                onClick={() => alTocarAgregar(item)}
                                aria-label={`Agregar ${item.nombre}`}
                                /* `relative` lo saca de debajo del `::after`
                                   que cubre la tarjeta: sin esto, tocar el
                                   botón abriría la ficha en vez de agregar. */
                                className="relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-hueso-100/25 text-hueso-100 transition hover:border-dorado-400 hover:text-dorado-300"
                              >
                                <Plus className="h-5 w-5" aria-hidden />
                              </button>
                            )}
                          </div>
                        </div>

                        {fotos.length > 0 && (
                          <div className="relative w-24 shrink-0 sm:w-28">
                            <img
                              src={api.urlImagenCarta(fotos[0], 400)}
                              alt=""
                              loading="lazy"
                              className="aspect-square w-full object-cover"
                            />
                            {/* Cuántas fotos hay, en una chapa sobre la
                                primera: dice que hay más sin ocupar renglón. */}
                            {fotos.length > 1 && (
                              <span
                                aria-hidden
                                className="absolute bottom-1.5 right-1.5 bg-carbon-950/80 px-2 py-0.5 text-[0.7rem] font-semibold text-hueso-50"
                              >
                                +{fotos.length - 1}
                              </span>
                            )}
                          </div>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </section>
            ))}
          </div>
        )}

        <p className="mt-14 bg-carbon-900 p-6 text-sm leading-relaxed text-hueso-100/60">
          La propina es voluntaria. Si desea dejarla, su mesero se la consultará antes de incluirla
          en la cuenta.
        </p>
      </div>

      {/* Espacio para que el botón flotante no tape el último plato. */}
      {carrito.unidades > 0 && <div className="h-24" aria-hidden />}

      {/* ---------- Botón flotante con el conteo y el total corriente ---------- */}
      {carrito.unidades > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 px-4 pt-3 pb-segura">
          <Link
            to="/pedir"
            className="mx-auto mb-3 flex min-h-[56px] max-w-xl items-center justify-between gap-4 bg-dorado-500 px-6 text-carbon-950 shadow-2xl shadow-black/60 transition hover:bg-dorado-400"
          >
            <span className="flex items-center gap-2 font-semibold">
              <ShoppingBag className="h-5 w-5" aria-hidden />
              {carrito.unidades} {carrito.unidades === 1 ? 'producto' : 'productos'}
            </span>
            <span className="flex items-center gap-3 text-sm font-semibold text-carbon-950">
              <span className="tabular-nums">{formatoCOP(carrito.subtotal)}</span>
              <span aria-hidden>→</span>
              <span className="sr-only">Continuar</span>
            </span>
          </Link>
        </div>
      )}

      {/* La ficha: las fotos, lo que lleva el plato y el pedido en la misma
          hoja. Por dentro es la misma que usa la comandera —la elección del
          cliente y la del mesero son la misma decisión— con las fotos encima. */}
      <FichaDePlato
        item={enFicha}
        canalAbierto={sePuedePedir}
        onCerrar={() => setEnFicha(null)}
        onConfirmar={alConfirmarSeleccion}
      />
    </>
  )
}
