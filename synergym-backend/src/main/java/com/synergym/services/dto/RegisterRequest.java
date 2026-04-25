package com.synergym.services.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class RegisterRequest {
	
	private String username;
	private String password1;
	private String password2;
	private String email;
	private com.synergym.persistence.entities.enums.Rol rol;	private String telefono;
	private String dni;
	private String nombre;
	private String apellidos;

}
