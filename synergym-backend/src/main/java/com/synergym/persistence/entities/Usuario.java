package com.synergym.persistence.entities;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.synergym.persistence.entities.enums.Rol;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "usuario")
@Getter
@Setter
@NoArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(length = 50, nullable = false)
    private String nombre;

    @Column(length = 100, nullable = false)
    private String apellidos;

    @Column(length = 9, unique = true)
    private String dni;

    @Column(length = 15)
    private String telefono;

    @Column(length = 100, unique = true, nullable = false)
    private String email;

    @Column(length = 255, nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Rol rol;

    @OneToMany(mappedBy = "alumno")
    @JsonIgnore
    private List<Inscripcion> inscripciones;

    @OneToMany(mappedBy = "entrenador")
    @JsonIgnore
    private List<Clases> clases;

    @Column(nullable = false)
    private boolean activo = true;

}
