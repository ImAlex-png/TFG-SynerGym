import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClaseService, Clase } from '../../../core/services/clase.service';
import { InscripcionService } from '../../../core/services/inscripcion.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-alumno-clases',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-8">
      <div class="bg-gradient-to-r from-secondary/20 to-primary/20 p-8 rounded-3xl border border-white/10">
        <h1 class="text-4xl font-black italic tracking-tighter text-white uppercase">Explorar Clases</h1>
        <p class="text-gray-400 mt-2 font-medium">Encuentra tu próximo desafío y reserva tu plaza.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        @for (clase of clases(); track clase.idClases) {
          <div class="bg-bg-card rounded-3xl border border-white/10 overflow-hidden hover:scale-[1.02] transition-all duration-300 shadow-xl group">
            <div class="h-32 bg-gradient-to-br from-primary/40 to-secondary/40 relative">
               <div class="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-40 transition-opacity">
                  <span class="text-6xl font-black italic text-white uppercase tracking-tighter">{{ clase.nombre.split(' ')[0] }}</span>
               </div>
            </div>
            
            <div class="p-8">
              <div class="flex justify-between items-start mb-6">
                <h3 class="text-2xl font-black text-white leading-tight">{{ clase.nombre }}</h3>
                <span class="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[10px] font-black text-gray-400">
                   ID: {{ clase.idClases }}
                </span>
              </div>

              <div class="space-y-4 mb-8">
                <div class="flex items-center text-gray-400">
                  <div class="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center mr-3">📅</div>
                  <span class="text-sm font-medium">{{ clase.fechaInicio | date }} - {{ clase.fechaFin | date }}</span>
                </div>
                <div class="flex items-center text-gray-400">
                  <div class="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center mr-3">⏰</div>
                  <span class="text-sm font-medium">{{ clase.horaInicio.slice(0,5) }} - {{ clase.horaFin.slice(0,5) }}</span>
                </div>
                <div class="flex items-center text-gray-400">
                  <div class="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center mr-3">👤</div>
                  <span class="text-sm font-medium">Coach: <span class="text-white font-bold">{{ clase.entrenador?.nombre }}</span></span>
                </div>
              </div>

              <div class="flex items-center justify-between pt-6 border-t border-white/5">
                <div class="flex flex-col">
                  <span class="text-[10px] font-black text-gray-500 uppercase tracking-widest">Disponibilidad</span>
                  <span class="text-lg font-black text-primary">{{ clase.capacidadMaxima }} Plazas</span>
                </div>
                <button 
                  (click)="inscribirse(clase.idClases)"
                  class="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-tighter transition-all active:scale-95 shadow-lg shadow-primary/20"
                >
                  ¡APUNTARME!
                </button>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class AlumnoClasesComponent {
  private claseService = inject(ClaseService);
  private inscripcionService = inject(InscripcionService);
  private authService = inject(AuthService);
  
  clases = signal<Clase[]>([]);

  constructor() {
    this.loadClases();
  }

  loadClases() {
    this.claseService.getAll().subscribe(data => this.clases.set(data));
  }

  inscribirse(idClase: number) {
    const idAlumno = this.authService.currentUser()?.id;
    if (!idAlumno) return;

    this.inscripcionService.crear(idAlumno, idClase).subscribe({
      next: () => alert('¡Te has inscrito correctamente! Nos vemos en clase.'),
      error: (err) => alert('No se pudo realizar la inscripción. Verifica si ya estás apuntado.')
    });
  }
}
