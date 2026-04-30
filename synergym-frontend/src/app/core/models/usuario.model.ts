export enum Rol {
  ADMINISTRADOR = 'ADMINISTRADOR',
  ENTRENADOR = 'ENTRENADOR',
  ALUMNO = 'ALUMNO'
}

export interface Usuario {
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
  rol: Rol;
  dni?: string;
  telefono?: string;
  activo: boolean;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: Usuario;
}
