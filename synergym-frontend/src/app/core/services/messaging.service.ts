import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../models/usuario.model';

export interface Conversacion {
  id: number;
  nombre: string;
  tipo: 'PRIVADA' | 'GRUPAL';
  fechaCreacion: string;
  idParticipantes: number[];
  ultimoMensaje?: string;
}

export interface Mensaje {
  id: number;
  contenido: string;
  fechaEnvio: string;
  idEmisor: number;
  idConversacion: number;
}

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  private readonly apiUrl = 'http://localhost:8081/mensajeria';
  
  // Signal global para notificaciones
  hasUnreadMessages = signal<boolean>(false);

  constructor(private http: HttpClient) {}

  getConversaciones() {
    return this.http.get<Conversacion[]>(`${this.apiUrl}/conversaciones`);
  }

  crearConversacionPrivada(idOtroUsuario: number) {
    return this.http.post<Conversacion>(`${this.apiUrl}/conversaciones/privada/${idOtroUsuario}`, {});
  }

  getMensajes(idConversacion: number) {
    return this.http.get<Mensaje[]>(`${this.apiUrl}/conversaciones/${idConversacion}/mensajes`);
  }

  enviarMensaje(idConversacion: number, contenido: string) {
    return this.http.post<Mensaje>(`${this.apiUrl}/conversaciones/${idConversacion}/mensajes`, { contenido });
  }

  // Método para actualizar el estado global desde cualquier componente
  setUnreadStatus(status: boolean) {
    this.hasUnreadMessages.set(status);
  }
}
