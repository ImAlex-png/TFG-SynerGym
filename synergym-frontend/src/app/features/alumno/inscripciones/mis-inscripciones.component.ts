import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InscripcionService, Inscripcion } from '../../../core/services/inscripcion.service';
import { AuthService } from '../../../core/services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-mis-inscripciones',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-8">
      <div class="bg-white/5 p-8 rounded-3xl border border-white/10">
        <h1 class="text-3xl font-black italic tracking-tighter text-white uppercase">Mis Reservas</h1>
        <p class="text-gray-400 mt-1 font-medium text-sm">Gestiona tus próximas sesiones y asistencia.</p>
      </div>

      <!-- NOTIFICACIÓN -->
      @if (notification()) {
        <div class="fixed top-24 right-8 z-50 animate-in fade-in slide-in-from-right-8 duration-500">
          <div [class]="notification()?.type === 'success' ? 'bg-green-500/90' : 'bg-red-500/90'" 
               class="backdrop-blur-xl flex items-center space-x-3 px-6 py-4 rounded-2xl shadow-2xl text-white font-bold border border-white/20">
            <span>{{ notification()?.message }}</span>
            <button (click)="notification.set(null)" class="ml-2">✕</button>
          </div>
        </div>
      }

      @if (inscripciones().length === 0) {
        <div class="bg-bg-card p-20 rounded-[2.5rem] border border-dashed border-white/10 text-center">
          <div class="text-6xl mb-6 grayscale opacity-20">🗓️</div>
          <p class="text-gray-500 mb-6 font-medium">Aún no has reservado ninguna clase para los próximos días.</p>
          <button routerLink="/dashboard" class="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-tighter transition-all shadow-lg shadow-primary/20">
            EXPLORAR CLASES
          </button>
        </div>
      } @else {
        <div class="grid grid-cols-1 gap-6">
          @for (insc of inscripciones(); track insc.idInscripcion) {
            <div class="bg-bg-card p-8 rounded-[2rem] border border-white/10 flex flex-col md:flex-row justify-between items-center group hover:border-primary/30 transition-all duration-300">
              <div class="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8 w-full">
                <div class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-black text-2xl shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                  {{ (insc.clases.nombre || 'C').charAt(0) }}
                </div>
                <div class="flex-1 text-center md:text-left">
                  <div class="flex flex-col md:flex-row items-center md:space-x-3 mb-2">
                    <h3 class="font-black text-white text-xl italic uppercase tracking-tighter">{{ insc.clases.nombre }}</h3>
                    <span class="text-[10px] bg-white/5 px-2 py-1 rounded-md text-gray-500 font-bold uppercase tracking-widest border border-white/5">ID #{{ insc.clases.idClases }}</span>
                  </div>
                  <div class="flex flex-wrap justify-center md:justify-start gap-4">
                    <div class="flex items-center text-gray-400 text-sm bg-white/5 px-3 py-1 rounded-full border border-white/5">
                      <span class="mr-2 opacity-50">📅</span> {{ insc.clases.fecha | date:'fullDate' }}
                    </div>
                    <div class="flex items-center text-gray-400 text-sm bg-white/5 px-3 py-1 rounded-full border border-white/5">
                      <span class="mr-2 opacity-50">⏰</span> {{ (insc.clases.horaInicio || '').slice(0,5) }} - {{ (insc.clases.horaFin || '').slice(0,5) }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex items-center space-x-10 mt-6 md:mt-0 pt-6 md:pt-0 border-t md:border-t-0 border-white/5 w-full md:w-auto justify-between md:justify-end">
                <div class="flex flex-col items-end">
                  <span class="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Estado</span>
                  <span 
                    [class.text-green-500]="insc.estado === 'ACEPTADA'"
                    [class.text-yellow-500]="insc.estado === 'EN_PROCESO'"
                    class="text-xs font-black uppercase tracking-widest px-3 py-1 bg-white/5 rounded-lg border border-white/5"
                  >
                    {{ insc.estado }}
                  </span>
                </div>
                <button 
                  (click)="confirmarCancelacion(insc.idInscripcion)"
                  class="w-12 h-12 flex items-center justify-center bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all duration-300 shadow-lg shadow-red-500/5 active:scale-90"
                  title="Cancelar Reserva"
                >
                  <span class="text-xl">✕</span>
                </button>
              </div>
            </div>
          }
        </div>
      }

      <!-- MODAL DE CONFIRMACIÓN PREMIUM -->
      @if (showConfirmModal()) {
        <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div class="bg-bg-card w-full max-w-sm rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div class="p-8 text-center space-y-6">
              <div class="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center text-red-500 text-3xl mx-auto border border-red-500/30 animate-pulse">
                ⚠️
              </div>
              
              <div class="space-y-2">
                <h3 class="text-2xl font-black italic text-white uppercase tracking-tighter">¿Confirmar cancelación?</h3>
                <p class="text-gray-400 text-sm font-medium leading-relaxed px-4">
                  Esta acción liberará tu plaza inmediatamente. No se puede deshacer.
                </p>
              </div>

              <div class="flex flex-col space-y-3 pt-4">
                <button 
                  (click)="cancelar()"
                  class="w-full py-4 bg-red-500 hover:bg-red-600 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-red-500/20 active:scale-95"
                >
                  SÍ, CANCELAR RESERVA
                </button>
                <button 
                  (click)="cerrarModal()"
                  class="w-full py-3 bg-white/5 hover:bg-white/10 text-gray-400 font-bold uppercase tracking-widest rounded-2xl transition-all active:scale-95"
                >
                  MANTENER PLAZA
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    .animate-fadeIn { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
  `]
})
export class MisInscripcionesComponent {
  private inscripcionService = inject(InscripcionService);
  private authService = inject(AuthService);
  inscripciones = signal<Inscripcion[]>([]);
  notification = signal<{ message: string, type: 'success' | 'error' } | null>(null);
  showConfirmModal = signal<boolean>(false);
  idPendingDelete = signal<number | null>(null);

  constructor() {
    this.loadInscripciones();
  }

  loadInscripciones() {
    const idAlumno = this.authService.currentUser()?.id;
    if (idAlumno) {
      this.inscripcionService.getByAlumno(idAlumno).subscribe(data => this.inscripciones.set(data));
    }
  }

  confirmarCancelacion(id: number) {
    this.idPendingDelete.set(id);
    this.showConfirmModal.set(true);
  }

  cancelar() {
    const id = this.idPendingDelete();
    if (!id) return;

    this.inscripcionService.delete(id).subscribe({
      next: () => {
        this.notification.set({ message: 'Reserva cancelada correctamente', type: 'success' });
        this.loadInscripciones();
        this.cerrarModal();
        setTimeout(() => this.notification.set(null), 3000);
      },
      error: () => {
        this.notification.set({ message: 'Error al cancelar la reserva', type: 'error' });
        this.cerrarModal();
        setTimeout(() => this.notification.set(null), 3000);
      }
    });
  }

  cerrarModal() {
    this.showConfirmModal.set(false);
    this.idPendingDelete.set(null);
  }
}
