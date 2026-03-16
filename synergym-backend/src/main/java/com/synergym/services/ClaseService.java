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
import com.synergym.services.exceptions.ClaseException;
import com.synergym.services.dto.ClaseCalendarioDTO;
import com.synergym.services.dto.ClaseDTO;
import com.synergym.services.dto.UsuarioDTO;

@Service
public class ClaseService {

    @Autowired
    private ClasesRepository clasesRepository;

    // Obtener todas las clases
    public List<ClaseDTO> findAll() {
        List<Clases> clases = clasesRepository.findAll();
        List<ClaseDTO> dtos = new ArrayList<>();
        for (Clases c : clases) {
            dtos.add(convertToDTO(c));
        }
        return dtos;
    }

    // Buscar una clase por su ID y devolver DTO
    public ClaseDTO findByIdDTO(int idClase) {
        return convertToDTO(findById(idClase));
    }

    // Buscar una clase por su ID (para uso interno)
    public Clases findById(int idClase) {
        Optional<Clases> optionalClase = this.clasesRepository.findById(idClase);
        if (!optionalClase.isPresent()) {
            throw new ClaseNotFoundException("La clase con el ID " + idClase + " no existe");
        }
        return optionalClase.get();
    }

    // Crear una nueva clase
    public ClaseDTO create(Clases clase) {
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

        Clases saved = this.clasesRepository.save(clase);
        return convertToDTO(saved);
    }

    // Eliminar una clase por su ID
    public void delete(int idClase) {
        if (!this.clasesRepository.existsById(idClase)) {
            throw new ClaseNotFoundException("La clase con el ID " + idClase + " no existe");
        }
        this.clasesRepository.deleteById(idClase);
    }

    // Actualizar una clase existente
    public ClaseDTO update(Clases clase, int idClase) {
        Clases claseBD = this.findById(idClase);
        
        claseBD.setNombre(clase.getNombre());
        claseBD.setFechaFin(clase.getFechaFin());
        claseBD.setHoraInicio(clase.getHoraInicio());
        claseBD.setHoraFin(clase.getHoraFin());
        claseBD.setCapacidadMaxima(clase.getCapacidadMaxima());
        claseBD.setEntrenador(clase.getEntrenador());

        Clases saved = this.clasesRepository.save(claseBD);
        return convertToDTO(saved);
    }

    // Obtener el calendario de clases para un entrenador específico
    public List<ClaseCalendarioDTO> getCalendarioEntrenador(int idEntrenador) {
        List<Clases> clases = clasesRepository.findByEntrenadorId(idEntrenador);
        List<ClaseCalendarioDTO> calendario = new ArrayList<>();

        for (Clases c : clases) {
            int numInscritos = (c.getInscripciones() != null) ? c.getInscripciones().size() : 0;
            
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

        return calendario;
    }

    // Método para convertir de Entidad a DTO (Sin usar programación funcional)
    public ClaseDTO convertToDTO(Clases c) {
        if (c == null) return null;
        
        UsuarioDTO entrenadorDTO = null;
        if (c.getEntrenador() != null) {
            entrenadorDTO = new UsuarioDTO(
                c.getEntrenador().getId(),
                c.getEntrenador().getNombre(),
                c.getEntrenador().getApellidos(),
                c.getEntrenador().getDni(),
                c.getEntrenador().getTelefono(),
                c.getEntrenador().getEmail(),
                c.getEntrenador().getRol(),
                c.getEntrenador().isActivo()
            );
        }
        
        return new ClaseDTO(
            c.getIdClases(),
            c.getNombre(),
            c.getFechaInicio(),
            c.getFechaFin(),
            c.getHoraInicio(),
            c.getHoraFin(),
            c.getCapacidadMaxima(),
            entrenadorDTO
        );
    }

}
