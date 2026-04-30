package com.synergym.services.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MensajeDTO {
    private int id;
    private String contenido;
    private LocalDateTime fechaEnvio;
    private int idEmisor;
    private String nombreEmisor;
    private int idConversacion;
}
