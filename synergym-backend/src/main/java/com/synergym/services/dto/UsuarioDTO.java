package com.synergym.services.dto;

import com.synergym.persistence.entities.enums.Rol;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioDTO {
    private int id;
    private String nombre;
    private String apellidos;
    private String dni;
    private String telefono;
    private String email;
    private Rol rol;
    private boolean activo;
}
