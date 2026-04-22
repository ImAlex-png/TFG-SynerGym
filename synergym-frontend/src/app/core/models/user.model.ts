export enum Rol {
  ADMINISTRADOR = 'ADMINISTRADOR',
  ENTRENADOR = 'ENTRENADOR',
  ALUMNO = 'ALUMNO',
}

export interface Usuario {
  id: number;
  nombre: string;
  apellidos: string;
  dni: string;
  telefono: string;
  email: string;
  rol: Rol;
  activo: boolean;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface AuthState {
  user: Usuario | null;
  token: string | null;
  isAuthenticated: boolean;
}
