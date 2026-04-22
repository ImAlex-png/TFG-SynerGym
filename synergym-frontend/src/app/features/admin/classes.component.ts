import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-classes',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-white">Gestión de Clases</h1>
          <p class="text-slate-400">Configura el horario y asigna entrenadores</p>
        </div>
        <button class="px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-primary-900/20">
          Nueva Clase
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
          <div class="flex justify-between items-start">
            <h3 class="text-xl font-bold text-white">Yoga</h3>
            <span class="px-3 py-1 bg-primary-600/10 text-primary-400 text-xs font-bold rounded-full uppercase tracking-wider">Activa</span>
          </div>
          <p class="text-slate-400 text-sm">Entrenador: Juan Pérez</p>
          <div class="flex items-center gap-4 text-slate-300 text-sm">
            <span>📅 Lun, Mie</span>
            <span>⏰ 09:00 - 10:00</span>
          </div>
          <div class="flex justify-between items-center pt-4 border-t border-slate-800">
            <span class="text-xs text-slate-500">15/20 Alumnos</span>
            <div class="flex gap-2">
              <button class="p-2 text-primary-400 hover:bg-slate-800 rounded-lg transition-all">Editar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ClassesComponent {}
