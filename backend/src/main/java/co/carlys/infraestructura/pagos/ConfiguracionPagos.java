package co.carlys.infraestructura.pagos;

import co.carlys.dominio.puertos.PasarelaDePagos;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Arma el adaptador de Wompi con las credenciales del ambiente.
 *
 * La URL base decide sandbox o produccion; nunca es una bandera aparte que se
 * pueda desincronizar de la llave. En sandbox, `CARLYS_WOMPI_URL_BASE` apunta
 * a `https://sandbox.wompi.co/v1` con llaves de prueba; en Railway se cambia
 * junto con las llaves reales el dia que el restaurante este listo para cobrar
 * de verdad.
 */
@Configuration
public class ConfiguracionPagos {

  @Bean
  public PasarelaDePagos pasarelaDePagos(
      @Value("${carlys.wompi.url-base}") String urlBase,
      @Value("${carlys.wompi.llave-privada}") String llavePrivada) {
    return new AdaptadorWompi(urlBase, llavePrivada);
  }
}
