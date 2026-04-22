import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-8">
      <div class="flex flex-col">
        <h1 class="text-3xl font-bold text-white">Dashboard del Administrador</h1>
        <p class="text-slate-400">Resumen general del gimnasio</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <h3 class="text-slate-400 text-sm font-medium mb-1">Total Entrenadores</h3>
          <p class="text-3xl font-bold text-white">12</p>
        </div>
        <div class="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <h3 class="text-slate-400 text-sm font-medium mb-1">Clases Activas</h3>
          <p class="text-3xl font-bold text-white">24</p>
        </div>
        <div class="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <h3 class="text-slate-400 text-sm font-medium mb-1">Alumnos Inscritos</h3>
          <p class="text-3xl font-bold text-white">156</p>
        </div>
      </div>
    </div>
  `,
})
export class AdminDashboardComponent {}
