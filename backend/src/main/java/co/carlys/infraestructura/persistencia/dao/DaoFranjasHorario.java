package co.carlys.infraestructura.persistencia.dao;

import co.carlys.infraestructura.persistencia.filas.FilaFranjaHorario;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DaoFranjasHorario extends JpaRepository<FilaFranjaHorario, String> {

  List<FilaFranjaHorario> findAllByOrderByOrdenAsc();
}
