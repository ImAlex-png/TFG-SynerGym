package com.synergym.web.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.synergym.persistence.entities.Inscripcion;
import com.synergym.services.InscripcionService;
import com.synergym.services.exceptions.InscripcionException;
import com.synergym.services.exceptions.InscripcionNotFoundException;

@RestController
@RequestMapping("/inscripcion")
public class InscripcionController {
    
    @Autowired
    private InscripcionService inscripcion;

    @GetMapping
    public ResponseEntity<List<Inscripcion>> getAllInscripciones() {
        return ResponseEntity.ok(this.inscripcion.findAll());
    }

    @GetMapping("/{idInscripcion}")
    public ResponseEntity<?> findById(@PathVariable int idInscripcion) {
        try{
            return ResponseEntity.ok(this.inscripcion.findById(idInscripcion));
        }catch(Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Inscripcion inscripcion) {
        try{
            return ResponseEntity.status(HttpStatus.CREATED).body(this.inscripcion.create(inscripcion));
        }catch(Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/{idInscripcion}")
    public ResponseEntity<?> update(@PathVariable int idInscripcion, @RequestBody Inscripcion inscripcion) {
        try{
            return ResponseEntity.ok(this.inscripcion.update(inscripcion, idInscripcion));
        }catch(InscripcionNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }catch(InscripcionException ex){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }

    @DeleteMapping("/{idInscripcion}")
    public ResponseEntity<?> delete(@PathVariable int idInscripcion) {
        try{
            this.inscripcion.deleteById(idInscripcion);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }catch(InscripcionNotFoundException ex){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }
}
