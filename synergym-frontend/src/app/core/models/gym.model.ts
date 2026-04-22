import { Usuario } from './user.model';

export enum Estado {
  PENDIENTE = 'PENDIENTE',
  CONFIRMADO = 'CONFIRMADO',
  CANCELADO = 'CANCELADO',
}

export interface Clase {
  idClases: number;
  nombre: string;
  fechaInicio: string; // ISO format date
  fechaFin: string;
  horaInicio: string; // ISO format time
  horaFin: string;
  capacidadMaxima: number;
  entrenador: Usuario | null;
  alumnosInscritos?: number; // Optional metadata
}

export interface Inscripcion {
  idInscripcion: number;
  estado: Estado;
  pagado: boolean;
  fechaInscripcion: string;
  alumno: Usuario;
  clases: Clase;
}
