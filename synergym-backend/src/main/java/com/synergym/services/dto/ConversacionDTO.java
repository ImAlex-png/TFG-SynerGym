package com.synergym.services.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.synergym.persistence.entities.enums.TipoConversacion;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConversacionDTO {
    private int id;
    private String nombre;
    private TipoConversacion tipo;
    private LocalDateTime fechaCreacion;
    private List<Integer> idParticipantes;
    private String ultimoMensaje;
}
