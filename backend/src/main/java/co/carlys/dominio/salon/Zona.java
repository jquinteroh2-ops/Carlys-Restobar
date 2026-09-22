package co.carlys.dominio.salon;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Zona {
  SALON,
  BARRA,
  TERRAZA,
  PRIVADO;

  @JsonValue
  public String codigo() { return name().toLowerCase(); }

  @JsonCreator
  public static Zona de(String valor) { return valueOf(valor.toUpperCase()); }
}
