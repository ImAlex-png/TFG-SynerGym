package com.synergym.services;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.synergym.persistence.entities.Usuario;
import com.synergym.persistence.entities.Inscripcion;
import com.synergym.persistence.entities.Clases;
import com.synergym.persistence.entities.enums.Estado;
import com.synergym.persistence.repositories.InscripcionRepository;
import com.synergym.services.exceptions.InscripcionNotFoundException;
import com.synergym.services.exceptions.InscripcionException;
import com.synergym.services.dto.InscripcionDTO;
import com.synergym.services.dto.UsuarioDTO;
import com.synergym.services.dto.ClaseDTO;

@Service
public class InscripcionService {

    @Autowired
    private InscripcionRepository inscripcionRepository;

    @Autowired
    private ClaseService claseService;

    // Obtener todas las inscripciones
    public List<InscripcionDTO> findAll() {
        List<Inscripcion> inscripciones = inscripcionRepository.findAll();
        List<InscripcionDTO> dtos = new ArrayList<>();
        for (Inscripcion i : inscripciones) {
            dtos.add(convertToDTO(i));
        }
        return dtos;
    }

    // Buscar una inscripción por su ID y devolver DTO
    public InscripcionDTO findByIdDTO(int idInscripcion) {
        return convertToDTO(findById(idInscripcion));
    }

    // Buscar una inscripción por su ID (para uso interno)
    public Inscripcion findById(int idInscripcion) {
        Optional<Inscripcion> optionalInscripcion = this.inscripcionRepository.findById(idInscripcion);
        if (!optionalInscripcion.isPresent()) {
            throw new InscripcionNotFoundException("El ID indicado no existe");
        }
        return optionalInscripcion.get();
    }

    // Crear una nueva inscripción
    public InscripcionDTO create(Inscripcion inscripcion) {
        // Validar que la clase existe y obtener info
        Clases clase = claseService.findById(inscripcion.getClases().getIdClases());
        
        // Regla: Una clase debe tener un entrenador asignado
        if (clase.getEntrenador() == null) {
            throw new InscripcionException("No se puede inscribir en una clase que no tiene entrenador asignado");
        }

        // Regla: No se puede crear una inscripción duplicada
        if (inscripcionRepository.existsByAlumnoIdAndClasesIdClases(inscripcion.getAlumno().getId(), clase.getIdClases())) {
            throw new InscripcionException("El alumno ya está inscrito en esta clase");
        }

        // Regla: Un alumno no puede inscribirse si la clase está llena
        long inscritos = inscripcionRepository.countByClasesIdClases(clase.getIdClases());
        if (inscritos >= clase.getCapacidadMaxima()) {
            throw new InscripcionException("La clase está llena. Capacidad máxima: " + clase.getCapacidadMaxima());
        }

        if (inscripcion.getFechaInscripcion() != null && inscripcion.getFechaInscripcion().isBefore(LocalDate.now())) {
            throw new InscripcionNotFoundException("La fecha de inscripcion no puede ser anterior a la fecha actual");
        }
        
        inscripcion.setFechaInscripcion(LocalDate.now());
        inscripcion.setEstado(Estado.ACEPTADA);
        inscripcion.setPagado(true);
        inscripcion.setIdInscripcion(0);

        Inscripcion saved = this.inscripcionRepository.save(inscripcion);
        return convertToDTO(saved);
    }

    // Actualizar una inscripción existente
    public InscripcionDTO update(Inscripcion inscripcion, int idInscripcion) {
        Inscripcion inscripcionBD = this.findById(idInscripcion);
        inscripcionBD.setEstado(inscripcion.getEstado());
        inscripcionBD.setPagado(inscripcion.isPagado());
        inscripcionBD.setFechaInscripcion(inscripcion.getFechaInscripcion());
        inscripcionBD.setAlumno(inscripcion.getAlumno());
        inscripcionBD.setClases(inscripcion.getClases());

        inscripcionBD.setClases(inscripcion.getClases());

        Inscripcion saved = this.inscripcionRepository.save(inscripcionBD);
        return convertToDTO(saved);
    }

    // Eliminar una inscripción por su ID
    public void deleteById(int idInscripcion) {
        if (!this.inscripcionRepository.existsById(idInscripcion)) {
            throw new InscripcionNotFoundException("El ID indicado no existe");
        }
        this.inscripcionRepository.deleteById(idInscripcion);
    }

    // Obtener la lista de alumnos inscritos en una clase específica
    public List<UsuarioDTO> getAlumnosDeClase(int idClase) {
        List<Inscripcion> inscripciones = inscripcionRepository.findByClasesIdClases(idClase);
        List<UsuarioDTO> alumnosDtos = new ArrayList<>();
        
        for (Inscripcion i : inscripciones) {
            Usuario u = i.getAlumno();
            alumnosDtos.add(new UsuarioDTO(
                u.getId(),
                u.getNombre(),
                u.getApellidos(),
                u.getDni(),
                u.getTelefono(),
                u.getEmail(),
                u.getRol(),
                u.isActivo()
            ));
        }
        
        return alumnosDtos;
    }

    // Método para convertir de Entidad a DTO (Sin usar programación funcional)
    public InscripcionDTO convertToDTO(Inscripcion i) {
        Usuario u = i.getAlumno();
        UsuarioDTO alumnoDTO = new UsuarioDTO(
            u.getId(),
            u.getNombre(),
            u.getApellidos(),
            u.getDni(),
            u.getTelefono(),
            u.getEmail(),
            u.getRol(),
            u.isActivo()
        );

        ClaseDTO claseDTO = claseService.convertToDTO(i.getClases());

        return new InscripcionDTO(
            i.getIdInscripcion(),
            i.getEstado(),
            i.isPagado(),
            i.getFechaInscripcion(),
            alumnoDTO,
            claseDTO
        );
    }
}
