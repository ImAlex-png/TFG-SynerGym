package com.synergym.persistence.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.synergym.persistence.entities.Mensaje;

@Repository
public interface MensajeRepository extends JpaRepository<Mensaje, Integer> {
    List<Mensaje> findByConversacionIdOrderByFechaEnvioAsc(int conversacionId);
}
