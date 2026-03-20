package com.synergym.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.synergym.web.config.JwtUtils;
import com.synergym.persistence.entities.Usuario;
import com.synergym.persistence.entities.enums.Rol;
import com.synergym.services.dto.LoginRequest;
import com.synergym.services.dto.LoginResponse;
import com.synergym.services.dto.RefreshDTO;
import com.synergym.services.dto.RegisterRequest;
import com.synergym.services.exceptions.PasswordException;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtil;

    @Autowired
    private UsuarioService usuarioService;

    public LoginResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        String accessToken = jwtUtil.generateAccessToken(userDetails);
        String refreshToken = jwtUtil.generateRefreshToken(userDetails);

        LoginResponse response = new LoginResponse();
        response.setAccess(accessToken);
        response.setRefresh(refreshToken);

        return response;
    }

    public LoginResponse registrar(RegisterRequest request) {
        if (!request.getPassword1().equals(request.getPassword2())) {
            throw new PasswordException("Las contraseñas no coinciden");
        }

        Usuario nuevoUsuario = new Usuario();
        nuevoUsuario.setEmail(request.getUsername());
        nuevoUsuario.setPassword(passwordEncoder.encode(request.getPassword1()));
        nuevoUsuario.setNombre(request.getNombre() != null ? request.getNombre() : "Nuevo");
        nuevoUsuario.setApellidos(request.getApellidos() != null ? request.getApellidos() : "Usuario");
        nuevoUsuario.setDni(request.getDni());
        nuevoUsuario.setTelefono(request.getTelefono());
        nuevoUsuario.setRol(Rol.ALUMNO); // Por defecto rol de registro
        nuevoUsuario.setActivo(true);

        this.usuarioService.create(nuevoUsuario);

        Authentication authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword1()));
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        String accessToken = jwtUtil.generateAccessToken(userDetails);
        String refreshToken = jwtUtil.generateRefreshToken(userDetails);

        LoginResponse response = new LoginResponse();
        response.setAccess(accessToken);
        response.setRefresh(refreshToken);

        return response;
    }

    public LoginResponse refresh(RefreshDTO dto) {
        String accessToken = jwtUtil.generateAccessToken(dto.getRefresh());
        String refreshToken = jwtUtil.generateRefreshToken(dto.getRefresh());

        LoginResponse response = new LoginResponse();
        response.setAccess(accessToken);
        response.setRefresh(refreshToken);

        return response;
    }

}
