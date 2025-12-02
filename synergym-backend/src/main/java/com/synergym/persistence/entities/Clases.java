package com.synergym.persistence.entities;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

@Entity
public class Clases {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idClases;

    private LocalDate fechaInicio;
    private LocalDate fechaFin;

    @ManyToOne
    @JoinColumn(name = "idEntrenador")
    private Entrenador entrenador;

    @OneToMany(mappedBy = "clases")
    private List<Inscripcion> inscripciones;

    //Getter and setters
}
