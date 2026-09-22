package co.carlys;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

/** Punto de entrada del backend del Carly’s Restobar. */
@SpringBootApplication
@EnableScheduling
@EnableAsync
public class CarlysAplicacion {

  public static void main(String[] argumentos) {
    SpringApplication.run(CarlysAplicacion.class, argumentos);
  }
}
