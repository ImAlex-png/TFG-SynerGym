import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { Rol } from './core/models/user.model';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register.component').then(m => m.RegisterComponent)
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'admin',
        canActivate: [authGuard],
        data: { roles: [Rol.ADMINISTRADOR] },
        children: [
          { path: 'dashboard', loadComponent: () => import('./features/admin/dashboard.component').then(m => m.AdminDashboardComponent) },
          { path: 'coaches', loadComponent: () => import('./features/admin/coaches.component').then(m => m.CoachesComponent) },
          { path: 'classes', loadComponent: () => import('./features/admin/classes.component').then(m => m.ClassesComponent) },
          { path: 'students', loadComponent: () => import('./features/admin/students.component').then(m => m.StudentsComponent) },
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
      },
      {
        path: 'coach',
        canActivate: [authGuard],
        data: { roles: [Rol.ENTRENADOR] },
        children: [
          { path: 'classes', loadComponent: () => import('./features/coach/coach-classes.component').then(m => m.CoachClassesComponent) },
          { path: '', redirectTo: 'classes', pathMatch: 'full' }
        ]
      },
      {
        path: 'student',
        canActivate: [authGuard],
        data: { roles: [Rol.ALUMNO] },
        children: [
          { path: 'classes', loadComponent: () => import('./features/student/available-classes.component').then(m => m.AvailableClassesComponent) },
          { path: 'enrollments', loadComponent: () => import('./features/student/my-enrollments.component').then(m => m.MyEnrollmentsComponent) },
          { path: '', redirectTo: 'classes', pathMatch: 'full' }
        ]
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'admin' // This should be dynamic based on role in a real app, but for now we redirect to admin
      }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
