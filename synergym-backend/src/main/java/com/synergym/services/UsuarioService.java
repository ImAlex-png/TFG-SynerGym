package com.synergym.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import java.util.Collections;

import com.synergym.persistence.entities.Usuario;
import com.synergym.persistence.entities.enums.Rol;
import com.synergym.persistence.repositories.UsuarioRepository;
import com.synergym.services.exceptions.UsuarioNotFoundException;
import com.synergym.services.exceptions.UsuarioException;

@Service
public class UsuarioService implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Obtener todos los usuarios
    public List<Usuario> findAll() {
        return usuarioRepository.findAll();
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con email: " + username));

        return new User(usuario.getEmail(), usuario.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + usuario.getRol().name())));
    }

    // Obtener todos los usuarios activos
    public List<Usuario> findAllActivos() {
        return usuarioRepository.findByActivoTrue();
    }

    // Buscar usuarios por rol
    public List<Usuario> findByRol(Rol rol) {
        return usuarioRepository.findByRol(rol);
    }

    // Buscar un usuario por su ID
    public Usuario findById(int id) {
        Optional<Usuario> optionalUsuario = usuarioRepository.findById(id);
        if (!optionalUsuario.isPresent()) {
            throw new UsuarioNotFoundException("Usuario no encontrado con ID: " + id);
        }
        return optionalUsuario.get();
    }

    // Crea un usuario completo desde el panel de administración usando los datos
    // recibidos, sin modificar roles, normalmente cuando un administrador añade
    // manualmente otro usuario o entrenador.
    public Usuario create(Usuario usuario) {
        if (usuarioRepository.findByEmail(usuario.getEmail()).isPresent()) {
            throw new UsuarioException("El email ya está registrado");
        }
        if (usuario.getDni() != null && usuarioRepository.findByDni(usuario.getDni()).isPresent()) {
            throw new UsuarioException("El DNI ya está registrado");
        }
        
        org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder encoder = new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder();
        usuario.setPassword(encoder.encode(usuario.getPassword()));
        
        return usuarioRepository.save(usuario);
    }

    // Registro automático de usuarios: solo toma email y contraseña, la encripta y
    // asigna siempre el rol de alumno para evitar privilegios indebidos.
    public Usuario create(com.synergym.services.dto.RegisterRequest request) {
        Usuario nuevoUsuario = new Usuario();
        String email = request.getEmail() != null ? request.getEmail() : request.getUsername();
        if (usuarioRepository.findByEmail(email).isPresent()) {
            throw new UsuarioException("El email ya está registrado");
        }
        nuevoUsuario.setEmail(email);

        org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder encoder = new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder();
        nuevoUsuario.setPassword(encoder.encode(request.getPassword1()));

        nuevoUsuario.setNombre("Nuevo");
        nuevoUsuario.setApellidos("Usuario");
        nuevoUsuario.setRol(Rol.ALUMNO);
        nuevoUsuario.setActivo(true);

        return usuarioRepository.save(nuevoUsuario);
    }

    // Actualizar un usuario existente
    public Usuario update(Usuario usuario, int id) {
        Usuario usuarioBD = findById(id);

        usuarioBD.setNombre(usuario.getNombre());
        usuarioBD.setApellidos(usuario.getApellidos());
        usuarioBD.setTelefono(usuario.getTelefono());
        usuarioBD.setRol(usuario.getRol());
        usuarioBD.setActivo(usuario.isActivo());

        // El email y DNI suelen ser inmutables o requerir validación extra
        if (!usuarioBD.getEmail().equals(usuario.getEmail())) {
            if (usuarioRepository.findByEmail(usuario.getEmail()).isPresent()) {
                throw new UsuarioException("El nuevo email ya está en uso");
            }
            usuarioBD.setEmail(usuario.getEmail());
        }

        return usuarioRepository.save(usuarioBD);
    }

    public void deleteById(int id) {
        if (!usuarioRepository.existsById(id)) {
            throw new UsuarioNotFoundException("No se puede eliminar: ID no existe");
        }
        usuarioRepository.deleteById(id);
    }
}
