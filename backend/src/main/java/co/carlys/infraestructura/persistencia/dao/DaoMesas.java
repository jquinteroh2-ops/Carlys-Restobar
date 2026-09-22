package co.carlys.infraestructura.persistencia.dao;

import co.carlys.infraestructura.persistencia.filas.FilaMesa;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DaoMesas extends JpaRepository<FilaMesa, String> {

  List<FilaMesa> findAllByOrderByNumeroAsc();
}
