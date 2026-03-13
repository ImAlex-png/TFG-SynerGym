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

@Service
public class InscripcionService {

    @Autowired
    private InscripcionRepository inscripcionRepository;

    @Autowired
    private ClaseService claseService;

    // Todos las inscripciones
    public List<Inscripcion> findAll() {
        return inscripcionRepository.findAll();
    }

    // Inscripcion por ID
    public Inscripcion findById(int idInscripcion) {
        Optional<Inscripcion> optionalInscripcion = this.inscripcionRepository.findById(idInscripcion);
        if (!optionalInscripcion.isPresent()) {
            throw new InscripcionNotFoundException("El ID indicado no existe");
        }
        return optionalInscripcion.get();
    }

    // Crear una inscripcion
    public Inscripcion create(Inscripcion inscripcion) {
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

        return this.inscripcionRepository.save(inscripcion);
    }

    // Actualizar inscripcion
    public Inscripcion update(Inscripcion inscripcion, int idInscripcion) {
        Inscripcion inscripcionBD = this.findById(idInscripcion);
        inscripcionBD.setEstado(inscripcion.getEstado());
        inscripcionBD.setPagado(inscripcion.isPagado());
        inscripcionBD.setFechaInscripcion(inscripcion.getFechaInscripcion());
        inscripcionBD.setAlumno(inscripcion.getAlumno());
        inscripcionBD.setClases(inscripcion.getClases());

        return this.inscripcionRepository.save(inscripcionBD);
    }

    // Eliminar inscripcion por ID
    public void deleteById(int idInscripcion) {
        if (!this.inscripcionRepository.existsById(idInscripcion)) {
            throw new InscripcionNotFoundException("El ID indicado no existe");
        }
        this.inscripcionRepository.deleteById(idInscripcion);
    }

    // Obtener alumnos de una clase específica
    public List<Usuario> getAlumnosDeClase(int idClase) {
        List<Inscripcion> inscripciones = inscripcionRepository.findByClasesIdClases(idClase);
        List<Usuario> alumnos = new ArrayList<>();
        
        for (Inscripcion i : inscripciones) {
            alumnos.add(i.getAlumno());
        }
        
        return alumnos;
    }
}
