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
@Table(name = "alumno")
@Getter
@Setter
@NoArgsConstructor
public class Alumno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idAlumno;

    @Column(length = 50)
    private String nombre;

    @Column(length = 100)
    private String apellidos;

    @Column(length = 9)
    private String dni;

    @OneToMany(mappedBy = "alumno")
    @JsonIgnore // Para que no haya un bucle infinito entre entrenador y clases
    private List<Inscripcion> inscripciones;

}
