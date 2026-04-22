import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <!-- Background Decorations -->
      <div class="absolute top-0 left-0 w-96 h-96 bg-primary-600/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-accent-600/10 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2"></div>

      <div class="w-full max-w-md glass rounded-3xl p-8 relative z-10 shadow-2xl">
        <div class="flex flex-col items-center mb-8">
          <div class="w-16 h-16 bg-gradient-to-tr from-primary-600 to-accent-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-primary-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 class="text-4xl font-extrabold text-white tracking-tight">SynerGym</h1>
          <p class="text-slate-400 mt-2 font-medium">Entrena tu cuerpo, fortalece tu mente</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-5">
          <div>
            <label class="block text-sm font-semibold text-slate-300 mb-2 px-1">Email</label>
            <input
              type="email"
              formControlName="username"
              class="input-field"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-300 mb-2 px-1">Contraseña</label>
            <input
              type="password"
              formControlName="password"
              class="input-field"
              placeholder="••••••••"
            />
          </div>

          <div class="flex items-center justify-end">
            <a href="#" class="text-sm text-primary-400 hover:text-primary-300 transition-colors">¿Olvidaste tu contraseña?</a>
          </div>

          <button
            type="submit"
            [disabled]="loginForm.invalid || isLoading()"
            class="btn-primary w-full text-lg py-4 flex items-center justify-center gap-2 group"
          >
            <span *ngIf="!isLoading()">Entrar</span>
            <span *ngIf="isLoading()" class="flex items-center gap-2">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Iniciando sesión...
            </span>
          </button>
        </form>

        <div class="mt-10 text-center border-t border-slate-800 pt-6">
          <p class="text-slate-400 text-sm">
            ¿Nuevo en SynerGym?
            <a routerLink="/register" class="text-primary-400 hover:text-primary-300 font-bold ml-1 transition-colors">Crea tu cuenta</a>
          </p>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  isLoading = signal(false);

  loginForm = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]],
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.authService.login(this.loginForm.getRawValue()).subscribe({
        next: (success) => {
          this.isLoading.set(false);
          if (success) {
            this.toastService.success('Bienvenido de nuevo');
            this.router.navigate(['/']);
          }
        },
        error: () => this.isLoading.set(false),
      });
    }
  }
}
