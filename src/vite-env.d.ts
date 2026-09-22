/// <reference types="vite/client" />

/**
 * Variables de entorno del frontend.
 *
 * Se declaran aqui para que TypeScript falle si alguien escribe mal el nombre
 * de una: en Vite una variable inexistente llega como `undefined` sin avisar, y
 * eso termina en una aplicacion desplegada que consulta la URL equivocada.
 *
 * Solo las que empiezan por VITE_ llegan al navegador, y todas quedan escritas
 * en el paquete compilado: aqui nunca va un secreto.
 */
interface ImportMetaEnv {
  /** URL base del API. Sin barra final. */
  readonly VITE_URL_API?: string
  /** URL del WebSocket. Si falta, se deduce de la del API. */
  readonly VITE_URL_WS?: string
  /**
   * `'true'` enciende la emision de documentos fiscales desde Carly’s.
   *
   * Ausente o cualquier otro valor la deja apagada, que es lo correcto
   * mientras no se defina quien factura. Ver `FACTURACION_INTERNA_HABILITADA`.
   */
  readonly VITE_FACTURACION_INTERNA_HABILITADA?: string
  /**
   * URL del sistema de la otra sede —Arjona—, sin barra final.
   *
   * Es lo unico que ata las dos sedes. Si falta, el panel administrativo no
   * pinta el selector para cambiar de local, que es lo que se quiere hoy:
   * Arjona todavia no esta montada.
   */
  readonly VITE_URL_SEDE_HERMANA?: string
  /** Nombre viejo de `VITE_URL_SEDE_HERMANA`. Se lee por compatibilidad. */
  readonly VITE_URL_HERMANO?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

/** Sello de la compilacion, inyectado por vite.config.ts. */
declare const __VERSION_APP__: string
