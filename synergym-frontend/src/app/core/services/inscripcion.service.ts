import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Inscripcion {
  idInscripcion: number;
  estado: 'ACEPTADA' | 'RECHAZADA' | 'EN_PROCESO';
  fechaInscripcion: string;
  usuario: any;
  clases: any;
}

@Injectable({
  providedIn: 'root'
})
export class InscripcionService {
  private readonly apiUrl = 'http://localhost:8081/inscripcion';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Inscripcion[]>(this.apiUrl);
  }

  getById(id: number) {
    return this.http.get<Inscripcion>(`${this.apiUrl}/${id}`);
  }

  getByAlumno(idAlumno: number) {
    // El backend ya filtra por el usuario autenticado en el endpoint base
    return this.http.get<Inscripcion[]>(this.apiUrl);
  }

  getByClase(idClase: number) {
    // El backend devuelve List<Usuario> para este endpoint
    return this.http.get<any[]>(`${this.apiUrl}/clase/${idClase}`);
  }

  crear(idAlumno: number, idClase: number) {
    const inscripcion = {
      alumno: { id: idAlumno },
      clases: { idClases: idClase }
    };
    return this.http.post<Inscripcion>(this.apiUrl, inscripcion);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
}
