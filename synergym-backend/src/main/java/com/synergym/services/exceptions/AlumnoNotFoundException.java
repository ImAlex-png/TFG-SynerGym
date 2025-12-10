package com.synergym.services.exceptions;

public class AlumnoNotFoundException extends RuntimeException{
    
    private static final long serialVersionUID = 1L;

    public AlumnoNotFoundException(String message) {
        super(message);
    }
}
