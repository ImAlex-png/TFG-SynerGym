package com.synergym.web.controller;

import java.util.List;

import org.apache.catalina.connector.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.synergym.persistence.entities.Entrenador;
import com.synergym.services.EntrenadorService;
import com.synergym.services.exceptions.EntrenadorException;
import com.synergym.services.exceptions.EntrenadorNotFoundException;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/entrenador")
public class EntrenadorController {
    
    @Autowired
    private EntrenadorService entrenador;

    @GetMapping
    public ResponseEntity<List<Entrenador>> getAllEntrenadores() {
        return ResponseEntity.ok(this.entrenador.findAll());
    }

    @GetMapping("/{idEntrenador}")
    public ResponseEntity<?> findById(@PathVariable int idEntrenador) {
        try{
            return ResponseEntity.ok(this.entrenador.findById(idEntrenador));
        }catch(EntrenadorNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }    

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Entrenador entrenador) {
        try{
            return ResponseEntity.status(HttpStatus.CREATED).body(this.entrenador.create(entrenador));
        }catch(EntrenadorException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/{idEntrenador}")
    public ResponseEntity<?> update(@PathVariable int idEntrenador, @RequestBody Entrenador entrenador) {
        try{
            return ResponseEntity.ok(this.entrenador.update(entrenador, idEntrenador));
        }catch(EntrenadorNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }catch(EntrenadorException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/{idEntrenador}")
    public ResponseEntity<?> delete(@PathVariable int idEntrenador) {
        try{
            this.entrenador.deleteById(idEntrenador);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }catch(EntrenadorNotFoundException ex){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }
    
}
