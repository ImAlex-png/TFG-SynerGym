package com.synergym.web.config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.synergym.services.exceptions.ClaseNotFoundException;
import com.synergym.services.exceptions.InscripcionNotFoundException;
import com.synergym.services.exceptions.UsuarioNotFoundException;
import com.synergym.services.exceptions.PasswordException;
import com.synergym.services.exceptions.UsuarioException;
import com.synergym.services.exceptions.ClaseException;
import com.synergym.services.exceptions.InscripcionException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler({ UsuarioNotFoundException.class, ClaseNotFoundException.class,
            InscripcionNotFoundException.class })
    public ResponseEntity<String> handleNotFound(RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler({ UsuarioException.class, ClaseException.class, InscripcionException.class,
            PasswordException.class })
    public ResponseEntity<String> handleBadRequest(RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

    @ExceptionHandler(org.springframework.security.authentication.BadCredentialsException.class)
    public ResponseEntity<String> handleBadCredentials(RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email o contraseña incorrectos.");
    }
}
