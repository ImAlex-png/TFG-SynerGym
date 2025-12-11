package com.synergym.services;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.synergym.persistence.entities.Alumno;
import com.synergym.persistence.entities.Inscripcion;
import com.synergym.persistence.entities.enums.Estado;
import com.synergym.services.exceptions.InscripcionNotFoundException;

@Service
public class InscripcionService {

    @Autowired
    private InscripcionService inscripcionService;

    // Todos las inscripciones
    public List<Inscripcion> findAll() {
        return inscripcionService.findAll();
    }

    // Inscripcion por ID
    public Inscripcion findById(int idInscripcion) {
       if(!this.inscripcionService.existsById(idInscripcion)) {
            throw new  InscripcionNotFoundException("El ID indicado no existe");
       }
       return this.inscripcionService.findById(idInscripcion).get();
    }

    //Crear una inscripcion
    public Inscripcion create(Inscripcion inscripcion) {
       if(inscripcion.getFechaInscripcion().isBefore(LocalDate.now())){
        throw new InscripcionNotFoundException("La fecha de inscripcion no puede ser anterior a la fecha actual");
       } else{
        inscripcion.setFechaInscripcion(LocalDate.now());
        inscripcion.setEstado(Estado.ACEPTADA);
        inscripcion.setPagado(true);
        inscripcion.setIdInscripcion(0);

        return this.inscripcionService.save(inscripcion);

       }
    }

    //Actualizar inscripcion
    public Inscripcion update(Inscripcion inscripcion, int idInscripcion) {
        Inscripcion inscripcionBD = this.findById(idInscripcion);
        inscripcionBD.setEstado(inscripcion.getEstado());
        inscripcionBD.setPagado(inscripcion.isPagado());
        inscripcionBD.setFechaInscripcion(inscripcion.getFechaInscripcion());
        inscripcionBD.setAlumno(inscripcion.getAlumno());
        inscripcionBD.setClases(inscripcion.getClases());

        return this.inscripcionService.save(inscripcionBD);
    }

    // Eliminar inscripcion por ID
    public void deleteById(int idInscripcion) {
        if(!this.inscripcionService.existsById(idInscripcion)) {
            throw new InscripcionNotFoundException("El ID indicado no existe");
        }
        this.inscripcionService.deleteById(idInscripcion);
    }   
}
