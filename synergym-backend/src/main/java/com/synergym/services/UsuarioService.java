package com.synergym.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.synergym.persistence.entities.Usuario;
import com.synergym.persistence.entities.enums.Rol;
import com.synergym.persistence.repositories.UsuarioRepository;
import com.synergym.services.exceptions.UsuarioNotFoundException;
import com.synergym.services.exceptions.UsuarioException;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<Usuario> findAll() {
        return usuarioRepository.findAll();
    }

    public List<Usuario> findAllActivos() {
        return usuarioRepository.findByActivoTrue();
    }

    public List<Usuario> findByRol(Rol rol) {
        return usuarioRepository.findByRol(rol);
    }

    public Usuario findById(int id) {
        Optional<Usuario> optionalUsuario = usuarioRepository.findById(id);
        if (!optionalUsuario.isPresent()) {
            throw new UsuarioNotFoundException("Usuario no encontrado con ID: " + id);
        }
        return optionalUsuario.get();
    }

    public Usuario create(Usuario usuario) {
        if (usuarioRepository.findByEmail(usuario.getEmail()).isPresent()) {
            throw new UsuarioException("El email ya está registrado");
        }
        if (usuario.getDni() != null && usuarioRepository.findByDni(usuario.getDni()).isPresent()) {
            throw new UsuarioException("El DNI ya está registrado");
        }
        // Aquí se podría añadir hashing de contraseña
        return usuarioRepository.save(usuario);
    }

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
