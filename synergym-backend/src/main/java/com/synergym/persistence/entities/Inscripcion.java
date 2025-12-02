package com.synergym.persistence.entities;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.GenerationType;

@Entity
public class Inscripcion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idInscripcion;

    private String estado;

    private boolean pagado;

    private LocalDate fechaInscripcion;

    @ManyToOne
    @JoinColumn(name = "idAlumno")
    private Alumno alumno;

    @ManyToOne
    @JoinColumn(name = "idClases")
    private Clases clases;

    //Getters y setters
}
