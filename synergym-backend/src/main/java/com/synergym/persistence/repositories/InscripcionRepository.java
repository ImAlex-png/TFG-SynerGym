package com.synergym.persistence.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.synergym.persistence.entities.Inscripcion;
import java.util.List;

public interface InscripcionRepository extends JpaRepository<Inscripcion, Integer> {
    
    boolean existsByAlumnoIdAndClasesIdClases(int alumnoId, int claseId);
    
    long countByClasesIdClases(int claseId);

    List<Inscripcion> findByClasesIdClases(int claseId);
    
    List<Inscripcion> findByAlumnoEmail(String email);
}
