package co.carlys.infraestructura.persistencia.dao;

import co.carlys.infraestructura.persistencia.filas.FilaCierreCaja;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DaoCierres extends JpaRepository<FilaCierreCaja, String> {

  List<FilaCierreCaja> findAllByOrderByFechaHoraDesc();
}
