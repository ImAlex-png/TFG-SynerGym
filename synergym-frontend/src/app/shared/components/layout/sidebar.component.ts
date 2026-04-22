import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Rol } from '../../../core/models/user.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="w-64 h-screen bg-slate-900 border-r border-slate-800 flex flex-col fixed left-0 top-0">
      <div class="p-6 flex items-center gap-3">
        <div class="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <span class="text-xl font-bold text-white tracking-tight">SynerGym</span>
      </div>

      <nav class="flex-1 px-4 py-6 space-y-2">
        <!-- Admin Links -->
        <ng-container *ngIf="authService.role() === roles.ADMINISTRADOR">
          <a routerLink="/admin/dashboard" routerLinkActive="bg-slate-800 text-primary-400" class="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-all">
            <span>Dashboard</span>
          </a>
          <a routerLink="/admin/coaches" routerLinkActive="bg-slate-800 text-primary-400" class="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-all">
            <span>Entrenadores</span>
          </a>
          <a routerLink="/admin/classes" routerLinkActive="bg-slate-800 text-primary-400" class="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-all">
            <span>Clases</span>
          </a>
          <a routerLink="/admin/students" routerLinkActive="bg-slate-800 text-primary-400" class="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-all">
            <span>Alumnos</span>
          </a>
        </ng-container>

        <!-- Coach Links -->
        <ng-container *ngIf="authService.role() === roles.ENTRENADOR">
          <a routerLink="/coach/classes" routerLinkActive="bg-slate-800 text-primary-400" class="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-all">
            <span>Mis Clases</span>
          </a>
        </ng-container>

        <!-- Student Links -->
        <ng-container *ngIf="authService.role() === roles.ALUMNO">
          <a routerLink="/student/classes" routerLinkActive="bg-slate-800 text-primary-400" class="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-all">
            <span>Clases Disponibles</span>
          </a>
          <a routerLink="/student/enrollments" routerLinkActive="bg-slate-800 text-primary-400" class="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-all">
            <span>Mis Inscripciones</span>
          </a>
        </ng-container>
      </nav>

      <div class="p-4 border-t border-slate-800">
        <button (click)="authService.logout()" class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-400/10 transition-all">
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  `,
})
export class SidebarComponent {
  authService = inject(AuthService);
  roles = Rol;
}
