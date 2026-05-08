import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ClaseService, Clase } from '../../../core/services/clase.service';
import { InscripcionService } from '../../../core/services/inscripcion.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-alumno-clases',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-[1200px] mx-auto space-y-8 animate-fadeIn p-4 md:p-6">
      
      <!-- HEADER RE-DISEÑADO (Alineado a la izquierda) -->
      <header class="relative overflow-hidden bg-gradient-to-br from-bg-card to-black p-6 md:p-10 rounded-[30px] border border-white/5 shadow-2xl">
        <div class="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[80px] -mr-30 -mt-30 animate-pulse"></div>
        <div class="relative z-10 text-left">
          <div class="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full mb-4">
            <span class="w-1.5 h-1.5 bg-primary rounded-full animate-ping"></span>
            <span class="text-[9px] font-black text-white uppercase tracking-[0.3em]">Sesiones Disponibles</span>
          </div>
          <h1 class="text-3xl md:text-5xl font-black italic tracking-tighter text-white uppercase leading-none mb-3">
            EXPLORA <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">TU POTENCIAL</span>
          </h1>
          <p class="text-gray-400 text-sm md:text-base font-medium tracking-wide max-w-xl">
            Selecciona tu próximo desafío. Cada sesión cuenta.
          </p>
        </div>
      </header>

      <!-- NOTIFICACIÓN FLOTANTE -->
      @if (notification()) {
        <div class="fixed top-24 right-8 z-50 animate-in fade-in slide-in-from-right-8 duration-500">
          <div [class]="notification()?.type === 'success' ? 'bg-green-500/90' : 'bg-red-500/90'" 
               class="backdrop-blur-xl flex items-center space-x-3 px-6 py-4 rounded-2xl shadow-2xl text-white font-bold border border-white/20">
            <span>{{ notification()?.message }}</span>
            <button (click)="notification.set(null)" class="ml-2">✕</button>
          </div>
        </div>
      }

      <!-- SELECTOR SEMANAL (Alineado a la izquierda, sin cortes) -->
      <div class="flex flex-col space-y-4 py-2 overflow-visible">
        <div class="flex items-center justify-between w-full px-4">
          <div class="flex flex-col">
            <span class="text-[11px] font-black text-primary uppercase tracking-[0.3em] mb-1">Semana Actual</span>
            <h2 class="text-white text-2xl font-black italic uppercase tracking-tighter">{{ weekDays()[0].monthName }} {{ currentReferenceDate().getFullYear() }}</h2>
          </div>
          
          <div class="flex items-center p-1 bg-black/40 backdrop-blur-xl rounded-xl border border-white/5 shadow-xl">
            <button (click)="changeWeek(-1)" class="p-2 hover:bg-white/10 rounded-lg text-white transition-all group">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div class="h-5 w-[1px] bg-white/10 mx-1"></div>
            <button (click)="changeWeek(1)" class="p-2 hover:bg-white/10 rounded-lg text-white transition-all group">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        
        <div class="w-full overflow-visible py-4 px-4">
          <div class="flex space-x-3 overflow-x-auto no-scrollbar py-6 -my-6">
            @for (day of weekDays(); track day.date) {
              <div class="py-2"> <!-- Contenedor para dar aire a la sombra -->
                <button 
                  (click)="selectedDate.set(day.date)"
                  [class]="selectedDate() === day.date ? 'bg-primary text-white scale-105 shadow-[0_12px_25px_rgba(255,77,77,0.4)] border-primary' : 'bg-white/[0.03] text-gray-500 hover:bg-white/[0.08] hover:text-white border-white/5'"
                  class="flex flex-col items-center min-w-[90px] p-4 rounded-2xl transition-all duration-300 border backdrop-blur-sm"
                >
                  <span class="text-[9px] font-black uppercase mb-1 tracking-widest">{{ day.dayName }}</span>
                  <span class="text-xl font-black italic tracking-tighter">{{ day.dayNum }}</span>
                  <span class="text-[8px] font-black mt-1 uppercase tracking-widest opacity-40">{{ day.monthName }}</span>
                </button>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- GRID DE CLASES RE-DISEÑADO -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (clase of filteredClases(); track (clase.idClases || $index)) {
          <div class="group relative bg-bg-card rounded-[2rem] border border-white/5 overflow-hidden hover:border-primary/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
            <!-- Header de la Card -->
            <div class="h-32 bg-gradient-to-br from-primary/20 via-black to-bg-card relative flex items-center justify-center p-4">
               <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5"></div>
               <div class="relative z-10 text-center">
                  <span class="text-4xl font-black italic text-white/5 uppercase tracking-tighter select-none">
                    {{ (clase.nombre || '').split(' ')[0] }}
                  </span>
               </div>
               <div class="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
                 <div class="bg-black/60 backdrop-blur-xl border border-white/10 px-3 py-1 rounded-xl">
                    <span class="text-[9px] font-black text-primary uppercase tracking-[0.2em]">{{ (clase.horaInicio || '').slice(0,5) }}</span>
                 </div>
               </div>
            </div>
            
            <!-- Cuerpo de la Card -->
            <div class="p-6 -mt-4 relative bg-bg-card rounded-t-[2rem] border-t border-white/5 space-y-4">
              <div class="text-center">
                <h3 class="text-xl font-black text-white italic group-hover:text-primary transition-colors uppercase tracking-tighter line-clamp-1">
                  {{ clase.nombre }}
                </h3>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div class="bg-white/[0.02] p-3 rounded-2xl border border-white/5">
                  <p class="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1 text-center">Horario</p>
                  <p class="text-white font-bold text-center text-xs">{{ (clase.horaInicio || '').slice(0,5) }} - {{ (clase.horaFin || '').slice(0,5) }}</p>
                </div>
                <div class="bg-white/[0.02] p-3 rounded-2xl border border-white/5">
                  <p class="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1 text-center">Coach</p>
                  <p class="text-white font-bold text-center text-xs truncate">{{ clase.entrenador?.nombre || 'Team' }}</p>
                </div>
              </div>

              <div class="flex flex-col space-y-4">
                <div class="flex items-center justify-between px-1">
                  <div class="flex flex-col">
                    <span class="text-[8px] font-black text-gray-500 uppercase tracking-widest">Cupos</span>
                    <div class="flex items-end space-x-1">
                      <span class="text-lg font-black text-white leading-none">{{ (clase.capacidadMaxima || 0) - (clase.alumnosInscritos || 0) }}</span>
                      <span class="text-primary font-bold text-[10px]">LIBRES</span>
                    </div>
                  </div>
                </div>

                <button 
                  (click)="inscribirse(clase.idClases)"
                  [disabled]="(clase.capacidadMaxima || 0) <= (clase.alumnosInscritos || 0) || isPast(clase.fecha)"
                  class="w-full relative group/btn overflow-hidden rounded-2xl p-[1px] transition-all active:scale-95 disabled:opacity-40"
                >
                  <div class="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary"></div>
                  <div class="relative bg-bg-card rounded-[0.9rem] py-3 px-4 flex items-center justify-center transition-all group-hover/btn:bg-transparent">
                    <span class="text-white font-black uppercase tracking-[0.1em] text-xs">
                      {{ isPast(clase.fecha) ? 'Finalizada' : 'RESERVAR' }}
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        } @empty {
          <div class="col-span-full py-20 text-center bg-white/[0.01] rounded-[2rem] border border-dashed border-white/5">
            <h3 class="text-xl font-black text-white italic uppercase tracking-tighter">No hay sesiones para hoy</h3>
            <p class="text-gray-500 text-sm mt-1">Selecciona otro día en el calendario.</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    .animate-fadeIn { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `]
})
export class AlumnoClasesComponent implements OnInit {
  private claseService = inject(ClaseService);
  private inscripcionService = inject(InscripcionService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);

  clases = signal<Clase[]>([]);
  notification = signal<{ message: string, type: 'success' | 'error' } | null>(null);
  selectedDate = signal<string>(new Date().toISOString().split('T')[0]);
  currentReferenceDate = signal<Date>(new Date());

  weekDays = computed(() => {
    const ref = new Date(this.currentReferenceDate());
    const day = ref.getDay();
    const diff = ref.getDate() - day + (day === 0 ? -6 : 1);
    const startOfWeek = new Date(ref.setDate(diff));

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      return {
        date: d.toISOString().split('T')[0],
        dayName: d.toLocaleDateString('es-ES', { weekday: 'short' }),
        dayNum: d.getDate(),
        monthName: d.toLocaleDateString('es-ES', { month: 'short' })
      };
    });
  });

  changeWeek(weeks: number) {
    const current = new Date(this.currentReferenceDate());
    current.setDate(current.getDate() + (weeks * 7));
    this.currentReferenceDate.set(current);
  }

  isPast(dateStr: string): boolean {
    const today = new Date().toISOString().split('T')[0];
    return dateStr < today;
  }

  filteredClases = computed(() => {
    return this.clases().filter(c => c.fecha === this.selectedDate());
  });

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['date']) {
        const dateStr = params['date'];
        this.selectedDate.set(dateStr);
        this.currentReferenceDate.set(new Date(dateStr));
      }
    });
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
        this.notification.set({ message: '¡Reserva confirmada con éxito!', type: 'success' });
        this.loadClases();
        setTimeout(() => this.notification.set(null), 3000);
      },
      error: (err) => {
        let msg = 'No se pudo realizar la inscripción.';
        if (typeof err.error === 'string') msg = err.error;
        else if (err.error && err.error.message) msg = err.error.message;
        
        this.notification.set({ message: msg, type: 'error' });
        setTimeout(() => this.notification.set(null), 5000);
      }
    });
  }
}
