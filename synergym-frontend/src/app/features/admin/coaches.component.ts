import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-coaches',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-white">Gestión de Entrenadores</h1>
          <p class="text-slate-400">Añade, edita o elimina entrenadores</p>
        </div>
        <button class="px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-primary-900/20">
          Nuevo Entrenador
        </button>
      </div>

      <div class="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-slate-800 bg-slate-900/50">
              <th class="px-6 py-4 text-slate-400 font-medium text-sm">Nombre</th>
              <th class="px-6 py-4 text-slate-400 font-medium text-sm">DNI</th>
              <th class="px-6 py-4 text-slate-400 font-medium text-sm">Email</th>
              <th class="px-6 py-4 text-slate-400 font-medium text-sm text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800">
            <tr class="hover:bg-slate-800/50 transition-colors">
              <td class="px-6 py-4 text-white">Juan Pérez</td>
              <td class="px-6 py-4 text-slate-300">12345678A</td>
              <td class="px-6 py-4 text-slate-300">juan@synergym.com</td>
              <td class="px-6 py-4 text-right">
                <button class="text-primary-400 hover:text-primary-300 font-medium">Editar</button>
                <button class="ml-4 text-red-400 hover:text-red-300 font-medium">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class CoachesComponent {}
