package com.synergym.persistence.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.synergym.persistence.entities.Entrenador;

public interface EntrenadorRepository extends JpaRepository<Entrenador, Integer> {
    
}
