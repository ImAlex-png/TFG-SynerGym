package com.synergym.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.synergym.persistence.entities.Entrenador;

import com.synergym.persistence.repositories.EntrenadorRepository;
import com.synergym.services.exceptions.EntrenadorNotFoundException;

@Service
public class EntrenadorService {

    @Autowired
    private EntrenadorRepository entrenadorRepository;

    // Ver todas los entrenadores
    public List<Entrenador> findAll() {
        return entrenadorRepository.findAll();
    }

    // Inscripcion por ID
    public Entrenador findById(int idEntrenador) {
        if (!this.entrenadorRepository.existsById(idEntrenador)) {
            throw new EntrenadorNotFoundException("El ID indicado no existe");
        }
        return this.entrenadorRepository.findById(idEntrenador).get();
    }

    // Crear entrenador
    public Entrenador create(Entrenador entrenador) {

        if (entrenador.getNombre() == null || entrenador.getNombre().trim().isEmpty()) {
            throw new EntrenadorNotFoundException("El nombre del entrenador es obligatorio");
        }

        if (entrenador.getIdEntrenador() != 0) {
            throw new EntrenadorNotFoundException("El ID del entrenador debe ser 0 al crear un nuevo entrenador");
        }

        entrenador.setIdEntrenador(0);

        return this.entrenadorRepository.save(entrenador);
    }

    // Actualizar entrenador
    public Entrenador update(Entrenador entrenador, int idEntrenador) {
        Entrenador entrenadorBD = this.findById(idEntrenador);
        entrenadorBD.setNombre(entrenador.getNombre());
        entrenadorBD.setApellidos(entrenador.getApellidos());
        entrenadorBD.setClases(entrenador.getClases());
        return this.entrenadorRepository.save(entrenadorBD);
    }

    // Eliminar entrenador
    public void deleteById(int idEntrenador) {
        if (!this.entrenadorRepository.existsById(idEntrenador)) {
            throw new EntrenadorNotFoundException("El ID indicado no existe");
        }
        this.entrenadorRepository.deleteById(idEntrenador);
    }
}
