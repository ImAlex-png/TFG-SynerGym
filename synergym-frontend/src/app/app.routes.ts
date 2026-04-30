import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { 
        path: 'dashboard', 
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) 
      },
      {
        path: 'chat',
        loadComponent: () => import('./features/chat/chat.component').then(m => m.ChatComponent)
      },
      {
        path: 'admin/usuarios',
        loadComponent: () => import('./features/admin/usuarios/usuarios.component').then(m => m.AdminUsuariosComponent)
      },
      {
        path: 'admin/usuarios/nuevo',
        loadComponent: () => import('./features/admin/usuarios/user-form.component').then(m => m.UserFormComponent)
      },
      {
        path: 'admin/usuarios/editar/:id',
        loadComponent: () => import('./features/admin/usuarios/user-form.component').then(m => m.UserFormComponent)
      },
      {
        path: 'admin/clases',
        loadComponent: () => import('./features/admin/clases/clase-list.component').then(m => m.ClaseListComponent)
      },
      {
        path: 'admin/clases/nuevo',
        loadComponent: () => import('./features/admin/clases/clase-form.component').then(m => m.ClaseFormComponent)
      },
      {
        path: 'admin/clases/editar/:id',
        loadComponent: () => import('./features/admin/clases/clase-form.component').then(m => m.ClaseFormComponent)
      },
      {
        path: 'clases',
        loadComponent: () => import('./features/alumno/clases/clases.component').then(m => m.AlumnoClasesComponent)
      },
      {
        path: 'mis-inscripciones',
        loadComponent: () => import('./features/alumno/inscripciones/mis-inscripciones.component').then(m => m.MisInscripcionesComponent)
      }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
