package com.synergym.services;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.synergym.persistence.entities.Conversacion;
import com.synergym.persistence.entities.Mensaje;
import com.synergym.persistence.entities.Usuario;
import com.synergym.persistence.entities.enums.Rol;
import com.synergym.persistence.entities.enums.TipoConversacion;
import com.synergym.persistence.repositories.ConversacionRepository;
import com.synergym.persistence.repositories.InscripcionRepository;
import com.synergym.persistence.repositories.MensajeRepository;
import com.synergym.persistence.repositories.UsuarioRepository;
import com.synergym.services.dto.ConversacionDTO;
import com.synergym.services.dto.MensajeDTO;
import com.synergym.services.exceptions.UsuarioNotFoundException;

@Service
public class MensajeriaService {

    @Autowired
    private ConversacionRepository conversacionRepository;

    @Autowired
    private MensajeRepository mensajeRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private InscripcionRepository inscripcionRepository;

    public List<ConversacionDTO> getConversacionesDeUsuario(int usuarioId) {
        return conversacionRepository.findByParticipantesId(usuarioId).stream()
                .map(this::mapToConversacionDTO)
                .collect(Collectors.toList());
    }

    public List<MensajeDTO> getMensajesDeConversacion(int conversacionId, int usuarioId) {
        Conversacion conv = conversacionRepository.findById(conversacionId)
                .orElseThrow(() -> new RuntimeException("Conversación no encontrada"));

        // Verificar que el usuario pertenece a la conversación
        boolean esParticipante = conv.getParticipantes().stream().anyMatch(p -> p.getId() == usuarioId);
        if (!esParticipante) {
            throw new RuntimeException("No tienes permiso para ver esta conversación");
        }

        return mensajeRepository.findByConversacionIdOrderByFechaEnvioAsc(conversacionId).stream()
                .map(this::mapToMensajeDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public MensajeDTO enviarMensaje(int conversacionId, int emisorId, String contenido) {
        if (contenido == null || contenido.trim().isEmpty()) {
            throw new RuntimeException("El mensaje no puede estar vacío");
        }

        Conversacion conv = conversacionRepository.findById(conversacionId)
                .orElseThrow(() -> new RuntimeException("Conversación no encontrada"));

        Usuario emisor = usuarioRepository.findById(emisorId)
                .orElseThrow(() -> new UsuarioNotFoundException("Usuario no encontrado"));

        // Verificar participación
        if (conv.getParticipantes().stream().noneMatch(p -> p.getId() == emisorId)) {
            throw new RuntimeException("No puedes enviar mensajes a un chat donde no participas");
        }

        Mensaje mensaje = new Mensaje();
        mensaje.setContenido(contenido);
        mensaje.setEmisor(emisor);
        mensaje.setConversacion(conv);
        mensaje.setFechaEnvio(LocalDateTime.now());

        return mapToMensajeDTO(mensajeRepository.save(mensaje));
    }

    @Transactional
    public ConversacionDTO crearConversacionPrivada(int emisorId, int receptorId) {
        Usuario emisor = usuarioRepository.findById(emisorId).orElseThrow(() -> new UsuarioNotFoundException("Emisor no encontrado"));
        Usuario receptor = usuarioRepository.findById(receptorId).orElseThrow(() -> new UsuarioNotFoundException("Receptor no encontrado"));

        // Restricciones de negocio
        validarPermisoMensajePrivado(emisor, receptor);

        // Buscar si ya existe
        return conversacionRepository.findPrivateChatBetween(emisorId, receptorId)
                .map(this::mapToConversacionDTO)
                .orElseGet(() -> {
                    Conversacion conv = new Conversacion();
                    conv.setTipo(TipoConversacion.PRIVADA);
                    Set<Usuario> participantes = new HashSet<>();
                    participantes.add(emisor);
                    participantes.add(receptor);
                    conv.setParticipantes(participantes);
                    return mapToConversacionDTO(conversacionRepository.save(conv));
                });
    }

    @Transactional
    public ConversacionDTO crearGrupo(int creadorId, String nombre, List<Integer> idParticipantes) {
        Usuario creador = usuarioRepository.findById(creadorId).orElseThrow(() -> new UsuarioNotFoundException("Creador no encontrado"));

        if (creador.getRol() == Rol.ALUMNO) {
            throw new RuntimeException("Los alumnos no pueden crear grupos");
        }

        Conversacion conv = new Conversacion();
        conv.setNombre(nombre);
        conv.setTipo(TipoConversacion.GRUPAL);

        Set<Usuario> participantes = new HashSet<>();
        participantes.add(creador);

        for (Integer id : idParticipantes) {
            Usuario p = usuarioRepository.findById(id).orElseThrow(() -> new UsuarioNotFoundException("Participante no encontrado: " + id));
            
            // Si el creador es ENTRENADOR, solo puede añadir a sus alumnos
            if (creador.getRol() == Rol.ENTRENADOR) {
                if (p.getRol() != Rol.ALUMNO || !inscripcionRepository.existsByAlumnoIdAndClasesEntrenadorId(p.getId(), creador.getId())) {
                    throw new RuntimeException("Un entrenador solo puede añadir a sus propios alumnos");
                }
            }
            participantes.add(p);
        }

        conv.setParticipantes(participantes);
        return mapToConversacionDTO(conversacionRepository.save(conv));
    }

    @Transactional
    public ConversacionDTO agregarParticipante(int idConversacion, int idUsuarioAAngregar, int idSolicitante) {
        Conversacion conv = conversacionRepository.findById(idConversacion)
                .orElseThrow(() -> new RuntimeException("Conversación no encontrada"));
        
        Usuario solicitante = usuarioRepository.findById(idSolicitante)
                .orElseThrow(() -> new UsuarioNotFoundException("Solicitante no encontrado"));
        
        Usuario nuevo = usuarioRepository.findById(idUsuarioAAngregar)
                .orElseThrow(() -> new UsuarioNotFoundException("Usuario a añadir no encontrado"));

        if (conv.getTipo() == TipoConversacion.PRIVADA) {
            throw new RuntimeException("No se pueden añadir participantes a una conversación privada");
        }

        // Restricciones de permisos
        if (solicitante.getRol() == Rol.ALUMNO) {
            throw new RuntimeException("Los alumnos no pueden añadir participantes");
        }

        if (solicitante.getRol() == Rol.ENTRENADOR) {
            // Solo si es su alumno
            if (nuevo.getRol() != Rol.ALUMNO || !inscripcionRepository.existsByAlumnoIdAndClasesEntrenadorId(nuevo.getId(), solicitante.getId())) {
                throw new RuntimeException("Un entrenador solo puede añadir a sus propios alumnos");
            }
        }

        conv.getParticipantes().add(nuevo);
        return mapToConversacionDTO(conversacionRepository.save(conv));
    }

    @Transactional
    public void eliminarParticipante(int idConversacion, int idUsuarioAEliminar, int idSolicitante) {
        Conversacion conv = conversacionRepository.findById(idConversacion)
                .orElseThrow(() -> new RuntimeException("Conversación no encontrada"));
        
        Usuario solicitante = usuarioRepository.findById(idSolicitante)
                .orElseThrow(() -> new UsuarioNotFoundException("Solicitante no encontrado"));

        if (solicitante.getRol() != Rol.ADMINISTRADOR && solicitante.getId() != idUsuarioAEliminar) {
            // Un entrenador o alumno solo puede sacarse a sí mismo, a menos que sea admin
            // El usuario dijo: "Administrador puede ... eliminar participantes"
            // Entrenador no mencionó poder eliminar a otros, así que solo permitimos a Admin eliminar a otros.
            throw new RuntimeException("Solo el administrador puede eliminar a otros participantes");
        }

        conv.getParticipantes().removeIf(p -> p.getId() == idUsuarioAEliminar);
        
        if (conv.getParticipantes().isEmpty()) {
            conversacionRepository.delete(conv);
        } else {
            conversacionRepository.save(conv);
        }
    }

    public List<Usuario> getContactosDisponibles(int usuarioId) {
        Usuario solicitante = usuarioRepository.findById(usuarioId).orElseThrow(() -> new UsuarioNotFoundException("Usuario no encontrado"));
        List<Usuario> todos = usuarioRepository.findByActivoTrue();

        return todos.stream()
                .filter(u -> u.getId() != usuarioId)
                .filter(u -> {
                    try {
                        validarPermisoMensajePrivado(solicitante, u);
                        return true;
                    } catch (RuntimeException e) {
                        return false;
                    }
                })
                .collect(Collectors.toList());
    }

    private void validarPermisoMensajePrivado(Usuario emisor, Usuario receptor) {
        // Administrador puede contactar con cualquiera y viceversa
        if (emisor.getRol() == Rol.ADMINISTRADOR || receptor.getRol() == Rol.ADMINISTRADOR) {
            return;
        }

        // Entrenadores pueden contactar entre sí
        if (emisor.getRol() == Rol.ENTRENADOR && receptor.getRol() == Rol.ENTRENADOR) {
            return;
        }

        // Entrenador puede hablar con sus alumnos
        if (emisor.getRol() == Rol.ENTRENADOR) {
            if (receptor.getRol() == Rol.ALUMNO && inscripcionRepository.existsByAlumnoIdAndClasesEntrenadorId(receptor.getId(), emisor.getId())) {
                return;
            }
            throw new RuntimeException("Como entrenador solo puedes contactar con tus alumnos, otros entrenadores o administradores");
        }

        // Alumno puede hablar con su entrenador
        if (emisor.getRol() == Rol.ALUMNO) {
            if (receptor.getRol() == Rol.ENTRENADOR && inscripcionRepository.existsByAlumnoIdAndClasesEntrenadorId(emisor.getId(), receptor.getId())) {
                return;
            }
            throw new RuntimeException("Como alumno solo puedes contactar con tus entrenadores o con el administrador");
        }
    }

    private ConversacionDTO mapToConversacionDTO(Conversacion conv) {
        ConversacionDTO dto = new ConversacionDTO();
        dto.setId(conv.getId());
        dto.setNombre(conv.getNombre());
        dto.setTipo(conv.getTipo());
        dto.setFechaCreacion(conv.getFechaCreacion());
        dto.setIdParticipantes(conv.getParticipantes().stream().map(Usuario::getId).collect(Collectors.toList()));
        
        // Simular último mensaje (opcional para el listado)
        if (conv.getMensajes() != null && !conv.getMensajes().isEmpty()) {
            dto.setUltimoMensaje(conv.getMensajes().get(conv.getMensajes().size() - 1).getContenido());
        }
        
        return dto;
    }

    private MensajeDTO mapToMensajeDTO(Mensaje m) {
        MensajeDTO dto = new MensajeDTO();
        dto.setId(m.getId());
        dto.setContenido(m.getContenido());
        dto.setFechaEnvio(m.getFechaEnvio());
        dto.setIdEmisor(m.getEmisor().getId());
        dto.setNombreEmisor(m.getEmisor().getNombre() + " " + m.getEmisor().getApellidos());
        dto.setIdConversacion(m.getConversacion().getId());
        return dto;
    }
}
