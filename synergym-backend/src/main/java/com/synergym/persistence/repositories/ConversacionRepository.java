package com.synergym.persistence.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.synergym.persistence.entities.Conversacion;
import com.synergym.persistence.entities.Usuario;
import com.synergym.persistence.entities.enums.TipoConversacion;

@Repository
public interface ConversacionRepository extends JpaRepository<Conversacion, Integer> {

    List<Conversacion> findByParticipantesId(int usuarioId);

    @Query("SELECT c FROM Conversacion c JOIN c.participantes p1 JOIN c.participantes p2 " +
           "WHERE c.tipo = 'PRIVADA' AND p1.id = :id1 AND p2.id = :id2")
    Optional<Conversacion> findPrivateChatBetween(@Param("id1") int id1, @Param("id2") int id2);
}
