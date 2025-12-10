package com.synergym.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.synergym.persistence.entities.Alumno;
import com.synergym.persistence.repositories.AlumnoRepository;
import com.synergym.services.exceptions.AlumnoNotFoundException;

@Service
public class AlumnoService {

    @Autowired
    private AlumnoRepository alumnoRepository;

    // Todos los alumnos
    public List<Alumno> findAll() {
        return alumnoRepository.findAll();
    }

    // Alumnos por ID
    public Alumno findById(int idAlumno) {
        if (!this.alumnoRepository.existsById(idAlumno)) {
            throw new AlumnoNotFoundException("El ID indicado no existe");
        }
        return this.alumnoRepository.findById(idAlumno).get();
    }

    // Crear alumno
    public Alumno create(Alumno alumno) {
        alumno.setIdAlumno(0);

        return this.alumnoRepository.save(alumno);
    }

    //Actualizar datos alumno
    public Alumno update(Alumno alumno, int idAlumno) {
        Alumno alumnoBD = this.findById(idAlumno);
        alumnoBD.setNombre(alumno.getNombre());
        alumnoBD.setApellidos(alumno.getApellidos());

        return this.alumnoRepository.save(alumnoBD);
    }

    // Eliminar alumno
    public void deleteById( int idAlumno) {
        if(!this.alumnoRepository.existById(idAlumno)) {
            throw new AlumnoNotFoundException("El ID indicado no existe");
        }
        this.alumnoRepository.deleteById(idAlumno);
    }
}
