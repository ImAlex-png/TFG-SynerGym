package com.synergym.services.exceptions;

public class EntrenadorNotFoundException extends RuntimeException{
    
    private static final long serialVersionUID = 1L;

    public EntrenadorNotFoundException(String message) {
        super(message);
    }
}
