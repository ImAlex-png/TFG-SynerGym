package com.synergym.services;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.synergym.persistence.entities.Clases;
import com.synergym.persistence.repositories.ClasesRepository;
import com.synergym.services.exceptions.ClaseNotFoundException;
import com.synergym.services.exceptions.ClasesException;
import com.synergym.web.dto.ClaseCalendarioDTO;

@Service
public class ClaseService {

    @Autowired
    private ClasesRepository clasesRepository;

    // Find all clases
    public List<Clases> findAll() {
        return clasesRepository.findAll();
    }

    // Find clase by ID
    public Clases findById(int idClase) {
        Optional<Clases> optionalClase = this.clasesRepository.findById(idClase);
        if (!optionalClase.isPresent()) {
            throw new ClaseNotFoundException("La clase con el ID " + idClase + " no existe");
        }
        return optionalClase.get();
    }

    // Crear una clase
    public Clases create(Clases clase) {
        if (clase.getFechaFin().isBefore(clase.getFechaInicio())) {
            throw new ClasesException("La fecha de fin no puede ser anterior a la fecha de inicio");
        }

        if (clase.getHoraFin().isBefore(clase.getHoraInicio())) {
            throw new ClasesException("La hora de fin no puede ser anterior a la hora de inicio");
        }

        clase.setIdClases(0);

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

    // Eliminar una clase por ID
    public void delete(int idClase) {
        if (!this.clasesRepository.existsById(idClase)) {
            throw new ClaseNotFoundException("La clase con el ID " + idClase + " no existe");
        }
        this.clasesRepository.deleteById(idClase);
    }

    // Update clase
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

    // Obtener calendario para un entrenador
    public List<ClaseCalendarioDTO> getCalendarioEntrenador(int idEntrenador) {
        List<Clases> todasLasClases = clasesRepository.findAll();
        List<ClaseCalendarioDTO> calendario = new ArrayList<>();

        for (Clases c : todasLasClases) {
            if (c.getEntrenador() != null && c.getEntrenador().getId() == idEntrenador) {
                int numInscritos = 0;
                if (c.getInscripciones() != null) {
                    numInscritos = c.getInscripciones().size();
                }

                ClaseCalendarioDTO dto = new ClaseCalendarioDTO(
                    c.getIdClases(),
                    c.getNombre(),
                    c.getFechaInicio(),
                    c.getHoraInicio(),
                    c.getHoraFin(),
                    numInscritos,
                    c.getCapacidadMaxima(),
                    c.getCapacidadMaxima() - numInscritos
                );
                calendario.add(dto);
            }
        }

        return calendario;
    }

}
