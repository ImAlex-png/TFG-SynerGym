package com.synergym.services.dto;

import java.time.LocalDate;
import com.synergym.persistence.entities.enums.Estado;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InscripcionDTO {
    private int idInscripcion;
    private Estado estado;
    private boolean pagado;
    private LocalDate fechaInscripcion;
    private UsuarioDTO alumno;
    private ClaseDTO clases;
}
