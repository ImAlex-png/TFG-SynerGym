package com.synergym.services.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClaseCalendarioDTO {
    private int idClase;
    private String nombre;
    private LocalDate fecha;
    private LocalTime horaInicio;
    private LocalTime horaFin;
    private int numInscritos;
    private int capacidadMaxima;
    private int plazasDisponibles;
}
