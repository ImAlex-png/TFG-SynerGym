package com.synergym.persistence.entities;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

@Entity
public class Alumno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idAlumno;

    private String nombre;
    private String apellidos;
    private String dni;

    @OneToMany(mappedBy = "alumno")
    private List<Inscripcion> inscripciones;

    //Getters y setters

}
