package com.synergym.services.dto;

import lombok.Data;

@Data
public class LoginResponse {
    private String access;
    private String refresh;
}
