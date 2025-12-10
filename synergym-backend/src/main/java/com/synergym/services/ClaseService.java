package com.synergym.services;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.synergym.persistence.entities.Clases;
import com.synergym.persistence.repositories.ClasesRepository;
import com.synergym.services.exceptions.ClaseNotFoundException;
import com.synergym.services.exceptions.ClasesException;

@Service
public class ClaseService extends RuntimeException {

    @Autowired
    private ClasesRepository clasesRepository;

    // Find all clases
    public List<Clases> findAll() {
        return clasesRepository.findAll();
    }

    // Find clase by ID
    public Clases findById(int idClase) {
        if (!this.clasesRepository.existById(idClase)) {
            throw new ClaseNotFoundException("La clase con el ID" + idClase + " no existe");
        }
        return this.clasesRepository.findById(idClase).get();
    }

    // Crear una clase
    public Clases create(Clases clase) {
        if (clase.getFechaFin().isBefore(clase.getFechaInicio())) {
            throw new ClasesException("La fecha de fin no puede ser anterior a la fecha de inicio");

        }

        clase.setIdClases(0);
        clase.setEntrenador(null);
        clase.setInscripciones(null);

        // Si no se indica fecha de inicio, se pone la actual
        if (clase.getFechaInicio() == null) {
            clase.setFechaInicio(LocalDate.now());

        }

        // Validar que el nombre no esté vacío
        if (clase.getNombre() == null || clase.getNombre().trim().isEmpty()) {
            throw new ClasesException("El nombre de la clase es obligatorio");
        }

        return this.clasesRepository.save(clase);
    }

    //Eliminar una clase por ID
    public void delete(int idClase) {
        if(!this.clasesRepository.existById(idClase)) {
            throw new ClaseNotFoundException("La clase con el ID " + idClase + " no existe");
        }
        this.clasesRepository.deleteById(idClase);
    }

    // Update clase ( no se puede modificar la fecha de inicio)
    public Clases update(Clases clase, int idClase) {
        if(clase.getIdClases() != idClase) {
            throw new ClasesException("El ID de la clase no coincide con el ID de la URL");
        }

        if(!this.clasesRepository.existById(idClase)) {
            throw new ClasesException("La tarea con el ID " + idClase + " no existe");
        }

        if(clase.getFechaInicio() != null) {
            throw new ClasesException("La fecha de inicio no se puede modificar");
        }

        Clases claseBD = this.findById(idClase);
        claseBD.setNombre(clase.getNombre());
        claseBD.setFechaFin(clase.getFechaFin());
        claseBD.setEntrenador(clase.getEntrenador());
        claseBD.setInscripciones(clase.getInscripciones());

        return this.clasesRepository.save(claseBD);

    }

}
