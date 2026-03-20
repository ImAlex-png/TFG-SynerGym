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

import com.synergym.persistence.entities.Clases;
import com.synergym.services.ClaseService;
import com.synergym.services.exceptions.ClaseNotFoundException;
import com.synergym.services.exceptions.ClaseException;


@RestController
@RequestMapping("/clases")
public class ClaseController {
    
    @Autowired
    private ClaseService claseService;

    // Listar todas las clases
    @GetMapping
    public ResponseEntity<List<Clases>> list() {
        return ResponseEntity.ok(this.claseService.findAll());
    }

    // Obtener clase por id
    @GetMapping("/{idClase}")
    public ResponseEntity<?> findById(@PathVariable int idClase) {
        try {
            return ResponseEntity.ok(this.claseService.findById(idClase));
        }catch(ClaseNotFoundException ex){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }

    //Crear una clase
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Clases clase) {
       try {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.claseService.create(clase));
       }catch(ClaseException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
       }
    }

    //Update de una clase
    @PutMapping("/{idClase}")
    public ResponseEntity<?> update(@PathVariable int idClase, @RequestBody Clases clase) {
        try {
            return ResponseEntity.ok(this.claseService.update(clase, idClase));
        } catch (ClaseException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
       }catch(ClaseNotFoundException ex){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }

    //Eliminar una clase por id
    @DeleteMapping("/delete/{idClase}")
    public ResponseEntity<?> delete(@PathVariable int idClase) {
        try {
            this.claseService.delete(idClase);
            return ResponseEntity.ok().build();
        } catch (ClaseNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }

    // Calendario para el entrenador
    @GetMapping("/calendario/{idEntrenador}")
    public ResponseEntity<List<Clases>> getCalendario(@PathVariable int idEntrenador) {
        return ResponseEntity.ok(claseService.getCalendarioEntrenador(idEntrenador));
    }
}
