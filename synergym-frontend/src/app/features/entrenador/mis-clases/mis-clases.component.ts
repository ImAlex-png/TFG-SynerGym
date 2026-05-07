import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClaseService, Clase } from '../../../core/services/clase.service';
import { AuthService } from '../../../core/services/auth.service';
import { InscripcionService } from '../../../core/services/inscripcion.service';

@Component({
  selector: 'app-mis-clases',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8">
      <div class="flex justify-between items-end mb-8">
        <div>
          <h2 class="text-4xl font-black text-white italic tracking-tighter uppercase">Mis Clases Asignadas</h2>
          <p class="text-gray-400 mt-2 font-medium">Gestiona tu horario y visualiza tus próximas sesiones.</p>
        </div>
        <div class="bg-primary/10 border border-primary/20 px-6 py-3 rounded-2xl">
          <span class="text-primary font-bold">{{ misClases().length }} Clases Totales</span>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (clase of misClases(); track (clase.idClases || $index)) {
          <div class="group bg-bg-card border border-white/5 rounded-3xl overflow-hidden hover:border-primary/50 transition-all duration-500 hover:shadow-[0_0_40px_rgba(255,77,77,0.1)]">
            <div class="p-6">
              <div class="flex justify-between items-start mb-4">
                <div class="p-3 bg-primary/10 rounded-2xl group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                  <span class="text-2xl">🏋️</span>
                </div>
                <div class="flex flex-col items-end">
                  <span class="text-[10px] uppercase tracking-widest font-bold text-gray-500">Capacidad</span>
                  <span class="text-white font-bold">{{ clase.capacidadMaxima }} plazas</span>
                </div>
              </div>

              <h3 class="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{{ clase.nombre }}</h3>
              
              <div class="space-y-3 mt-6">
                <div class="flex items-center text-gray-400 space-x-3 text-sm">
                  <span class="text-primary">📅</span>
                  <span>{{ clase.fechaInicio | date:'mediumDate' }} - {{ clase.fechaFin | date:'mediumDate' }}</span>
                </div>
                <div class="flex items-center text-gray-400 space-x-3 text-sm">
                  <span class="text-primary">⏰</span>
                  <span class="font-bold text-white">{{ (clase.horaInicio || '').substring(0,5) }} - {{ (clase.horaFin || '').substring(0,5) }}</span>
                </div>
              </div>

              <div class="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
                <button (click)="verDetalles(clase)" class="text-xs font-bold uppercase tracking-widest text-primary hover:text-white transition-colors">
                  Ver Detalles
                </button>
                <div class="flex -space-x-2">
                  @if ((clase.alumnosInscritos || 0) > 0) {
                    @for (i of [].constructor(Math.min(clase.alumnosInscritos || 0, 3)); track $index) {
                      <div class="w-8 h-8 rounded-full border-2 border-bg-card bg-gray-800 flex items-center justify-center text-[10px] font-bold text-gray-400">
                        👤
                      </div>
                    }
                    @if ((clase.alumnosInscritos || 0) > 3) {
                      <div class="w-8 h-8 rounded-full border-2 border-bg-card bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                        +{{ (clase.alumnosInscritos || 0) - 3 }}
                      </div>
                    }
                  } @else {
                    <span class="text-[10px] text-gray-500 font-bold uppercase">Sin inscritos</span>
                  }
                </div>
              </div>
            </div>
          </div>
        } @empty {
          <div class="col-span-full py-20 text-center">
            <div class="text-6xl mb-4">📅</div>
            <h3 class="text-2xl font-bold text-white">No tienes clases asignadas</h3>
            <p class="text-gray-500 mt-2">Contacta con el administrador si crees que esto es un error.</p>
          </div>
        }
      </div>
    </div>

    <!-- Modal de Detalles -->
    @if (claseSeleccionada()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" (click)="cerrarModal()"></div>
        <div class="relative bg-bg-card border border-white/10 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
          <div class="p-8">
            <div class="flex justify-between items-start mb-6">
              <div>
                <span class="text-primary text-xs font-black uppercase tracking-[0.2em] mb-2 block">Detalles de la sesión</span>
                <h2 class="text-3xl font-black text-white italic tracking-tighter uppercase">{{ claseSeleccionada()?.nombre }}</h2>
              </div>
              <button (click)="cerrarModal()" class="text-gray-500 hover:text-white transition-colors">
                <span class="text-2xl">✕</span>
              </button>
            </div>

            <div class="grid grid-cols-2 gap-4 mb-8">
              <div class="bg-white/5 p-4 rounded-2xl">
                <p class="text-[10px] uppercase text-gray-500 font-bold mb-1">Horario</p>
                <p class="text-white font-bold">{{ claseSeleccionada()?.horaInicio?.substring(0,5) }} - {{ claseSeleccionada()?.horaFin?.substring(0,5) }}</p>
              </div>
              <div class="bg-white/5 p-4 rounded-2xl">
                <p class="text-[10px] uppercase text-gray-500 font-bold mb-1">Capacidad</p>
                <p class="text-white font-bold">{{ claseSeleccionada()?.capacidadMaxima }} Plazas Totales</p>
              </div>
            </div>

            <div class="mb-2">
              <h4 class="text-white font-bold mb-4 flex items-center">
                <span class="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center text-primary mr-3">👥</span>
                Alumnos Inscritos ({{ alumnosInscritos().length }})
              </h4>
              
              <div class="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                @if (alumnosInscritos().length > 0) {
                  <div class="space-y-2">
                    @for (alumno of alumnosInscritos(); track alumno.id) {
                      <div class="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 hover:border-primary/30 transition-colors">
                        <div class="flex items-center space-x-3">
                          <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {{ alumno.nombre?.substring(0,1) }}{{ alumno.apellido?.substring(0,1) }}
                          </div>
                          <div>
                            <p class="text-white font-bold text-sm">{{ alumno.nombre }} {{ alumno.apellido }}</p>
                            <p class="text-gray-500 text-xs">{{ alumno.email }}</p>
                          </div>
                        </div>
                        <div class="text-right">
                          <span class="text-[10px] bg-green-500/10 text-green-500 px-2 py-1 rounded-md font-bold uppercase">Confirmado</span>
                        </div>
                      </div>
                    }
                  </div>
                } @else {
                  <div class="text-center py-10 bg-white/5 rounded-2xl border border-dashed border-white/10">
                    <p class="text-gray-500 italic">No hay alumnos inscritos todavía</p>
                  </div>
                }
              </div>
            </div>

            <div class="mt-8 flex justify-end">
              <button (click)="cerrarModal()" class="px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold transition-all uppercase tracking-widest text-xs">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    :host { display: block; }
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,77,77,0.3); border-radius: 10px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,77,77,0.5); }
  `]
})
export class MisClasesComponent implements OnInit {
  private claseService = inject(ClaseService);
  private authService = inject(AuthService);
  private inscripcionService = inject(InscripcionService);
  
  Math = Math;
  allClases = signal<Clase[]>([]);
  claseSeleccionada = signal<Clase | null>(null);
  alumnosInscritos = signal<any[]>([]);

  // Computamos las clases del entrenador de forma reactiva
  misClases = computed(() => {
    const user = this.authService.currentUser();
    if (!user) return [];
    
    const userId = user.id || (user as any).idUsuario || (user as any).id_usuario;
    if (!userId) return [];

    return this.allClases().filter(c => {
      const ent = c.entrenador;
      if (!ent) return false;
      if (typeof ent === 'object') {
        return ent.id == userId || ent.idUsuario == userId || ent.id_usuario == userId;
      }
      return ent == userId;
    });
  });

  ngOnInit() {
    this.cargarDatos();
  }

  private cargarDatos() {
    this.claseService.getAll().subscribe({
      next: (clases) => this.allClases.set(clases),
      error: (err) => console.error('Error al cargar clases:', err)
    });
  }

  verDetalles(clase: Clase) {
    this.claseSeleccionada.set(clase);
    const idClase = clase.idClases || (clase as any).id;
    if (idClase) {
      this.inscripcionService.getByClase(idClase).subscribe({
        next: (alumnos) => {
          this.alumnosInscritos.set(alumnos);
        },
        error: (err) => {
          console.error('Error al cargar alumnos:', err);
          this.alumnosInscritos.set([]);
        }
      });
    }
  }

  cerrarModal() {
    this.claseSeleccionada.set(null);
    this.alumnosInscritos.set([]);
  }
}
