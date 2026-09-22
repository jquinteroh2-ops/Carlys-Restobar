package co.carlys.infraestructura.persistencia.dao;

import co.carlys.infraestructura.persistencia.filas.FilaZonaDomicilio;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DaoZonasDomicilio extends JpaRepository<FilaZonaDomicilio, String> {

  List<FilaZonaDomicilio> findAllByOrderByOrdenAsc();
}
