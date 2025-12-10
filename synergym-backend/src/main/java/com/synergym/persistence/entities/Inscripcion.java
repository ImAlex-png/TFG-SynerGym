package com.synergym.persistence.entities;

import java.time.LocalDate;

import com.synergym.persistence.entities.enums.Estado;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.persistence.GenerationType;

@Entity
@Table(name = "inscripcion")
@Getter
@Setter
@NoArgsConstructor
public class Inscripcion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idInscripcion;

    @Enumerated(EnumType.STRING)
    private Estado estado;

    @Column(columnDefinition = "BOOLEAN")
    private boolean pagado;

    @Column(name = "fecha_inscripcion")
    private LocalDate fechaInscripcion;

    @ManyToOne
    @JoinColumn(name = "idAlumno")
    private Alumno alumno;

    @ManyToOne
    @JoinColumn(name = "idClases")
    private Clases clases;
}
