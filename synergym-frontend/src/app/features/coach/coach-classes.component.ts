import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-coach-classes',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-3xl font-bold text-white">Mis Clases</h1>
        <p class="text-slate-400">Clases que impartes actualmente</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
          <div class="flex justify-between items-start">
            <h3 class="text-xl font-bold text-white">Spinning</h3>
            <span class="px-3 py-1 bg-green-600/10 text-green-400 text-xs font-bold rounded-full uppercase tracking-wider">Hoy</span>
          </div>
          <div class="flex items-center gap-4 text-slate-300 text-sm">
            <span>⏰ 18:00 - 19:00</span>
            <span>📍 Sala 2</span>
          </div>
          <div class="flex justify-between items-center pt-4 border-t border-slate-800">
            <span class="text-slate-300">22 Alumnos inscritos</span>
            <button class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-all">Ver Lista</button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class CoachClassesComponent {}
