package co.carlys.infraestructura.seguridad;

import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * La confianza entre las dos sedes, en una sola pieza.
 *
 * <p>Turbaco y Arjona son despliegues separados: dos bases, dos juegos de
 * usuarios, dos secretos de sesión. Lo único que comparten es ESTE secreto, y
 * no firma ninguna sesión. Con él se firman los dos papeles que cruzan de una
 * sede a la otra:
 *
 * <ul>
 *   <li>el <b>pase</b>, que deja al dueño entrar al otro panel sin volver a
 *       escribir la clave ({@link ServicioPaseDeCruce});
 *   <li>el <b>espejo</b>, que lleva al otro local el cambio que el dueño acaba
 *       de hacer sobre su propia cuenta ({@link ServicioEspejoDeCuenta}).
 * </ul>
 *
 * <p>Vive aparte de los dos porque la llave es una sola y las reglas de una
 * llave —el mínimo de longitud, qué hacer si no está configurada— no se pueden
 * escribir dos veces y esperar que sigan iguales dentro de un año.
 *
 * <p><b>Sin secreto, todo esto queda apagado.</b> Es el estado por defecto y el
 * correcto para un despliegue suelto, que no tiene otra sede al lado: no se
 * emite nada y no se acepta nada.
 */
@Component
public class LlaveDeCruce {

  private final SecretKey llave;
  private final String nombreDeEsteRestaurante;

  public LlaveDeCruce(
      @Value("${carlys.cruce.secreto:}") String secreto,
      @Value("${carlys.cruce.nombre:Carly’s}") String nombre) {
    if (secreto == null || secreto.isBlank()) {
      this.llave = null;
    } else {
      // El mismo mínimo que exige la firma de las sesiones. Un secreto corto se
      // rompe por fuerza bruta, y este abre la puerta del panel del otro
      // restaurante y además puede cambiarle la clave al dueño: se falla al
      // arrancar en vez de aceptarlo en silencio.
      byte[] bytes = secreto.getBytes(StandardCharsets.UTF_8);
      if (bytes.length < 32) {
        throw new IllegalStateException(
            "CARLYS_CRUCE_SECRETO debe tener al menos 32 caracteres: la firma actual es débil");
      }
      this.llave = Keys.hmacShaKeyFor(bytes);
    }
    this.nombreDeEsteRestaurante = nombre;
  }

  /** Si el cruce entre restaurantes está configurado en este despliegue. */
  public boolean activo() {
    return llave != null;
  }

  /** La llave. Nula si el cruce no está configurado; nadie debe usarla sin mirar {@link #activo()}. */
  SecretKey llave() {
    return llave;
  }

  /** Cómo se presenta este restaurante en los papeles que manda al otro. */
  public String nombreDeEsteRestaurante() {
    return nombreDeEsteRestaurante;
  }
}
