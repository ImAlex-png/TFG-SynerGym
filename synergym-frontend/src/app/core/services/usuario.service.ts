import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario, Rol } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private readonly apiUrl = 'http://localhost:8081/usuarios';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  getActivos() {
    return this.http.get<Usuario[]>(`${this.apiUrl}/activos`);
  }

  getById(id: number) {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  getByRol(rol: Rol) {
    return this.http.get<Usuario[]>(`${this.apiUrl}/rol/${rol}`);
  }

  create(usuario: any) {
    return this.http.post<Usuario>(this.apiUrl, usuario);
  }

  update(id: number, usuario: any) {
    return this.http.put<Usuario>(`${this.apiUrl}/${id}`, usuario);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
}
