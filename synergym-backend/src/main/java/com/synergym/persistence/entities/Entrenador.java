package com.synergym.persistence.entities;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "entrenador")
@Getter
@Setter
@NoArgsConstructor
public class Entrenador {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idEntrenador;

    @Column(length = 100)
    private String nombre;

    @Column(length = 100)
    private String apellidos;

    @Column(length = 9)
    private String telefono;

    @OneToMany(mappedBy = "entrenador")
    @JsonIgnore // Para que no haya un bucle infinito entre entrenador y clases
    private List<Clases> clases;

}
