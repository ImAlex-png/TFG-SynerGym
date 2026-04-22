package com.synergym.services;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.synergym.persistence.entities.Clases;
import com.synergym.persistence.repositories.ClasesRepository;
import com.synergym.services.exceptions.ClaseNotFoundException;
import com.synergym.services.exceptions.ClaseException;

@Service
public class ClaseService {

    @Autowired
    private ClasesRepository clasesRepository;

    // Obtener todas las clases
    public List<Clases> findAll() {
        return clasesRepository.findAll();
    }

    // Buscar una clase por su ID
    public Clases findById(int idClase) {
        Optional<Clases> optionalClase = this.clasesRepository.findById(idClase);
        if (!optionalClase.isPresent()) {
            throw new ClaseNotFoundException("La clase con el ID " + idClase + " no existe");
        }
        return optionalClase.get();
    }

    // Crear una nueva clase
    public Clases create(Clases clase) {
        if (clase.getFechaFin().isBefore(clase.getFechaInicio())) {
            throw new ClaseException("La fecha de fin no puede ser anterior a la fecha de inicio");
        }

        if (clase.getHoraFin().isBefore(clase.getHoraInicio())) {
            throw new ClaseException("La hora de fin no puede ser anterior a la hora de inicio");
        }

        clase.setIdClases(0);

        // Si no se indica fecha de inicio, se pone la actual
        if (clase.getFechaInicio() == null) {
            clase.setFechaInicio(LocalDate.now());
        }

        // Validar que el nombre no esté vacío
        if (clase.getNombre() == null || clase.getNombre().trim().isEmpty()) {
            throw new ClaseException("El nombre de la clase es obligatorio");
        }

        return this.clasesRepository.save(clase);
    }

    // Eliminar una clase por su ID
    public void delete(int idClase) {
        if (!this.clasesRepository.existsById(idClase)) {
            throw new ClaseNotFoundException("La clase con el ID " + idClase + " no existe");
        }
        this.clasesRepository.deleteById(idClase);
    }

    // Actualizar una clase existente
    public Clases update(Clases clase, int idClase) {
        Clases claseBD = this.findById(idClase);
        
        claseBD.setNombre(clase.getNombre());
        claseBD.setFechaFin(clase.getFechaFin());
        claseBD.setHoraInicio(clase.getHoraInicio());
        claseBD.setHoraFin(clase.getHoraFin());
        claseBD.setCapacidadMaxima(clase.getCapacidadMaxima());
        claseBD.setEntrenador(clase.getEntrenador());

        return this.clasesRepository.save(claseBD);
    }

    // Obtener el calendario de clases para un entrenador específico
    public List<Clases> getCalendarioEntrenador(int idEntrenador) {
        return clasesRepository.findByEntrenadorId(idEntrenador);
    }

}
