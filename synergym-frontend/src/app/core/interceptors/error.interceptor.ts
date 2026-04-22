import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error) => {
      let errorMessage = 'Ha ocurrido un error inesperado';

      if (error.status === 401) {
        errorMessage = 'Sesión expirada o no autorizada';
        authService.logout();
      } else if (error.status === 403) {
        errorMessage = 'No tienes permisos para realizar esta acción';
      } else if (error.status === 404) {
        errorMessage = 'Recurso no encontrado';
      } else if (error.status === 400 || error.status === 409) {
        errorMessage = error.error || 'Petición inválida';
      } else if (error.status === 0) {
        errorMessage = 'No se puede conectar con el servidor';
      }

      toastService.error(errorMessage);
      return throwError(() => error);
    })
  );
};
