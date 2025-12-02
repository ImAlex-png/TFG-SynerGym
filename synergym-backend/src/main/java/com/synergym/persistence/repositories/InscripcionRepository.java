package com.synergym.persistence.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.synergym.persistence.entities.Inscripcion;

public interface InscripcionRepository extends JpaRepository<Inscripcion, Integer> {
    
}
