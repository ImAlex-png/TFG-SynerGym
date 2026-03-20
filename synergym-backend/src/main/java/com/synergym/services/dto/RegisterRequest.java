package com.synergym.services.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String username; // Se usará como email
    private String password1;
    private String password2;
    private String nombre;
    private String apellidos;
    private String dni;
    private String telefono;
}
