import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { ClaseService, Clase } from '../../core/services/clase.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-[1600px] mx-auto space-y-10 animate-fadeIn p-4 md:p-8">
      
      <!-- HERO HEADER -->
      <header class="relative overflow-hidden bg-gradient-to-br from-bg-card to-black p-12 rounded-[40px] border border-white/5 shadow-2xl">
        <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -mr-40 -mt-40 animate-pulse"></div>
        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <h1 class="text-5xl font-black italic tracking-tighter text-white uppercase leading-none">
              BIENVENIDO, <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">{{ authService.currentUser()?.nombre }}</span>
            </h1>
            <p class="text-gray-400 mt-4 text-lg font-medium tracking-wide max-w-xl">
              Tu progreso no se detiene. Aquí tienes tu planificación estratégica para esta semana.
            </p>
          </div>
          <div class="flex gap-4">
             <div class="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl text-center min-w-[140px]">
                <p class="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Total Clases</p>
                <p class="text-3xl font-black text-white italic">{{ clases().length }}</p>
             </div>
          </div>
        </div>
      </header>

      <!-- CALENDAR SECTION -->
      <section class="bg-bg-card/50 backdrop-blur-xl rounded-[40px] border border-white/5 overflow-hidden shadow-2xl">
        
        <!-- CALENDAR NAVIGATION -->
        <div class="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 bg-white/[0.02]">
          <div class="flex items-center gap-6">
            <h2 class="text-2xl font-black italic text-white uppercase tracking-tighter">Planificación</h2>
            <div class="h-8 w-[1px] bg-white/10 hidden md:block"></div>
            <div class="flex items-center gap-3">
              <span class="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]"></span>
              <span class="text-xs font-black text-white uppercase tracking-[0.3em]">{{ currentMonthName }} {{ currentYear }}</span>
            </div>
          </div>
          
          <div class="flex items-center p-1 bg-black/40 rounded-2xl border border-white/5">
            <button (click)="changeWeek(-1)" class="p-3 hover:bg-white/10 rounded-xl text-white transition-all group active:scale-90">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button (click)="goToToday()" class="px-6 py-2 mx-1 bg-white/5 hover:bg-primary hover:text-white rounded-xl text-white text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-white/5 active:scale-95">
              Hoy
            </button>
            <button (click)="changeWeek(1)" class="p-3 hover:bg-white/10 rounded-xl text-white transition-all group active:scale-90">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <!-- CALENDAR GRID -->
        <div class="grid grid-cols-1 md:grid-cols-7 divide-x divide-white/5 bg-black/20 overflow-x-auto">
          @for (day of weekDays; track day.date.getTime()) {
            <div class="min-w-[200px] flex flex-col group/day transition-colors" [class.bg-primary/[0.03]]="isToday(day.date)">
              
              <div class="p-6 text-center border-b border-white/5 bg-white/[0.01] group-hover/day:bg-white/[0.03] transition-colors">
                <p class="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 group-hover/day:text-primary transition-colors">
                  {{ day.name }}
                </p>
                <div class="inline-flex items-center justify-center w-12 h-12 rounded-2xl transition-all"
                     [class.bg-primary]="isToday(day.date)"
                     [class.text-white]="isToday(day.date)"
                     [class.text-white/40]="!isToday(day.date)">
                  <span class="text-2xl font-black italic">{{ day.date | date:'dd' }}</span>
                </div>
              </div>

              <div class="flex-1 p-4 space-y-4 relative min-h-[600px] bg-gradient-to-b from-transparent to-black/20">
                @for (clase of getClasesForDay(day.date); track (clase.idClases || clase.id)) {
                  <div 
                    (click)="showClaseInfo(clase)"
                    class="group relative p-5 rounded-[28px] bg-white/[0.03] border border-white/5 hover:border-primary/40 transition-all cursor-pointer overflow-hidden shadow-xl backdrop-blur-md hover:-translate-y-2 active:scale-95"
                  >
                    <div class="absolute left-0 top-0 bottom-0 w-1.5 bg-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.8)]"></div>
                    
                    <div class="flex flex-col gap-3">
                      <div class="flex items-center justify-between">
                        <span class="px-3 py-1 bg-primary/10 rounded-full text-[9px] font-black text-primary uppercase tracking-widest border border-primary/20">
                          {{ (clase.horaInicio || '') | slice:0:5 }}
                        </span>
                        <span class="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                           {{ clase.alumnosInscritos || 0 }} / {{ clase.capacidadMaxima }} Plazas
                        </span>
                      </div>
                      
                      <h3 class="text-base font-black text-white italic uppercase tracking-tighter leading-tight group-hover:text-primary transition-colors">
                        {{ clase.nombre }}
                      </h3>

                      <div class="flex items-center justify-between mt-2">
                         <p class="text-[8px] text-gray-500 uppercase font-black">Click para info</p>
                         <div class="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-sm group-hover:bg-primary transition-all">
                          ℹ️
                        </div>
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      </section>

      <!-- MODAL DE INFO -->
      @if (selectedClase()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn" (click)="selectedClase.set(null)">
          <div class="bg-bg-card w-full max-w-md rounded-[40px] border border-white/10 overflow-hidden shadow-2xl transform transition-all" (click)="$event.stopPropagation()">
            <div class="relative h-48 bg-gradient-to-br from-primary to-secondary p-8 flex items-end">
              <button (click)="selectedClase.set(null)" class="absolute top-6 right-6 w-10 h-10 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center text-white transition-all">✕</button>
              <h2 class="text-3xl font-black italic text-white uppercase tracking-tighter leading-none">{{ selectedClase()?.nombre }}</h2>
            </div>
            
            <div class="p-8 space-y-6">
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <p class="text-[9px] font-black text-primary uppercase tracking-widest mb-1">Horario</p>
                  <p class="text-white font-bold">{{ selectedClase()?.horaInicio | slice:0:5 }} - {{ selectedClase()?.horaFin | slice:0:5 }}</p>
                </div>
                <div class="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <p class="text-[9px] font-black text-primary uppercase tracking-widest mb-1">Ocupación</p>
                  <p class="text-white font-bold">{{ selectedClase()?.alumnosInscritos || 0 }} de {{ selectedClase()?.capacidadMaxima }} inscritos</p>
                </div>
              </div>

              <div class="bg-white/5 p-6 rounded-3xl border border-white/5 space-y-4">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Entrenador</p>
                    <p class="text-white font-black italic">{{ selectedClase()?.entrenador?.nombre || 'Por asignar' }}</p>
                  </div>
                  <div class="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-xl">💪</div>
                </div>
                <div class="h-[1px] bg-white/5"></div>
                <div>
                  <p class="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Periodo</p>
                  <p class="text-white text-sm font-medium">Del {{ selectedClase()?.fechaInicio | date:'dd/MM' }} al {{ selectedClase()?.fechaFin | date:'dd/MM/yyyy' }}</p>
                </div>
              </div>

              <button (click)="selectedClase.set(null)" class="w-full py-4 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-primary/20 active:scale-95">
                Cerrar Detalles
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes fadeIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
    .animate-fadeIn { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
  `]
})
export class DashboardComponent implements OnInit {
  authService = inject(AuthService);
  claseService = inject(ClaseService);

  clases = signal<any[]>([]);
  weekDays: { name: string, date: Date }[] = [];
  currentReferenceDate = new Date();
  selectedClase = signal<any | null>(null);

  get currentMonthName(): string {
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return months[this.weekDays[0]?.date.getMonth()] || '';
  }

  get currentYear(): number {
    return this.weekDays[0]?.date.getFullYear();
  }

  ngOnInit() {
    this.generateWeekDays();
    this.loadClases();
  }

  generateWeekDays() {
    const ref = new Date(this.currentReferenceDate);
    const dayOfWeek = ref.getDay();
    const diff = ref.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    
    const startOfWeek = new Date(ref.setDate(diff));
    const names = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

    this.weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      this.weekDays.push({
        name: names[i],
        date: date
      });
    }
  }

  changeWeek(weeks: number) {
    this.currentReferenceDate.setDate(this.currentReferenceDate.getDate() + (weeks * 7));
    this.generateWeekDays();
  }

  goToToday() {
    this.currentReferenceDate = new Date();
    this.generateWeekDays();
  }

  showClaseInfo(clase: any) {
    this.selectedClase.set(clase);
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

  loadClases() {
    this.claseService.getAll().subscribe({
      next: (data) => {
        const sorted = [...data].sort((a, b) => (a.horaInicio || '').localeCompare(b.horaFin || ''));
        this.clases.set(sorted);
      }
    });
  }

  getClasesForDay(date: Date): any[] {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    return this.clases().filter(clase => {
      return dateStr >= clase.fechaInicio && dateStr <= clase.fechaFin;
    });
  }
}
