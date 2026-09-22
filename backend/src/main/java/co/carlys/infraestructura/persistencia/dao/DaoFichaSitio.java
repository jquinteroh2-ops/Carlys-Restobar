package co.carlys.infraestructura.persistencia.dao;

import co.carlys.infraestructura.persistencia.filas.FilaFichaSitio;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DaoFichaSitio extends JpaRepository<FilaFichaSitio, Integer> {}
