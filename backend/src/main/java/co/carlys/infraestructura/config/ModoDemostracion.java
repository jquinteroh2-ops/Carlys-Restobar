package co.carlys.infraestructura.config;

import co.carlys.dominio.personal.Rol;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * El interruptor de las cuentas de demostracion.
 *
 * Mostrar el sistema a alguien exige lo contrario que operarlo: hacen falta
 * seis usuarios con una clave que quepa en la cabeza y que este escrita en la
 * pantalla de acceso, para poder saltar de la comandera a la cocina y a la caja
 * delante de quien mira sin detenerse a buscar un papel.
 *
 * Eso es exactamente lo que se retiro al entrar a produccion, y con razon: una
 * clave impresa en la pantalla es una clave publica. La diferencia ahora es que
 * no lo decide el codigo sino quien despliega, con una variable de entorno:
 *
 *   CARLYS_CLAVE_DEMO=carlys2026
 *
 * Vacia o ausente —que es lo que ocurre si nadie hace nada— el modo no existe:
 * el sembrador vuelve a generar claves al azar y el endpoint publico no entrega
 * ninguna cuenta. Un despliegue de produccion no puede caer en demostracion por
 * descuido, solo por decision.
 */
@Component
public class ModoDemostracion {

  /**
   * Una cuenta que se muestra en la demostracion.
   *
   * `destino` no es dato del dominio: es la frase que se lee en la pantalla de
   * acceso para saber a donde lleva cada fila. Vive aqui porque esta lista y
   * esa pantalla son la misma cosa vista desde los dos lados.
   */
  public record Cuenta(String usuario, String nombre, Rol rol, String destino) {}

  /**
   * Los seis roles de la casa, con dos meseros porque pasarse una mesa de uno a
   * otro es justo lo que hay que poder enseñar.
   */
  private static final List<Cuenta> CUENTAS =
      List.of(
          new Cuenta("mesero", "Valentina Julio", Rol.MESERO, "Comandera"),
          new Cuenta("mesero2", "Andrés Barrios", Rol.MESERO, "Comandera"),
          new Cuenta("cocina", "Luis Carlos Pérez", Rol.COCINA, "Pantalla de cocina"),
          new Cuenta("recepcion", "Daniela Castro", Rol.RECEPCION, "Domicilios, para llevar y reservas"),
          new Cuenta("repartidor", "Kevin Arrieta", Rol.REPARTIDOR, "Sus entregas en la calle"),
          new Cuenta("cajero", "Paola Guerrero", Rol.CAJERO, "Caja y cierre"),
          new Cuenta("admin", "Carlos Mario Díaz", Rol.ADMINISTRADOR, "Panel completo"));

  private final String clave;

  public ModoDemostracion(@Value("${carlys.demostracion.clave:}") String clave) {
    this.clave = clave == null ? "" : clave.trim();
  }

  public boolean activo() {
    return !clave.isEmpty();
  }

  /** La clave compartida por las seis cuentas. Vacia cuando el modo esta apagado. */
  public String clave() {
    return clave;
  }

  public List<Cuenta> cuentas() {
    return CUENTAS;
  }
}
