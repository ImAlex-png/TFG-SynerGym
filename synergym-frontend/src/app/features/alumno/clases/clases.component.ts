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
      <div class="bg-gradient-to-r from-secondary/20 to-primary/20 p-8 rounded-3xl border border-white/10 mb-8">
        <h1 class="text-4xl font-black italic tracking-tighter text-white uppercase">Explorar Clases</h1>
        <p class="text-gray-400 mt-2 font-medium">Encuentra tu próximo desafío y reserva tu plaza.</p>
      </div>

      <!-- Notificación -->
      @if (notification()) {
        <div class="fixed top-24 right-8 z-50 animate-in fade-in slide-in-from-right-8 duration-300">
          <div [class]="notification()?.type === 'success' ? 'bg-green-500 shadow-green-500/20' : 'bg-red-500 shadow-red-500/20'" 
               class="flex items-center space-x-3 px-6 py-4 rounded-2xl shadow-2xl text-white font-bold border border-white/20">
            <span>{{ notification()?.message }}</span>
            <button (click)="notification.set(null)" class="ml-4 hover:opacity-70">✕</button>
          </div>
        </div>
      }

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
  notification = signal<{message: string, type: 'success' | 'error'} | null>(null);

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
      next: () => {
        this.notification.set({ message: '¡Inscripción realizada con éxito!', type: 'success' });
        setTimeout(() => this.notification.set(null), 3000);
      },
      error: (err) => {
        console.error('Error de inscripción:', err);
        let msg = 'No se pudo realizar la inscripción.';
        
        if (typeof err.error === 'string') {
          msg = err.error;
        } else if (err.error && err.error.message) {
          msg = err.error.message;
        }
        
        this.notification.set({ message: msg, type: 'error' });
        setTimeout(() => this.notification.set(null), 5000);
      }
    });
  }
}
