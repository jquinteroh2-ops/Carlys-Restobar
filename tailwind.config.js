/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // --- Sitio publico: negro y dorado, minimalista ---
        //
        // Carly’s es una casa seria: negro de base, dorado como UNICO metal y
        // un blanco apenas calido para el texto. El dorado se usa con
        // cuentagotas —el boton principal, una linea corta, el precio— y el
        // resto es negro y aire. Repartido por toda la pantalla deja de ser
        // un acento y la casa se ve recargada en vez de elegante.
        //
        // El logotipo es blanco y negro puro; el dorado lo pone el sistema.
        hueso: {
          50: '#F7F5F0',
          100: '#EDEAE3',
          200: '#DAD5CB',
          300: '#BDB6A9',
          400: '#9C9486',
        },
        // El fondo. Negro NEUTRO, sin marron adentro: sobre un negro calido el
        // dorado se ensucia y tira a mostaza; sobre uno neutro se separa y se
        // lee como metal. Negro puro (#000) no: en pantalla se ve plano.
        carbon: {
          950: '#0A0A0A',
          900: '#111111',
          800: '#181818',
          700: '#232323',
          600: '#2F2F2F',
          500: '#474747',
        },
        // El dorado de la casa. Es CLARO, y de ahi sale una regla para todo el
        // sistema: sobre dorado el texto va OSCURO (carbon-950), nunca claro.
        // Un boton dorado con texto blanco encima no pasa el contraste.
        //
        // Es un dorado viejo, apagado —no amarillo—: el amarillo brillante es
        // el de una promocion; el apagado es el de un herraje.
        dorado: {
          700: '#7A633C',
          600: '#9E8150',
          500: '#BFA06A',
          400: '#CDB482',
          300: '#DCC79C',
          200: '#EFE3C8',
        },
        // --- Areas operativas: neutro profundo, se usan de noche ---
        noche: {
          950: '#08080A',
          900: '#101012',
          850: '#16161A',
          800: '#1D1D22',
          700: '#27272E',
          600: '#37373F',
          500: '#4E4E58',
          400: '#7E7E8A',
          300: '#ADADB8',
        },
        // --- Semantica de estado, consistente en todo el sistema ---
        estado: {
          listo: '#22C55E',
          'listo-suave': '#0F3D22',
          proceso: '#F59E0B',
          'proceso-suave': '#40300A',
          demorado: '#EF4444',
          'demorado-suave': '#3F1414',
          libre: '#6B7280',
          reservada: '#3B82F6',
          'reservada-suave': '#12294A',
        },
      },
      fontFamily: {
        // Una sola familia para marca y titulos —Jost, geometrica y fina— y
        // Manrope para leer. Sin serifas a proposito: las capitales romanas
        // son la elegancia clasica; aqui la elegancia es la sobriedad.
        marca: ['Jost', 'Futura', 'Avenir', 'sans-serif'],
        titulo: ['Jost', 'Futura', 'Avenir', 'sans-serif'],
        texto: ['Manrope', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      minHeight: {
        toque: '48px',
      },
      height: {
        toque: '48px',
      },
      keyframes: {
        entrada: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        destello: {
          '0%': { boxShadow: '0 0 0 0 rgba(191,160,106,0.55)' },
          '70%': { boxShadow: '0 0 0 12px rgba(191,160,106,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(191,160,106,0)' },
        },
        latido: {
          '0%,100%': { opacity: '1' },
          '50%': { opacity: '0.45' },
        },
        deslizar: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        aparecer: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        caer: {
          '0%': { opacity: '0', transform: 'translateY(-12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        // El barrido de luz de los esqueletos de carga.
        //
        // Se mueve el FONDO y no el elemento: un hijo desplazandose dentro de
        // una caja obliga al navegador a recortarlo en cada cuadro, y con
        // treinta esqueletos en pantalla —una tabla de ventas— eso se nota en
        // un celular de mostrador. Un degradado que se corre lo resuelve la
        // tarjeta grafica sola.
        brillo: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        // La respiracion del emblema mientras el sistema abre.
        respirar: {
          '0%,100%': { opacity: '0.55', transform: 'scale(0.97)' },
          '50%': { opacity: '1', transform: 'scale(1)' },
        },
        // La barra que cruza bajo el emblema en la pantalla de arranque. No
        // mide progreso —nadie sabe cuanto falta— y por eso va y viene en vez
        // de llenarse: una barra que se llena y se queda quieta miente.
        vaiven: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(300%)' },
        },
        // El trazo que se dibuja solo. Lo usa la herradura del arranque.
        trazar: {
          '0%': { strokeDashoffset: '1000' },
          '55%,100%': { strokeDashoffset: '0' },
        },
      },
      animation: {
        entrada: 'entrada 0.22s ease-out',
        destello: 'destello 1.1s ease-out 2',
        latido: 'latido 1.6s ease-in-out infinite',
        deslizar: 'deslizar 0.24s cubic-bezier(0.32, 0.72, 0, 1)',
        aparecer: 'aparecer 0.18s ease-out',
        caer: 'caer 0.2s ease-out',
        brillo: 'brillo 1.6s linear infinite',
        respirar: 'respirar 2.4s ease-in-out infinite',
        vaiven: 'vaiven 1.4s ease-in-out infinite',
        trazar: 'trazar 2.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
