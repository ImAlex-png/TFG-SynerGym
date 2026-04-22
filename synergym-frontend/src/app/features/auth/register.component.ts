import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { Rol } from '../../core/models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <!-- Background Decorations -->
      <div class="absolute top-0 right-0 w-96 h-96 bg-primary-600/10 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2"></div>
      <div class="absolute bottom-0 left-0 w-96 h-96 bg-accent-600/10 rounded-full blur-[120px] -translate-x-1/2 translate-y-1/2"></div>

      <div class="w-full max-w-lg glass rounded-3xl p-8 relative z-10 shadow-2xl">
        <div class="flex flex-col items-center mb-8">
          <h1 class="text-3xl font-extrabold text-white tracking-tight">Únete a SynerGym</h1>
          <p class="text-slate-400 mt-2 font-medium">Empieza tu transformación hoy</p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div class="md:col-span-2">
            <label class="block text-sm font-semibold text-slate-300 mb-2 px-1">Nombre de Usuario</label>
            <input
              type="text"
              formControlName="username"
              class="input-field"
              placeholder="usuario123"
            />
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-semibold text-slate-300 mb-2 px-1">Email</label>
            <input
              type="email"
              formControlName="email"
              class="input-field"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-300 mb-2 px-1">Contraseña</label>
            <input
              type="password"
              formControlName="password1"
              class="input-field"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-300 mb-2 px-1">Confirmar</label>
            <input
              type="password"
              formControlName="password2"
              class="input-field"
              placeholder="••••••••"
            />
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-semibold text-slate-300 mb-2 px-1">¿Quién eres?</label>
            <div class="relative">
              <select
                formControlName="rol"
                class="input-field appearance-none cursor-pointer"
              >
                <option [value]="roles.ALUMNO">Alumno</option>
                <option [value]="roles.ENTRENADOR">Entrenador</option>
                <option [value]="roles.ADMINISTRADOR">Administrador</option>
              </select>
              <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <button
            type="submit"
            [disabled]="registerForm.invalid || isLoading()"
            class="btn-primary md:col-span-2 text-lg py-4 flex items-center justify-center gap-2 mt-2"
          >
            <span *ngIf="!isLoading()">Crear Cuenta</span>
            <span *ngIf="isLoading()" class="flex items-center gap-2">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Registrando...
            </span>
          </button>
        </form>

        <div class="mt-8 text-center border-t border-slate-800 pt-6">
          <p class="text-slate-400 text-sm font-medium">
            ¿Ya eres miembro?
            <a routerLink="/login" class="text-primary-400 hover:text-primary-300 font-bold ml-1 transition-colors">Inicia sesión</a>
          </p>
        </div>
      </div>
    </div>
  `,
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  roles = Rol;
  isLoading = signal(false);

  registerForm = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password1: ['', [Validators.required, Validators.minLength(4)]],
    password2: ['', [Validators.required, Validators.minLength(4)]],
    rol: [Rol.ALUMNO, [Validators.required]],
  });

  onSubmit() {
    if (this.registerForm.valid) {
      const data = this.registerForm.getRawValue();
      if (data.password1 !== data.password2) {
        this.toastService.error('Las contraseñas no coinciden');
        return;
      }

      this.isLoading.set(true);
      this.authService.register(data).subscribe({
        next: (success) => {
          this.isLoading.set(false);
          if (success) {
            this.toastService.success('Cuenta creada con éxito');
            this.router.navigate(['/']);
          }
        },
        error: () => this.isLoading.set(false),
      });
    }
  }
}
