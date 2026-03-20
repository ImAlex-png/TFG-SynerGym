package com.synergym.services.mappers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.synergym.persistence.entities.Clases;
import com.synergym.services.dto.ClaseDTO;

@Component
public class ClaseMapper {

    @Autowired
    private UsuarioMapper usuarioMapper;

    public ClaseDTO toDto(Clases clase) {
        if (clase == null) {
            return null;
        }
        ClaseDTO dto = new ClaseDTO();
        dto.setIdClases(clase.getIdClases());
        dto.setNombre(clase.getNombre());
        dto.setFechaInicio(clase.getFechaInicio());
        dto.setFechaFin(clase.getFechaFin());
        dto.setHoraInicio(clase.getHoraInicio());
        dto.setHoraFin(clase.getHoraFin());
        dto.setCapacidadMaxima(clase.getCapacidadMaxima());
        dto.setEntrenador(usuarioMapper.toDto(clase.getEntrenador()));
        return dto;
    }

    public Clases toEntity(ClaseDTO dto) {
        if (dto == null) {
            return null;
        }
        Clases clase = new Clases();
        clase.setIdClases(dto.getIdClases());
        clase.setNombre(dto.getNombre());
        clase.setFechaInicio(dto.getFechaInicio());
        clase.setFechaFin(dto.getFechaFin());
        clase.setHoraInicio(dto.getHoraInicio());
        clase.setHoraFin(dto.getHoraFin());
        clase.setCapacidadMaxima(dto.getCapacidadMaxima());
        clase.setEntrenador(usuarioMapper.toEntity(dto.getEntrenador()));
        return clase;
    }
}
