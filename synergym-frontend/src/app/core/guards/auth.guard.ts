import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Rol } from '../models/user.model';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  const expectedRoles = route.data['roles'] as Rol[];
  if (expectedRoles && expectedRoles.length > 0) {
    const userRole = authService.role();
    if (!userRole || !expectedRoles.includes(userRole)) {
      router.navigate(['/']); // Redirect to home/dashboard based on role
      return false;
    }
  }

  return true;
};
