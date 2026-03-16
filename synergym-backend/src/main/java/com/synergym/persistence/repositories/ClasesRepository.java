package com.synergym.persistence.repositories;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.synergym.persistence.entities.Clases;

public interface ClasesRepository extends JpaRepository<Clases, Integer> {
    List<Clases> findByEntrenadorId(int idEntrenador);
}
