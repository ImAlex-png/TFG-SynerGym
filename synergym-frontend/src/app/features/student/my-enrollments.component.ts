import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-enrollments',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-3xl font-bold text-white">Mis Inscripciones</h1>
        <p class="text-slate-400">Gestiona tus clases y reservas</p>
      </div>

      <div class="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-slate-800 bg-slate-900/50">
              <th class="px-6 py-4 text-slate-400 font-medium text-sm">Clase</th>
              <th class="px-6 py-4 text-slate-400 font-medium text-sm">Fecha</th>
              <th class="px-6 py-4 text-slate-400 font-medium text-sm">Estado</th>
              <th class="px-6 py-4 text-slate-400 font-medium text-sm text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800">
            <tr class="hover:bg-slate-800/50 transition-colors">
              <td class="px-6 py-4 text-white font-medium">Yoga</td>
              <td class="px-6 py-4 text-slate-300">22 Abr, 2024</td>
              <td class="px-6 py-4">
                <span class="px-2 py-1 bg-green-600/10 text-green-400 text-xs font-bold rounded-full">CONFIRMADA</span>
              </td>
              <td class="px-6 py-4 text-right">
                <button class="text-red-400 hover:text-red-300 font-medium text-sm">Cancelar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class MyEnrollmentsComponent {}
