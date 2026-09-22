package co.carlys.infraestructura.persistencia.dao;

import co.carlys.infraestructura.persistencia.filas.FilaReserva;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DaoReservas extends JpaRepository<FilaReserva, String> {

  List<FilaReserva> findAllByOrderByFechaHoraAsc();
}
