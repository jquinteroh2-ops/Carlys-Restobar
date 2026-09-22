package co.carlys.infraestructura.persistencia.dao;

import co.carlys.infraestructura.persistencia.filas.FilaItemCarta;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DaoItemsCarta extends JpaRepository<FilaItemCarta, String> {

  List<FilaItemCarta> findAllByOrderByNombreAsc();
}
