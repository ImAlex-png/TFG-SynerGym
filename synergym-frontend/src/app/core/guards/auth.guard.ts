import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('AuthGuard: Checking path:', state.url);
  console.log('AuthGuard: Authenticated:', authService.isAuthenticated());

  if (authService.isAuthenticated()) {
    return true;
  }

  console.warn('AuthGuard: Not authenticated, redirecting to login from:', state.url);
  router.navigate(['/login']);
  return false;
};
