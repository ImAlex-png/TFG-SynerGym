import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClaseService, Clase } from '../../../core/services/clase.service';
import { AuthService } from '../../../core/services/auth.service';
import { InscripcionService } from '../../../core/services/inscripcion.service';

@Component({
  selector: 'app-entrenador-mis-clases',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-8">
      <div class="bg-gradient-to-r from-primary/10 to-transparent p-8 rounded-3xl border border-white/10">
        <h1 class="text-3xl font-black italic tracking-tighter text-white uppercase">Mi Agenda de Sesiones</h1>
        <p class="text-gray-400 mt-1 font-medium">Controla tus clases individuales y lista de asistencia.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Lista de Clases -->
        <div class="lg:col-span-1 space-y-4">
          <h2 class="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4 flex items-center">
            <span class="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span> Próximas Clases
          </h2>
          
          @for (clase of clases(); track clase.idClases) {
            <button 
              (click)="seleccionarClase(clase)"
              [class]="claseSeleccionada()?.idClases === clase.idClases ? 'border-primary bg-primary/5 shadow-[0_10px_30px_rgba(255,77,77,0.1)]' : 'border-white/5 bg-white/5 hover:bg-white/10'"
              class="w-full text-left p-6 rounded-2xl border transition-all duration-300 group"
            >
              <div class="flex justify-between items-start mb-2">
                <span class="text-[10px] font-black text-primary uppercase tracking-widest">{{ (clase.horaInicio || '').slice(0,5) }}</span>
                <span class="text-[10px] font-bold text-gray-500 uppercase">{{ clase.fecha | date:'shortDate' }}</span>
              </div>
              <h3 class="font-black text-white italic uppercase tracking-tighter group-hover:text-primary transition-colors">{{ clase.nombre }}</h3>
              <div class="mt-3 flex items-center space-x-2">
                <div class="flex -space-x-2">
                  <div class="w-5 h-5 rounded-full bg-white/10 border border-black flex items-center justify-center text-[8px] font-bold">👤</div>
                </div>
                <span class="text-[10px] font-bold text-gray-500">{{ clase.alumnosInscritos }} Alumnos inscritos</span>
              </div>
            </button>
          } @empty {
             <div class="p-10 text-center bg-white/5 rounded-2xl border border-dashed border-white/10 text-gray-500 italic text-sm">
                No tienes sesiones asignadas.
             </div>
          }
        </div>

        <!-- Detalle y Lista de Asistencia -->
        <div class="lg:col-span-2">
          @if (claseSeleccionada()) {
            <div class="bg-bg-card rounded-[2.5rem] border border-white/10 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div class="p-10 bg-gradient-to-br from-white/5 to-transparent border-b border-white/5">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <div class="flex items-center space-x-2 mb-2">
                      <span class="bg-primary px-3 py-0.5 rounded text-[10px] font-black text-white uppercase tracking-widest">{{ claseSeleccionada()?.fecha | date:'fullDate' }}</span>
                      <span class="text-gray-500 text-[10px] font-black uppercase">#{{ claseSeleccionada()?.idClases }}</span>
                    </div>
                    <h2 class="text-4xl font-black italic tracking-tighter text-white uppercase">{{ claseSeleccionada()?.nombre }}</h2>
                  </div>
                  <div class="flex space-x-4">
                    <div class="bg-white/5 p-4 rounded-2xl border border-white/5 text-center min-w-[100px]">
                      <p class="text-[10px] font-black text-gray-500 uppercase mb-1">Horario</p>
                      <p class="text-white font-black italic">{{ (claseSeleccionada()?.horaInicio || '').slice(0,5) }} - {{ (claseSeleccionada()?.horaFin || '').slice(0,5) }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="p-10">
                <div class="flex items-center justify-between mb-8">
                  <h3 class="text-xl font-black italic text-white uppercase tracking-tighter">Lista de Asistencia</h3>
                  <span class="text-[10px] font-black text-gray-500 uppercase tracking-widest">{{ alumnos().length }} Alumnos</span>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  @for (alumno of alumnos(); track alumno.id) {
                    <div class="flex items-center space-x-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/20 transition-all">
                      <div class="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center font-black text-white">
                        {{ alumno.nombre.charAt(0) }}
                      </div>
                      <div>
                        <p class="font-bold text-white text-sm">{{ alumno.nombre }} {{ alumno.apellidos }}</p>
                        <p class="text-[10px] text-gray-500 font-medium uppercase tracking-tighter">{{ alumno.email }}</p>
                      </div>
                    </div>
                  } @empty {
                    <div class="col-span-full py-10 text-center bg-white/[0.02] rounded-2xl border border-dashed border-white/10 text-gray-500 text-sm italic">
                      Aún no hay alumnos inscritos en esta sesión.
                    </div>
                  }
                </div>
              </div>
            </div>
          } @else {
            <div class="h-full min-h-[400px] flex flex-col items-center justify-center bg-white/[0.02] rounded-[2.5rem] border border-dashed border-white/10 p-10 text-center">
              <div class="text-7xl mb-6 grayscale opacity-10">🏋️‍♂️</div>
              <h3 class="text-2xl font-black text-white italic uppercase tracking-tighter">Panel de Sesión</h3>
              <p class="text-gray-500 mt-2 font-medium max-w-xs">Selecciona una clase de tu agenda a la izquierda para ver los detalles y la lista de asistencia de los alumnos.</p>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class MisClasesComponent implements OnInit {
  private claseService = inject(ClaseService);
  private authService = inject(AuthService);
  private inscripcionService = inject(InscripcionService);

  clases = signal<Clase[]>([]);
  claseSeleccionada = signal<Clase | null>(null);
  alumnos = signal<any[]>([]);

  ngOnInit() {
    this.loadClases();
  }

  loadClases() {
    const idEntrenador = this.authService.currentUser()?.id;
    if (idEntrenador) {
      this.claseService.getCalendarioEntrenador(idEntrenador).subscribe(data => {
        this.clases.set(data);
      });
    }
  }

  seleccionarClase(clase: Clase) {
    this.claseSeleccionada.set(clase);
    this.inscripcionService.getByClase(clase.idClases).subscribe(data => {
      this.alumnos.set(data);
    });
  }
}
