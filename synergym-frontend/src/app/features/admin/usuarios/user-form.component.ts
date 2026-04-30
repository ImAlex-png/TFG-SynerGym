import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UsuarioService } from '../../../core/services/usuario.service';
import { Rol } from '../../../core/models/usuario.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center space-x-4 mb-8">
        <button routerLink="/admin/usuarios" class="text-gray-400 hover:text-white">← Volver</button>
        <h1 class="text-3xl font-black italic tracking-tighter text-white uppercase">
          {{ isEdit() ? 'Editar' : 'Nuevo' }} Usuario
        </h1>
      </div>

      <form [formGroup]="userForm" (ngSubmit)="onSubmit()" class="bg-bg-card p-8 rounded-2xl border border-white/10 shadow-2xl space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Nombre</label>
            <input type="text" formControlName="nombre" class="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Apellidos</label>
            <input type="text" formControlName="apellidos" class="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors">
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-400 mb-1">Email</label>
            <input type="email" formControlName="email" class="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">DNI</label>
            <input type="text" formControlName="dni" class="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Teléfono</label>
            <input type="text" formControlName="telefono" class="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Rol del Usuario</label>
            <select formControlName="rol" class="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors bg-black">
              <option [value]="Rol.ALUMNO">Alumno</option>
              <option [value]="Rol.ENTRENADOR">Entrenador</option>
              <option [value]="Rol.ADMINISTRADOR">Administrador</option>
            </select>
          </div>
          @if (!isEdit()) {
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1">Contraseña Inicial</label>
              <input type="password" formControlName="password" class="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors">
            </div>
          }
        </div>

        <div class="flex justify-end space-x-4 pt-6 border-t border-white/5">
          <button type="button" routerLink="/admin/usuarios" class="px-6 py-2 rounded-lg font-bold text-gray-400 hover:text-white transition-colors">
            CANCELAR
          </button>
          <button type="submit" [disabled]="loading()" class="bg-primary hover:bg-primary/90 text-white px-8 py-2 rounded-lg font-bold transition-all transform hover:scale-[1.02]">
            {{ loading() ? 'Guardando...' : (isEdit() ? 'ACTUALIZAR USUARIO' : 'CREAR USUARIO') }}
          </button>
        </div>
      </form>
    </div>
  `
})
export class UserFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  Rol = Rol;
  isEdit = signal(false);
  loading = signal(false);
  userId: number | null = null;

  userForm = this.fb.group({
    nombre: ['', Validators.required],
    apellidos: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    dni: ['', Validators.required],
    telefono: ['', Validators.required],
    rol: [Rol.ALUMNO, Validators.required],
    password: [''] 
  });

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEdit.set(true);
      this.userId = +id;
      this.loadUser(this.userId);
    }
  }

  loadUser(id: number) {
    this.usuarioService.getById(id).subscribe(user => {
      this.userForm.patchValue(user);
    });
  }

  onSubmit() {
    if (this.userForm.invalid) return;

    this.loading.set(true);
    const obs = this.isEdit() 
      ? this.usuarioService.update(this.userId!, this.userForm.value)
      : this.usuarioService.create(this.userForm.value);

    obs.subscribe({
      next: () => this.router.navigate(['/admin/usuarios']),
      error: () => this.loading.set(false)
    });
  }
}
