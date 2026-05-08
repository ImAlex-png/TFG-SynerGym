import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ClaseService } from '../../../core/services/clase.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { Usuario, Rol } from '../../../core/models/usuario.model';

@Component({
  selector: 'app-clase-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center space-x-4 mb-8">
        <button routerLink="/admin/clases" class="text-gray-400 hover:text-white">← Volver</button>
        <h1 class="text-3xl font-black italic tracking-tighter text-white uppercase">
          {{ isEdit() ? 'Editar' : 'Nueva' }} Sesión Individual
        </h1>
      </div>

      <form [formGroup]="claseForm" (ngSubmit)="onSubmit()" class="bg-bg-card p-8 rounded-2xl border border-white/10 shadow-2xl space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-400 mb-1">Nombre de la Clase</label>
            <input type="text" formControlName="nombre" class="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors" placeholder="Ej: CrossFit WOD">
          </div>
          
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-400 mb-1">Fecha de la Sesión</label>
            <input type="date" formControlName="fecha" class="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Hora Inicio</label>
            <input type="time" formControlName="horaInicio" class="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Hora Fin</label>
            <input type="time" formControlName="horaFin" class="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Capacidad Máxima</label>
            <input type="number" formControlName="capacidadMaxima" class="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Entrenador</label>
            <select formControlName="idEntrenador" class="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors bg-black">
              <option [value]="null">Seleccionar Entrenador</option>
              @for (entrenador of entrenadores(); track entrenador.id) {
                <option [value]="entrenador.id">{{ entrenador.nombre }} {{ entrenador.apellidos }}</option>
              }
            </select>
          </div>
        </div>

        <div class="flex justify-end space-x-4 pt-6 border-t border-white/5">
          <button type="button" routerLink="/admin/clases" class="px-6 py-2 rounded-lg font-bold text-gray-400 hover:text-white transition-colors">
            CANCELAR
          </button>
          <button type="submit" [disabled]="loading()" class="bg-primary hover:bg-primary/90 text-white px-8 py-2 rounded-lg font-bold transition-all transform hover:scale-[1.02]">
            {{ loading() ? 'Guardando...' : (isEdit() ? 'ACTUALIZAR' : 'CREAR SESIÓN') }}
          </button>
        </div>
      </form>
    </div>
  `
})
export class ClaseFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private claseService = inject(ClaseService);
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isEdit = signal(false);
  loading = signal(false);
  claseId: number | null = null;
  entrenadores = signal<Usuario[]>([]);

  claseForm = this.fb.group({
    nombre: ['', Validators.required],
    fecha: ['', Validators.required],
    horaInicio: ['', Validators.required],
    horaFin: ['', Validators.required],
    capacidadMaxima: [20, [Validators.required, Validators.min(1)]],
    idEntrenador: [null, Validators.required]
  });

  ngOnInit() {
    this.loadEntrenadores();
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEdit.set(true);
      this.claseId = +id;
      this.loadClase(this.claseId);
    }
  }

  loadEntrenadores() {
    this.usuarioService.getByRol(Rol.ENTRENADOR).subscribe(data => this.entrenadores.set(data));
  }

  loadClase(id: number) {
    this.claseService.getById(id).subscribe(clase => {
      this.claseForm.patchValue({
        ...clase,
        idEntrenador: clase.entrenador?.id
      });
    });
  }

  onSubmit() {
    if (this.claseForm.invalid) return;
    this.loading.set(true);
    const data = {
      ...this.claseForm.value,
      entrenador: { id: this.claseForm.value.idEntrenador }
    };
    const obs = this.isEdit() 
      ? this.claseService.update(this.claseId!, data)
      : this.claseService.create(data);
    obs.subscribe({
      next: () => this.router.navigate(['/admin/clases']),
      error: () => this.loading.set(false)
    });
  }
}
