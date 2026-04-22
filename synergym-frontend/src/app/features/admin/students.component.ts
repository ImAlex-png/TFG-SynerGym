import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-3xl font-bold text-white">Gestión de Alumnos</h1>
        <p class="text-slate-400">Listado completo de alumnos inscritos</p>
      </div>

      <div class="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-slate-800 bg-slate-900/50">
              <th class="px-6 py-4 text-slate-400 font-medium text-sm">Alumno</th>
              <th class="px-6 py-4 text-slate-400 font-medium text-sm">Email</th>
              <th class="px-6 py-4 text-slate-400 font-medium text-sm">Inscripciones</th>
              <th class="px-6 py-4 text-slate-400 font-medium text-sm text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800">
            <tr class="hover:bg-slate-800/50 transition-colors">
              <td class="px-6 py-4 text-white">María García</td>
              <td class="px-6 py-4 text-slate-300">maria@gmail.com</td>
              <td class="px-6 py-4 text-slate-300">3 clases</td>
              <td class="px-6 py-4 text-right">
                <button class="text-primary-400 hover:text-primary-300 font-medium">Ver detalles</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class StudentsComponent {}
