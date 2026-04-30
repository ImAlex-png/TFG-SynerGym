import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClaseService, Clase } from '../../../core/services/clase.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-clase-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-black italic tracking-tighter text-white uppercase">Gestión de Clases</h1>
        <button routerLink="/admin/clases/nuevo" class="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-bold transition-all">
          + NUEVA CLASE
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (clase of clases(); track clase.idClases) {
          <div class="bg-bg-card rounded-2xl border border-white/10 overflow-hidden hover:border-primary/50 transition-all group">
            <div class="p-6">
              <div class="flex justify-between items-start mb-4">
                <h3 class="text-xl font-bold text-white group-hover:text-primary transition-colors">{{ clase.nombre }}</h3>
                <span class="bg-primary/10 text-primary px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest">
                  {{ clase.capacidadMaxima }} PLAZAS
                </span>
              </div>
              
              <div class="space-y-2 text-sm text-gray-400">
                <div class="flex items-center space-x-2">
                  <span>📅</span>
                  <span>{{ clase.fechaInicio | date }} - {{ clase.fechaFin | date }}</span>
                </div>
                <div class="flex items-center space-x-2">
                  <span>⏰</span>
                  <span>{{ clase.horaInicio }} - {{ clase.horaFin }}</span>
                </div>
                <div class="flex items-center space-x-2 pt-2 border-t border-white/5">
                  <span class="font-bold text-white">Entrenador:</span>
                  <span>{{ clase.entrenador?.nombre }}</span>
                </div>
              </div>

              <div class="mt-6 flex justify-end space-x-3">
                <button [routerLink]="['/admin/clases/editar', clase.idClases]" class="p-2 bg-white/5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all">
                  ✏️ Editar
                </button>
                <button (click)="deleteClase(clase.idClases)" class="p-2 bg-red-500/10 rounded-lg hover:bg-red-500/20 text-red-500 transition-all">
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class ClaseListComponent {
  private claseService = inject(ClaseService);
  clases = signal<Clase[]>([]);

  constructor() {
    this.loadClases();
  }

  loadClases() {
    this.claseService.getAll().subscribe(data => this.clases.set(data));
  }

  deleteClase(id: number) {
    if (confirm('¿Estás seguro de eliminar esta clase?')) {
      this.claseService.delete(id).subscribe(() => this.loadClases());
    }
  }
}
