import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Inscripcion {
  id: number;
  estado: 'ACEPTADA' | 'RECHAZADA' | 'EN_PROCESO';
  pagado: boolean;
  fechaInscripcion: string;
  usuario: any;
  clases: any;
}

@Injectable({
  providedIn: 'root'
})
export class InscripcionService {
  private readonly apiUrl = 'http://localhost:8081/inscripciones';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Inscripcion[]>(this.apiUrl);
  }

  getById(id: number) {
    return this.http.get<Inscripcion>(`${this.apiUrl}/${id}`);
  }

  getByAlumno(idAlumno: number) {
    return this.http.get<Inscripcion[]>(`${this.apiUrl}/alumno/${idAlumno}`);
  }

  getByClase(idClase: number) {
    return this.http.get<Inscripcion[]>(`${this.apiUrl}/clase/${idClase}`);
  }

  crear(idAlumno: number, idClase: number) {
    return this.http.post<Inscripcion>(`${this.apiUrl}/inscribir`, {
      idAlumno,
      idClase
    });
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
}
