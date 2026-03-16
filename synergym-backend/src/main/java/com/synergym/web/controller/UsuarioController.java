package com.synergym.web.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.synergym.persistence.entities.Usuario;
import com.synergym.services.dto.UsuarioDTO;
import com.synergym.persistence.entities.enums.Rol;
import com.synergym.services.UsuarioService;
import com.synergym.services.exceptions.UsuarioException;
import com.synergym.services.exceptions.UsuarioNotFoundException;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    public ResponseEntity<List<UsuarioDTO>> getAll() {
        return ResponseEntity.ok(usuarioService.findAll());
    }

    @GetMapping("/activos")
    public ResponseEntity<List<UsuarioDTO>> getActivos() {
        return ResponseEntity.ok(usuarioService.findAllActivos());
    }

    @GetMapping("/rol/{rol}")
    public ResponseEntity<List<UsuarioDTO>> getByRol(@PathVariable Rol rol) {
        return ResponseEntity.ok(usuarioService.findByRol(rol));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable int id) {
        try {
            return ResponseEntity.ok(usuarioService.findByIdDTO(id));
        } catch (UsuarioNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Usuario usuario) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(usuarioService.create(usuario));
        } catch (UsuarioException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable int id, @RequestBody Usuario usuario) {
        try {
            return ResponseEntity.ok(usuarioService.update(usuario, id));
        } catch (UsuarioNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        } catch (UsuarioException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable int id) {
        try {
            usuarioService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (UsuarioNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }
}
