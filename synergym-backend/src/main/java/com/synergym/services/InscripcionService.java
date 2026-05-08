package com.synergym.services;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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

    @Autowired
    private UsuarioService usuarioService;

    // Obtener las inscripciones según el rol del usuario
    public List<Inscripcion> findAll() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String usernameActual = auth.getName();
        
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMINISTRADOR"));
        
        if (isAdmin) {
            return inscripcionRepository.findAll();
        } else {
            return inscripcionRepository.findByAlumnoEmail(usernameActual);
        }
    }

    public Inscripcion findById(int idInscripcion) {
        Optional<Inscripcion> optionalInscripcion = this.inscripcionRepository.findById(idInscripcion);
        if (!optionalInscripcion.isPresent()) {
            throw new InscripcionNotFoundException("El ID indicado no existe");
        }
        
        Inscripcion inscripcion = optionalInscripcion.get();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String usernameActual = auth.getName();
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMINISTRADOR"));
        
        if (!isAdmin && !inscripcion.getAlumno().getEmail().equals(usernameActual)) {
            throw new InscripcionException("No tienes permiso para ver esta inscripción");
        }
        
        return inscripcion;
    }

    public Inscripcion create(Inscripcion inscripcion) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String usernameActual = auth.getName();
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMINISTRADOR"));

        Usuario alumno;
        if (inscripcion.getAlumno() == null || inscripcion.getAlumno().getId() == 0 || !isAdmin) {
            alumno = usuarioService.findByEmail(usernameActual);
        } else {
            alumno = usuarioService.findById(inscripcion.getAlumno().getId());
        }

        Clases clase = claseService.findById(inscripcion.getClases().getIdClases());
        
        if (!isAdmin && !alumno.getEmail().equals(usernameActual)) {
            throw new InscripcionException("No tienes permiso para inscribir a otro usuario");
        }
        
        if (clase.getEntrenador() == null) {
            throw new InscripcionException("No se puede inscribir en una clase que no tiene entrenador asignado");
        }

        if (inscripcionRepository.existsByAlumnoIdAndClasesIdClases(alumno.getId(), clase.getIdClases())) {
            throw new InscripcionException("Ya estás inscrito en esta sesión");
        }

        // Validación de solapamiento de horarios
        List<Inscripcion> misInscripciones = inscripcionRepository.findByAlumnoId(alumno.getId());
        for (Inscripcion existing : misInscripciones) {
            Clases c = existing.getClases();
            if (c.getFecha().equals(clase.getFecha())) {
                boolean startsBeforeEnds = clase.getHoraInicio().isBefore(c.getHoraFin());
                boolean endsAfterStarts = clase.getHoraFin().isAfter(c.getHoraInicio());
                if (startsBeforeEnds && endsAfterStarts) {
                    throw new InscripcionException("Ya tienes otra clase (" + c.getNombre() + ") que coincide en este horario");
                }
            }
        }

        long inscritos = inscripcionRepository.countByClasesIdClases(clase.getIdClases());
        if (inscritos >= clase.getCapacidadMaxima()) {
            throw new InscripcionException("La clase está llena. Capacidad máxima: " + clase.getCapacidadMaxima());
        }

        inscripcion.setFechaInscripcion(LocalDate.now());
        inscripcion.setEstado(Estado.ACEPTADA);
        inscripcion.setIdInscripcion(0);
        inscripcion.setAlumno(alumno);
        inscripcion.setClases(clase);

        return this.inscripcionRepository.save(inscripcion);
    }

    public Inscripcion update(Inscripcion inscripcion, int idInscripcion) {
        Inscripcion inscripcionBD = this.findById(idInscripcion);
        inscripcionBD.setEstado(inscripcion.getEstado());
        inscripcionBD.setFechaInscripcion(inscripcion.getFechaInscripcion());
        inscripcionBD.setAlumno(inscripcion.getAlumno());
        inscripcionBD.setClases(inscripcion.getClases());
        return this.inscripcionRepository.save(inscripcionBD);
    }

    public void deleteById(int idInscripcion) {
        Inscripcion inscripcion = this.findById(idInscripcion);
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String usernameActual = auth.getName();
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMINISTRADOR"));

        if (!isAdmin && !inscripcion.getAlumno().getEmail().equals(usernameActual)) {
            throw new InscripcionException("No tienes permiso para borrar una inscripción que no te pertenece");
        }

        this.inscripcionRepository.deleteById(idInscripcion);
    }

    public List<Usuario> getAlumnosDeClase(int idClase) {
        List<Inscripcion> inscripciones = inscripcionRepository.findByClasesIdClases(idClase);
        List<Usuario> alumnos = new ArrayList<>();
        for (Inscripcion i : inscripciones) {
            alumnos.add(i.getAlumno());
        }
        return alumnos;
    }
}
