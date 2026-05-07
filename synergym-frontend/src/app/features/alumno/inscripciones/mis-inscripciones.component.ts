import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InscripcionService, Inscripcion } from '../../../core/services/inscripcion.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-mis-inscripciones',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <h1 class="text-3xl font-black italic tracking-tighter text-white uppercase">Mis Clases</h1>

      @if (inscripciones().length === 0) {
        <div class="bg-bg-card p-12 rounded-2xl border border-white/10 text-center">
          <p class="text-gray-500 mb-4">No estás apuntado a ninguna clase todavía.</p>
          <button routerLink="/clases" class="text-primary font-bold hover:underline">Ver clases disponibles</button>
        </div>
      } @else {
        <div class="grid grid-cols-1 gap-4">
          @for (insc of inscripciones(); track insc.idInscripcion) {
            <div class="bg-bg-card p-6 rounded-2xl border border-white/10 flex justify-between items-center group hover:border-primary/50 transition-all">
              <div class="flex items-center space-x-6">
                <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold shrink-0">
                  {{ insc.clases.nombre.charAt(0) }}
                </div>
                <div>
                  <div class="flex items-center space-x-2">
                    <h3 class="font-bold text-white text-lg">{{ insc.clases.nombre }}</h3>
                    <span class="text-[10px] bg-white/5 px-2 py-0.5 rounded text-gray-500 font-bold uppercase tracking-tighter">ID: {{ insc.clases.idClases }}</span>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-1 mt-1">
                    <p class="text-xs text-gray-500 flex items-center">
                      <span class="mr-2">📅</span> {{ insc.clases.fechaInicio | date }} - {{ insc.clases.fechaFin | date }}
                    </p>
                    <p class="text-xs text-gray-500 flex items-center">
                      <span class="mr-2">⏰</span> {{ insc.clases.horaInicio.slice(0,5) }} - {{ insc.clases.horaFin.slice(0,5) }}
                    </p>
                    <p class="text-xs text-gray-500 flex items-center">
                      <span class="mr-2">👤</span> Coach: <span class="text-white ml-1">{{ insc.clases.entrenador?.nombre }}</span>
                    </p>
                  </div>
                </div>
              </div>

              <div class="flex items-center space-x-8">
                <div class="text-right">
                  <span 
                    [class.text-green-500]="insc.estado === 'ACEPTADA'"
                    [class.text-yellow-500]="insc.estado === 'EN_PROCESO'"
                    class="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-white/5 rounded"
                  >
                    {{ insc.estado }}
                  </span>
                </div>
                <button 
                  (click)="cancelar(insc.idInscripcion)"
                  class="text-gray-600 hover:text-red-500 transition-colors p-2"
                  title="Cancelar Inscripción"
                >
                  ✕
                </button>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class MisInscripcionesComponent {
  private inscripcionService = inject(InscripcionService);
  private authService = inject(AuthService);
  
  inscripciones = signal<Inscripcion[]>([]);

  constructor() {
    this.loadInscripciones();
  }

  loadInscripciones() {
    const idAlumno = this.authService.currentUser()?.id;
    if (idAlumno) {
      this.inscripcionService.getByAlumno(idAlumno).subscribe(data => this.inscripciones.set(data));
    }
  }

  cancelar(id: number) {
    if (confirm('¿Seguro que quieres cancelar esta clase?')) {
      this.inscripcionService.delete(id).subscribe(() => this.loadInscripciones());
    }
  }
}
