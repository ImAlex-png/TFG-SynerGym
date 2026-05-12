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

    @Autowired
    private com.synergym.persistence.repositories.InscripcionRepository inscripcionRepository;

    // Obtener todas las clases
    public List<Clases> findAll() {
        List<Clases> clases = clasesRepository.findAll();
        for (Clases c : clases) {
            c.setAlumnosInscritos((int) inscripcionRepository.countByClasesIdClases(c.getIdClases()));
        }
        return clases;
    }

    // Buscar una clase por su ID
    public Clases findById(int idClase) {
        Optional<Clases> optionalClase = this.clasesRepository.findById(idClase);
        if (!optionalClase.isPresent()) {
            throw new ClaseNotFoundException("La clase con el ID " + idClase + " no existe");
        }
        Clases c = optionalClase.get();
        c.setAlumnosInscritos((int) inscripcionRepository.countByClasesIdClases(c.getIdClases()));
        return c;
    }

    // Crear una nueva clase
    public Clases create(Clases clase) {
        if (clase.getFecha() == null) {
            clase.setFecha(LocalDate.now());
        }

        if (clase.getFecha().isBefore(LocalDate.now())) {
            throw new ClaseException("La fecha de la clase no puede ser anterior a la actual");
        }

        if (clase.getHoraFin().isBefore(clase.getHoraInicio())) {
            throw new ClaseException("La hora de fin no puede ser anterior a la hora de inicio");
        }

        clase.setIdClases(0);

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
        claseBD.setFecha(clase.getFecha());
        claseBD.setHoraInicio(clase.getHoraInicio());
        claseBD.setHoraFin(clase.getHoraFin());
        claseBD.setCapacidadMaxima(clase.getCapacidadMaxima());
        claseBD.setEntrenador(clase.getEntrenador());

        return this.clasesRepository.save(claseBD);
    }

    // Obtener el calendario de clases para un entrenador específico (solo futuras o en curso)
    public List<Clases> getCalendarioEntrenador(int idEntrenador) {
        LocalDate today = LocalDate.now();
        java.time.LocalTime now = java.time.LocalTime.now();
        
        List<Clases> clases = clasesRepository.findByEntrenadorIdAndFechaGreaterThanEqualOrderByFechaAscHoraInicioAsc(idEntrenador, today);
        
        return clases.stream()
            .filter(c -> c.getFecha().isAfter(today) || (c.getFecha().isEqual(today) && c.getHoraFin().isAfter(now)))
            .map(c -> {
                c.setAlumnosInscritos((int) inscripcionRepository.countByClasesIdClases(c.getIdClases()));
                return c;
            })
            .collect(java.util.stream.Collectors.toList());
    }

}
