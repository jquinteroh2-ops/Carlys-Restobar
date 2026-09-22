/**
 * Todo lo que un dueno distinto querria cambiar sin tocar componentes.
 */

/**
 * OJO CON LO QUE SE EDITA AQUI.
 *
 * `direccion`, `ciudad`, `telefono`, `whatsapp`, `instagram` y `horario` ya no
 * los lee el sitio: viven en la base -tabla `ficha_sitio`- y los edita el panel,
 * porque corregir un horario de temporada no puede costar un despliegue. Lo que
 * queda escrito aqui son los VALORES DE RESERVA: lo que se pinta mientras el
 * servidor contesta, y lo que se pinta si nunca contesta. Cambiarlos aqui no
 * cambia lo que ve el cliente; para eso esta /recepcion/ajustes.
 *
 * Lo demas -el nombre, la descripcion, las coordenadas del local- si sale de
 * aqui: no cambia, y una coordenada mal escrita desde un formulario manda al
 * repartidor a otro barrio.
 */
export const RESTAURANTE = {
  /*
   * El nombre corto y el completo NO son el mismo texto acortado.
   *
   * `nombre` es como se firma en pantalla y en el papel que sale de la caja,
   * donde compite con el resto de la linea; `nombreCompleto` es como se
   * presenta cuando aparece solo: el titulo de Google, la tarjeta de WhatsApp,
   * la ficha del negocio. El completo lleva «Restobar» porque asi se presenta
   * la casa en su perfil, y un titulo que no coincide con la ficha del negocio
   * le cuesta al local aparecer cuando lo buscan por su nombre.
   *
   * El apostrofo es el tipografico (’) y no el recto ('). No es un capricho de
   * imprenta: el recto rompe la cadena en SQL y obliga a escaparlo en cada
   * archivo donde se escriba el nombre. Con el tipografico el nombre se copia
   * y se pega a cualquier parte sin pensar.
   */
  nombre: 'Carly’s',
  nombreCompleto: 'Carly’s Restobar',
  /** El lema de la casa, tal como esta escrito en su perfil. */
  lema: 'Democratizamos buenas experiencias',
  descripcionCorta: 'Restobar de cocina y coctelería',
  /*
   * Los datos de contacto: direccion, ciudad, telefono, whatsapp, instagram y
   * horario.
   *
   * Estos son los VALORES DE RESERVA, no la fuente de verdad. Lo que se pinta
   * sale de la tabla `ficha_sitio` y se edita desde /recepcion/ajustes sin
   * desplegar, porque corregir un horario de temporada no puede costar un
   * despliegue. Lo de aqui es lo que se ve mientras el servidor contesta, y lo
   * que se ve si nunca contesta.
   *
   * ─────────────────────────────────────────────────────────────────────────
   * PENDIENTE DE CONFIRMAR CON EL CLIENTE, antes de que el sitio salga al aire:
   *
   *   - La direccion con numero de placa. La casa no la tiene a mano; va la
   *     referencia de esquina que da su ficha de Google Maps, que es como se
   *     ubica la gente en Turbaco.
   *   - El horario real. El de abajo es el de un restobar cualquiera y esta
   *     puesto para que la pagina no salga vacia.
   *
   * Los dos se corrigen desde el panel sin tocar codigo. Lo que NO se corrige
   * desde el panel son las coordenadas: ver la nota que sigue.
   * ─────────────────────────────────────────────────────────────────────────
   */
  direccion: 'Carrera 27 con Calle 28',
  ciudad: 'Turbaco, Bolívar',
  /** El numero de la sede de Turbaco, el que publica el perfil. */
  telefono: '+57 314 532 0685',
  /** El mismo numero en el formato que exige wa.me: sin signos ni espacios. */
  whatsapp: '573145320685',
  instagram: 'carlys.restobar',
  /**
   * La puerta del local, no el centro del pueblo.
   *
   * El mapa del sitio, la ruta del repartidor y el cobro del domicilio salen
   * de este par, no del texto de la direccion: una direccion escrita en
   * Turbaco no siempre cae donde debe, y la coordenada no depende de que la
   * calle este bien numerada.
   *
   * Es el punto que marca la ficha del negocio en Google Maps («Carlys
   * Parrilla Turbaco»), y tiene que quedar IGUAL que `carlys.local` en
   * application.yml. Si los dos no coinciden, el cliente ve un punto en el
   * mapa y el domicilio se cobra desde otro.
   */
  coordenadas: { latitud: 10.3392264, longitud: -75.4154494 },
  /**
   * La ficha del negocio en Google Maps, tal como la comparte el local.
   *
   * El boton «Abrir en Google Maps» va a esta ficha y no a una busqueda por
   * nombre: buscando «Carly’s» en Turbaco Google puede devolver otro negocio,
   * y la ficha trae lo que la coordenada sola no trae —fotos, reseñas y el
   * horario que el dueño publica—.
   */
  fichaMaps: 'https://maps.app.goo.gl/2tp2SiV8qJAdhXkf6',
  horario: [
    { dias: 'Martes a Jueves', horas: '4:00 p. m. – 11:00 p. m.' },
    { dias: 'Viernes y Sábado', horas: '4:00 p. m. – 2:00 a. m.' },
    { dias: 'Domingo', horas: '2:00 p. m. – 11:00 p. m.' },
    { dias: 'Lunes', horas: 'Cerrado' },
  ],
} as const


/**
 * La propina en Colombia es voluntaria y debe consultarse antes de incluirla.
 * Estos son solo sugerencias que el mesero ofrece; nunca se aplican solas.
 */
export const PROPINAS_SUGERIDAS = [0, 5, 10] as const

/** Umbrales de demora en la pantalla de cocina, en minutos. */
export const UMBRALES_COCINA = {
  atencion: 10,
  demorado: 20,
} as const

/** Minutos sin cobrar que disparan alerta en el panel administrativo. */
export const UMBRAL_ALERTA_ADMIN = 20

/** Notas rapidas de un toque en la comandera. */
export const NOTAS_RAPIDAS = [
  'Sin sal',
  'Sin cebolla',
  'Sin picante',
  'Para compartir',
  'Sin hielo',
  'Servir al final',
  'Alergia: mariscos',
  'Alergia: gluten',
] as const

/** Cargos adicionales frecuentes. Siempre los agrega el mesero a mano. */
export const CARGOS_FRECUENTES = [
  { nombre: 'Decoración de cumpleaños', valor: 45000 },
  { nombre: 'Servicio de descorche', valor: 35000 },
  { nombre: 'Torta porcionada', valor: 12000 },
  { nombre: 'Reserva de zona privada', valor: 80000 },
] as const

// ---------------------------------------------------------------------------
// Domicilios y para llevar
// ---------------------------------------------------------------------------

/**
 * Las zonas de domicilio NO estan aqui.
 *
 * Viven en la base y se administran desde /admin/configuracion, porque el dueno
 * sube la tarifa de una zona cuando sube la gasolina y no puede necesitar un
 * despliegue para eso. Lo que queda en este archivo es lo que la interfaz
 * necesita saber sin preguntarle al servidor.
 */

/** Minutos que se le promete al cliente cuando la zona no dice otra cosa. */
export const MINUTOS_ESTIMADOS_POR_DEFECTO = 40

/**
 * Monto minimo de referencia que se muestra en el sitio publico antes de que
 * el cliente escoja barrio. El que manda es el de la zona, que valida el
 * servidor: este solo evita que la pagina prometa algo distinto.
 */
export const MONTO_MINIMO_DOMICILIO = 30000

/** Minutos que lleva un pedido esperando antes de que recepcion deba mirarlo. */
export const UMBRAL_ALERTA_PEDIDO = 10

/** Un celular colombiano tiene diez digitos y empieza por 3. */
export const DIGITOS_TELEFONO = 10


/** Los estados de un pedido, en el orden en que ocurren. */
export const ESTADOS_PEDIDO = [
  // Solo lo ocupan los canales automatizados (WhatsApp, y luego telefono) que
  // cobran anticipo antes de mandar algo a cocina. Visible pero sin botones de
  // accion: recepcion no tiene nada que hacer aqui, solo esperar el webhook
  // del pago.
  { estado: 'esperando_anticipo', etiqueta: 'Esperando pago' },
  { estado: 'nuevo', etiqueta: 'Nuevos' },
  { estado: 'aceptado', etiqueta: 'Aceptados' },
  { estado: 'en_preparacion', etiqueta: 'En preparación' },
  { estado: 'listo', etiqueta: 'Listos' },
  { estado: 'despachado', etiqueta: 'Despachados' },
] as const

/** Motivos frecuentes de rechazo. Siempre se puede escribir otro. */
export const MOTIVOS_RECHAZO = [
  'La cocina está saturada en este momento',
  'No tenemos disponible lo que pidió',
  'No llegamos a esa dirección',
  'No pudimos confirmar el pedido por teléfono',
] as const

// ---------------------------------------------------------------------------
// Impresion
// ---------------------------------------------------------------------------

/**
 * Datos del establecimiento que van en todo documento que salga impreso.
 *
 * TODOS SALEN DEL RUT, no de lo que se lea mejor. La razon social es la que
 * esta inscrita, el NIT es el inscrito y las responsabilidades son las de la
 * casilla 53. Escribir aqui algo que el RUT no dice es declarar algo falso.
 *
 * Los valores actuales son DE EJEMPLO y hay que reemplazarlos con los reales
 * antes de emitir nada, incluso en pruebas.
 */
export const DATOS_FISCALES = {
  /*
   * NADA DE ESTO ESTA CONFIRMADO TODAVIA, y por eso se lee «POR DEFINIR» en
   * vez de un numero verosimil.
   *
   * Un NIT de ejemplo bien formado —901.234.567-8— es peor que un hueco:
   * pasa desapercibido en el papel y se imprime meses enteros sin que nadie
   * lo note. Un «POR DEFINIR» en la cabeza del comprobante lo ve el cajero el
   * primer dia. Estos campos se llenan copiando el RUT, no de lo que suene
   * mejor.
   */
  razonSocial: 'POR DEFINIR (razón social del RUT)',
  /** Sin puntos ni digito de verificacion: asi entra al XML y al CUFE. */
  nit: '',
  /** El digito de verificacion va en su propio campo. */
  digitoVerificacion: '',
  /** El mismo NIT como se lee en el papel. */
  nitCompleto: 'POR DEFINIR',
  direccion: 'Por confirmar',
  municipio: 'Turbaco',
  departamento: 'Bolívar',
  /** Codigo DANE del municipio. Turbaco, Bolivar es 13836. */
  codigoMunicipio: '13836',
  correo: '',
  regimen: 'Responsable de impuesto al consumo',
  responsabilidad: 'No responsable de IVA',
  /** Codigos de la casilla 53 del RUT. Se copian, no se escogen. */
  responsabilidades: ['R-99-PN'] as string[],
  /*
   * LA RESOLUCION NO VA AQUI. Vive en `NUMERACION_DIAN`, y en un solo sitio a
   * proposito: mientras hubo dos, llenar el equivocado hacia que el comprobante
   * interno imprimiera un numero de resolucion que el documento fiscal ni
   * siquiera miraba. Un papel que se declara comprobante interno y a la vez
   * exhibe una resolucion de la DIAN no es ninguna de las dos cosas.
   */
  /** Texto que la ley exige mientras no haya facturacion electronica. */
  leyenda: 'Este documento no es una factura electrónica de venta. Comprobante interno.',
} as const

// ---------------------------------------------------------------------------
// Facturacion electronica
// ---------------------------------------------------------------------------

/**
 * Si Carly’s emite documentos fiscales por su cuenta.
 *
 * Esta en `false` y esa es la postura del sistema desde que el restaurante
 * todavia no define quien emite: **Carly’s no factura desde este software**.
 * No numera, no calcula impuestos fiscales, no reporta a la DIAN. Eso lo hace
 * el sistema contable que el restaurante ya use o contrate, y tener dos
 * sistemas emitiendo contra el mismo NIT es peor que no tener ninguno.
 *
 * PENDIENTE con el contador: definir quien factura. Mientras no se defina,
 * este interruptor NO SE TOCA.
 *
 * Lo que Carly’s sigue haciendo es cobrar: la cuenta de la mesa, el anticipo
 * de un pedido, el comprobante interno que se le entrega al cliente. Nada de
 * eso es un documento fiscal ni se llama factura en ninguna pantalla.
 *
 * El modulo de `src/facturacion/` se conserva completo detras de este
 * interruptor. No es codigo muerto por descuido: es la salida si el proveedor
 * que se escoja no ofrece integracion y el restaurante tiene que emitir por su
 * cuenta.
 * Volver a encenderlo es cambiar esta variable, no reescribir nada.
 *
 * Vive en el navegador y no en el backend porque la emision siempre estuvo del
 * lado del navegador. Poner ademas una copia en `application.yml` seria tener
 * dos fuentes de verdad para un mismo interruptor, y descubrir la diferencia el
 * dia que una de las dos se cambie sola.
 */
export const FACTURACION_INTERNA_HABILITADA =
  (import.meta.env.VITE_FACTURACION_INTERNA_HABILITADA ?? 'false') === 'true'

/**
 * La resolucion de numeracion que autoriza la DIAN.
 *
 * Esta VACIA a proposito y el sistema depende de que lo siga estando hasta que
 * el restaurante quede habilitado: mientras `resolucion` o `claveTecnicaPuesta`
 * esten en blanco, todo documento que salga se imprime marcado como prueba y
 * sin valor fiscal. Llenar esto con numeros inventados no hace que el sistema
 * facture: hace que imprima documentos falsos.
 *
 * Lo entrega el contador o el proveedor tecnologico cuando termine el tramite.
 */
export const NUMERACION_DIAN = {
  /** Numero de la resolucion. Ej: '18764000001234'. */
  resolucion: '',
  /** aaaa-mm-dd */
  fechaResolucion: '',
  /** Ej: 'FE'. Puede ir vacio si la DIAN autoriza sin prefijo. */
  prefijo: '',
  desde: 0,
  hasta: 0,
  /** aaaa-mm-dd. Vencida, el rango deja de servir aunque sobren numeros. */
  vigenteHasta: '',
  /**
   * LA CLAVE TECNICA NO VA AQUI.
   *
   * Entra en el calculo del CUFE y es un secreto: cualquier cosa que este en
   * este archivo viaja al navegador de todos los que abran la pagina. Vive en
   * el servidor, en una variable de entorno, y el documento se firma alla.
   * Este campo solo dice si ya fue configurada, para saber si se puede emitir.
   */
  claveTecnicaPuesta: false,
} as const

/**
 * Contra que ambiente de la DIAN se emite.
 *
 * 'pruebas' es habilitacion: los documentos existen y se consultan, pero no
 * tienen efecto fiscal. Pasar a 'produccion' es una decision del dueno y del
 * contador, nunca del desarrollo, y no se hace hasta que el tramite termine.
 */
export const AMBIENTE_DIAN: 'pruebas' | 'produccion' = 'pruebas'

/**
 * Que documento se emite en cada venta.
 *
 * 'factura' siempre es la opcion segura: emitir factura donde bastaba un
 * tiquete nunca es un incumplimiento, al reves si. Ademas evita mantener dos
 * numeraciones y dos formatos. El costo es que el proveedor cobra por documento
 * y la factura suele ser mas cara que el tiquete.
 *
 * DECISION PENDIENTE con el contador. Cambiar este valor cambia el documento
 * completo sin tocar ninguna pantalla.
 */
export const TIPO_DOCUMENTO_VENTA: 'factura' | 'tiquete_pos' = 'factura'

/** Quien transmite a la DIAN. Se imprime al pie, como exige la norma. */
export const PROVEEDOR_TECNOLOGICO = {
  nombre: '',
  nit: '',
} as const

/**
 * Si lo que sale por la impresora es un documento fiscal de verdad.
 *
 * Un solo lugar decide esto, y decide en contra por defecto. Mientras falte
 * cualquier pieza del tramite, el papel sale con la banda de prueba.
 *
 * La primera pieza es el interruptor maestro: con la facturacion interna
 * apagada no hay nada que discutir sobre resoluciones ni ambientes, porque este
 * sistema no emite. Las condiciones que siguen solo importan el dia que el
 * restaurante decida volver a emitir por su cuenta.
 *
 * El ambiente cuenta como una pieza mas, y no es un detalle: un documento
 * emitido contra habilitacion NO tiene efecto fiscal aunque la resolucion este
 * completa y aunque el QR se vea igual. Sin esta condicion, llenar los datos de
 * la resolucion antes de pasar a produccion —que es el orden natural del
 * tramite— haria que la banda de prueba desapareciera de un papel que sigue sin
 * valer, y el QR llevaria al cliente al portal donde su factura no existe.
 */
export function facturacionHabilitada(): boolean {
  return (
    FACTURACION_INTERNA_HABILITADA &&
    AMBIENTE_DIAN === 'produccion' &&
    NUMERACION_DIAN.resolucion !== '' &&
    NUMERACION_DIAN.claveTecnicaPuesta &&
    NUMERACION_DIAN.hasta > 0
  )
}


/** Si la comanda sale sola a cocina al enviar el turno. */
export const IMPRIMIR_COMANDA_AUTOMATICO = false


// ---------------------------------------------------------------------------
// Conexion con el backend
// ---------------------------------------------------------------------------

/** Quita la barra final para que al concatenar rutas no queden dos seguidas. */
const sinBarraFinal = (url: string): string => url.replace(/\/+$/, '')

/**
 * URL del API.
 *
 * Nunca se escribe una URL en un componente. En desarrollo apunta al backend
 * local; en Railway la define la variable de entorno del servicio del frontend,
 * porque el dominio cambia entre entornos y el codigo no puede saberlo.
 */
export const URL_API = sinBarraFinal(import.meta.env.VITE_URL_API ?? 'http://localhost:8080')

/**
 * URL del WebSocket.
 *
 * Si no viene declarada se deduce de la del API cambiando el esquema: sobre
 * HTTPS tiene que ser wss, porque un navegador en una pagina segura rechaza
 * abrir un socket en claro y el salon se quedaria sin tiempo real.
 */
export const URL_WS =
  import.meta.env.VITE_URL_WS ?? `${URL_API.replace(/^http/, 'ws')}/ws`

// ---------------------------------------------------------------------------
// La otra sede
// ---------------------------------------------------------------------------

/**
 * La sede de Arjona, a la que salta el selector del panel administrativo.
 *
 * Carly’s tiene dos locales —Turbaco y Arjona— y ESTE SISTEMA ES EL DE
 * TURBACO. Arjona todavia no esta montada; cuando lo este va a ser otro
 * despliegue de este mismo software: su propia base, su propia carta, su
 * propio personal y su propia caja. No se comparte ni un dato, y es a
 * proposito: mezclar las ventas de dos locales en una sola base es un
 * problema contable, no una comodidad.
 *
 * Lo que si se comparte es el jefe, que no tiene por que aprenderse dos
 * sistemas ni recordar dos direcciones. Por eso el panel lleva arriba un
 * selector que lo lleva al panel de la otra sede, a la MISMA seccion en la
 * que estaba. Ver las ventas de los dos locales es cambiar de pestana en el
 * selector, no buscar otro enlace.
 *
 * OJO: saltar exige volver a entrar. Son dos servidores distintos, cada uno
 * con sus usuarios y sus tokens, y la credencial de uno no vale en el otro. El
 * selector lo advierte en pantalla en vez de dejar que el otro sistema reciba
 * al jefe con una pantalla de acceso que no esperaba.
 *
 * MIENTRAS `VITE_URL_SEDE_HERMANA` VENGA VACIA EL SELECTOR NO SE PINTA, que
 * es la situacion de hoy: hay un solo local montado y un boton que lleva a una
 * direccion muerta es peor que no tener boton. El dia que Arjona exista, esto
 * se enciende llenando una variable de entorno; no hay nada que programar.
 */
export const RESTAURANTE_HERMANO = {
  nombre: 'Carly’s Arjona',
  nombreCompleto: 'Carly’s Restobar — Arjona',
  /** Lo que se lee bajo su nombre en el pie del sitio publico. */
  descripcionCorta: 'La sede de Arjona',
  /** URL de la otra sede, sin barra final. Vacia = todavia no hay. */
  url: sinBarraFinal(
    import.meta.env.VITE_URL_SEDE_HERMANA ?? import.meta.env.VITE_URL_HERMANO ?? '',
  ),
} as const

/** Si hay a donde saltar. Lo consulta el selector antes de pintarse. */
export const HAY_RESTAURANTE_HERMANO = RESTAURANTE_HERMANO.url !== ''

/**
 * Topicos del canal de tiempo real. Tienen que coincidir con Topicos.java: si
 * uno cambia de nombre, la pantalla que lo escuchaba se queda muda sin que nada
 * falle de forma visible.
 */
export const TOPICOS = {
  comandas: '/topic/comandas',
  mesas: '/topic/mesas',
  pedidos: '/topic/pedidos',
  general: '/topic/general',
} as const

/**
 * Margen con el que se renueva el token antes de que expire.
 *
 * Se renueva antes y no al fallar para que el mesero nunca vea un error de
 * sesion en medio de una comanda: cuando el token esta por vencer, ya hay otro.
 */
export const MARGEN_RENOVACION_SEGUNDOS = 120

export const CLAVE_SESION = 'carlys.sesion.v1'
export const CLAVE_ACCESO = 'carlys.acceso.v1'
export const CLAVE_REFRESCO = 'carlys.refresco.v1'
export const CLAVE_COLA = 'carlys.cola.v1'
/** Si el mostrador dejo el aviso sonoro encendido. Sobrevive al cambio de pestana. */
export const CLAVE_SONIDO_RECEPCION = 'carlys.recepcion.sonido.v1'
/**
 * Por que no se pudo entrar desde el otro restaurante.
 *
 * Lo escribe el canje del pase cuando falla y lo lee la pantalla de acceso, una
 * sola vez. Existe porque el canje ocurre antes de que haya ninguna pantalla
 * montada y no hay a quien avisarle todavia: sin esto, un pase rechazado deja
 * al dueno frente a un formulario de acceso sin ninguna explicacion.
 */
export const CLAVE_AVISO_CRUCE = 'carlys.cruce.aviso.v1'

