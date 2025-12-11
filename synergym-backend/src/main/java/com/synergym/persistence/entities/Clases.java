package com.synergym.persistence.entities;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "clases")
@Getter
@Setter
@NoArgsConstructor
public class Clases {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idClases;

    @Column(name = "nombre")
    private String nombre;

    @Column(name = "fecha_inicio")
    private LocalDate fechaInicio;

    @Column(name = "fecha_fin")
    private LocalDate fechaFin;

    @ManyToOne
    @JoinColumn(name = "idEntrenador")
    private Entrenador entrenador;

    @OneToMany(mappedBy = "clases")
    private List<Inscripcion> inscripciones;

}
