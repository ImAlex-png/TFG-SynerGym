package com.synergym.services.mappers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.synergym.persistence.entities.Inscripcion;
import com.synergym.services.dto.InscripcionDTO;

@Component
public class InscripcionMapper {

    @Autowired
    private UsuarioMapper usuarioMapper;

    @Autowired
    private ClaseMapper claseMapper;

    public InscripcionDTO toDto(Inscripcion inscripcion) {
        if (inscripcion == null) {
            return null;
        }
        InscripcionDTO dto = new InscripcionDTO();
        dto.setIdInscripcion(inscripcion.getIdInscripcion());
        dto.setEstado(inscripcion.getEstado());
        dto.setPagado(inscripcion.isPagado());
        dto.setFechaInscripcion(inscripcion.getFechaInscripcion());
        dto.setAlumno(usuarioMapper.toDto(inscripcion.getAlumno()));
        dto.setClases(claseMapper.toDto(inscripcion.getClases()));
        return dto;
    }

    public Inscripcion toEntity(InscripcionDTO dto) {
        if (dto == null) {
            return null;
        }
        Inscripcion inscripcion = new Inscripcion();
        inscripcion.setIdInscripcion(dto.getIdInscripcion());
        inscripcion.setEstado(dto.getEstado());
        inscripcion.setPagado(dto.isPagado());
        inscripcion.setFechaInscripcion(dto.getFechaInscripcion());
        inscripcion.setAlumno(usuarioMapper.toEntity(dto.getAlumno()));
        inscripcion.setClases(claseMapper.toEntity(dto.getClases()));
        return inscripcion;
    }
}
