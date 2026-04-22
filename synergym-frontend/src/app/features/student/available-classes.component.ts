import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-available-classes',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-3xl font-bold text-white">Clases Disponibles</h1>
        <p class="text-slate-400">Reserva tu plaza en nuestras clases</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4 hover:border-primary-500/50 transition-all group">
          <div class="flex justify-between items-start">
            <h3 class="text-xl font-bold text-white group-hover:text-primary-400 transition-colors">Crossfit</h3>
            <span class="text-xs text-slate-500 font-medium">5 plazas libres</span>
          </div>
          <p class="text-slate-400 text-sm">Mejora tu fuerza y resistencia con nuestro entrenamiento de alta intensidad.</p>
          <div class="space-y-2">
            <div class="flex items-center gap-2 text-slate-300 text-sm">
              <span class="text-slate-500">⏰</span>
              <span>19:30 - 20:30</span>
            </div>
            <div class="flex items-center gap-2 text-slate-300 text-sm">
              <span class="text-slate-500">👤</span>
              <span>Carlos M.</span>
            </div>
          </div>
          <button class="w-full py-3 bg-slate-800 group-hover:bg-primary-600 text-white font-semibold rounded-xl transition-all">
            Inscribirme
          </button>
        </div>
      </div>
    </div>
  `,
})
export class AvailableClassesComponent {}
