import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Clase {
  idClases: number;
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  horaInicio: string;
  horaFin: string;
  capacidadMaxima: number;
  entrenador: any;
  alumnosInscritos?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ClaseService {
  private readonly apiUrl = 'http://localhost:8081/clases';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Clase[]>(this.apiUrl);
  }

  getById(id: number) {
    return this.http.get<Clase>(`${this.apiUrl}/${id}`);
  }

  create(clase: any) {
    return this.http.post<Clase>(this.apiUrl, clase);
  }

  update(id: number, clase: any) {
    return this.http.put<Clase>(`${this.apiUrl}/${id}`, clase);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }

  getCalendarioEntrenador(idEntrenador: number) {
    return this.http.get<Clase[]>(`${this.apiUrl}/calendario/${idEntrenador}`);
  }
}
