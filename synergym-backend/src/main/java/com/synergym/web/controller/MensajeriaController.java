package com.synergym.web.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.synergym.persistence.entities.Usuario;
import com.synergym.persistence.repositories.UsuarioRepository;
import com.synergym.services.MensajeriaService;
import com.synergym.services.dto.ConversacionDTO;
import com.synergym.services.dto.MensajeDTO;

@RestController
@RequestMapping("/mensajeria")
public class MensajeriaController {

    @Autowired
    private MensajeriaService mensajeriaService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping("/conversaciones")
    public ResponseEntity<List<ConversacionDTO>> getConversaciones(Authentication auth) {
        int usuarioId = getUsuarioId(auth);
        return ResponseEntity.ok(mensajeriaService.getConversacionesDeUsuario(usuarioId));
    }

    @GetMapping("/conversaciones/{id}/mensajes")
    public ResponseEntity<List<MensajeDTO>> getMensajes(@PathVariable int id, Authentication auth) {
        int usuarioId = getUsuarioId(auth);
        return ResponseEntity.ok(mensajeriaService.getMensajesDeConversacion(id, usuarioId));
    }

    @PostMapping("/conversaciones/{id}/mensajes")
    public ResponseEntity<MensajeDTO> enviarMensaje(@PathVariable int id, @RequestBody Map<String, String> body, Authentication auth) {
        int usuarioId = getUsuarioId(auth);
        String contenido = body.get("contenido");
        return ResponseEntity.ok(mensajeriaService.enviarMensaje(id, usuarioId, contenido));
    }

    @PostMapping("/conversaciones/privada/{receptorId}")
    public ResponseEntity<ConversacionDTO> crearPrivada(@PathVariable int receptorId, Authentication auth) {
        int usuarioId = getUsuarioId(auth);
        return ResponseEntity.ok(mensajeriaService.crearConversacionPrivada(usuarioId, receptorId));
    }

    @PostMapping("/conversaciones/grupo")
    public ResponseEntity<ConversacionDTO> crearGrupo(@RequestBody Map<String, Object> body, Authentication auth) {
        int usuarioId = getUsuarioId(auth);
        String nombre = (String) body.get("nombre");
        List<Integer> participantes = (List<Integer>) body.get("participantes");
        return ResponseEntity.ok(mensajeriaService.crearGrupo(usuarioId, nombre, participantes));
    }

    @PostMapping("/conversaciones/{id}/participantes/{usuarioId}")
    public ResponseEntity<ConversacionDTO> agregarParticipante(@PathVariable int id, @PathVariable int usuarioId, Authentication auth) {
        int solicitanteId = getUsuarioId(auth);
        return ResponseEntity.ok(mensajeriaService.agregarParticipante(id, usuarioId, solicitanteId));
    }

    @DeleteMapping("/conversaciones/{id}/participantes/{usuarioId}")
    public ResponseEntity<Void> eliminarParticipante(@PathVariable int id, @PathVariable int usuarioId, Authentication auth) {
        int solicitanteId = getUsuarioId(auth);
        mensajeriaService.eliminarParticipante(id, usuarioId, solicitanteId);
        return ResponseEntity.ok().build();
    }

    private int getUsuarioId(Authentication auth) {
        String email = auth.getName();
        Usuario u = usuarioRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return u.getId();
    }
}
