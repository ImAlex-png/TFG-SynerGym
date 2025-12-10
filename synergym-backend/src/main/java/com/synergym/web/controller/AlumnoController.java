package com.synergym.web.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.synergym.persistence.entities.Alumno;
import com.synergym.services.AlumnoService;
import com.synergym.services.exceptions.AlumnoNotFoundException;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PostMapping;



@RestController
@RequestMapping("/alumnos")
public class AlumnoController {
    
    @Autowired
    private AlumnoService alumnoService;


    @GetMapping
    public ResponseEntity<List<Alumno>> list(){
        return ResponseEntity.ok(this.alumnoService.findAll());
    }
    
    //Buscar alumno por ID
    @GetMapping("/{idAlumno}")
    public ResponseEntity<?> findById(@PathVariable int idAlumno) {
        try {
            return ResponseEntity.ok(this.alumnoService.findById(idAlumno));
        } catch (AlumnoNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }

    //Crerar un alumno
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Alumno alumno) {
       return ResponseEntity.status(HttpStatus.CREATED).body(this.alumnoService.create(alumno));
    }
   
    
}
