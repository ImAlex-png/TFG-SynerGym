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
import com.synergym.services.dto.UsuarioDTO;
import java.util.ArrayList;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Obtener todos los usuarios
    public List<UsuarioDTO> findAll() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        List<UsuarioDTO> dtos = new ArrayList<>();
        for (Usuario u : usuarios) {
            dtos.add(convertToDTO(u));
        }
        return dtos;
    }

    // Obtener todos los usuarios activos
    public List<UsuarioDTO> findAllActivos() {
        List<Usuario> usuarios = usuarioRepository.findByActivoTrue();
        List<UsuarioDTO> dtos = new ArrayList<>();
        for (Usuario u : usuarios) {
            dtos.add(convertToDTO(u));
        }
        return dtos;
    }

    // Buscar usuarios por rol
    public List<UsuarioDTO> findByRol(Rol rol) {
        List<Usuario> usuarios = usuarioRepository.findByRol(rol);
        List<UsuarioDTO> dtos = new ArrayList<>();
        for (Usuario u : usuarios) {
            dtos.add(convertToDTO(u));
        }
        return dtos;
    }

    // Buscar un usuario por su ID y devolver DTO
    public UsuarioDTO findByIdDTO(int id) {
        return convertToDTO(findById(id));
    }

    // Buscar el usuario original por su ID (para uso interno)
    public Usuario findById(int id) {
        Optional<Usuario> optionalUsuario = usuarioRepository.findById(id);
        if (!optionalUsuario.isPresent()) {
            throw new UsuarioNotFoundException("Usuario no encontrado con ID: " + id);
        }
        return optionalUsuario.get();
    }

    // Crear un nuevo usuario
    public Usuario create(Usuario usuario) {
        if (usuarioRepository.findByEmail(usuario.getEmail()).isPresent()) {
            throw new UsuarioException("El email ya está registrado");
        }
        if (usuario.getDni() != null && usuarioRepository.findByDni(usuario.getDni()).isPresent()) {
            throw new UsuarioException("El DNI ya está registrado");
        }
        // Aquí se podría añadir hashing de contraseña
        Usuario saved = usuarioRepository.save(usuario);
        return convertToDTO(saved);
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

        Usuario saved = usuarioRepository.save(usuarioBD);
        return convertToDTO(saved);
    }

    // Método para convertir de Entidad a DTO (Sin usar Streams ni Funcional)
    private UsuarioDTO convertToDTO(Usuario u) {
        return new UsuarioDTO(
            u.getId(),
            u.getNombre(),
            u.getApellidos(),
            u.getDni(),
            u.getTelefono(),
            u.getEmail(),
            u.getRol(),
            u.isActivo()
        );
    }

    // Eliminar un usuario por su ID
    public void deleteById(int id) {
        if (!usuarioRepository.existsById(id)) {
            throw new UsuarioNotFoundException("No se puede eliminar: ID no existe");
        }
        usuarioRepository.deleteById(id);
    }
}
