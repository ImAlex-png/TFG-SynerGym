package com.synergym.persistence.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.synergym.persistence.entities.Usuario;
import com.synergym.persistence.entities.enums.Rol;
import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    
    Optional<Usuario> findByEmail(String email);
    
    Optional<Usuario> findByDni(String dni);
    
    List<Usuario> findByRol(Rol rol);
    
    List<Usuario> findByActivoTrue();
}
