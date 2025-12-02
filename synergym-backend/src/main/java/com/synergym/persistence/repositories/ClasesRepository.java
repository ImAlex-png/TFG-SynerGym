package com.synergym.persistence.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.synergym.persistence.entities.Clases;

public interface ClasesRepository extends JpaRepository<Clases, Integer> {
    
}
