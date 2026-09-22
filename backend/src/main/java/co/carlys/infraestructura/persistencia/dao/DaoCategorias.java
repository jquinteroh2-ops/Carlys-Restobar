package co.carlys.infraestructura.persistencia.dao;

import co.carlys.infraestructura.persistencia.filas.FilaCategoria;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DaoCategorias extends JpaRepository<FilaCategoria, String> {

  List<FilaCategoria> findAllByOrderByOrdenAsc();
}
