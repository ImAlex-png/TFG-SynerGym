package com.synergym.persistence.entities;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

@Entity
public class Entrenador {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idEntrenador;

    private String nombre;
    private String apellidos;
    private String telefono;

    @OneToMany(mappedBy = "entrenador")
    private List<Clases> clases;

    //Getter and setters
}
