import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-bg-dark relative overflow-hidden px-4 py-8">
      <div class="absolute top-[-10%] left-[-10%] w-[60%] md:w-[40%] h-[40%] bg-primary opacity-20 blur-[80px] md:blur-[120px] rounded-full"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[60%] md:w-[40%] h-[40%] bg-secondary opacity-20 blur-[80px] md:blur-[120px] rounded-full"></div>

      <div class="bg-bg-card p-6 sm:p-10 rounded-[30px] sm:rounded-[40px] border border-white/10 shadow-2xl w-full max-w-md backdrop-blur-md z-10">
        <div class="text-center mb-8 sm:mb-10">
          <h1 class="text-3xl sm:text-4xl font-black italic tracking-tighter text-white uppercase">
            SYNER<span class="text-primary">GYM</span>
          </h1>
          <p class="text-sm sm:text-base text-gray-400 mt-2 font-medium">Bienvenido de nuevo, guerrero.</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-5 sm:space-y-6">
          <div>
            <label class="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-[0.2em]">Email</label>
            <input type="email" formControlName="email" class="w-full bg-black/50 border border-white/10 rounded-2xl px-4 py-3 sm:px-5 sm:py-4 text-white focus:outline-none focus:border-primary transition-all text-sm sm:text-base">
          </div>

          <div class="relative">
            <label class="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-[0.2em]">Contraseña</label>
            <div class="relative">
              <input [type]="showPassword() ? 'text' : 'password'" formControlName="password" class="w-full bg-black/50 border border-white/10 rounded-2xl px-4 py-3 sm:px-5 sm:py-4 text-white focus:outline-none focus:border-primary transition-all text-sm sm:text-base pr-12">
              <button type="button" (click)="showPassword.set(!showPassword())" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary transition-colors">
                @if (showPassword()) {
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                } @else {
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644C3.412 7.965 7.447 4.5 12 4.5c4.553 0 8.588 3.465 9.963 7.178.07.186.07.394 0 .58a10.455 10.455 0 01-9.963 7.178c-4.553 0-8.588-3.465-9.963-7.178z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                }
              </button>
            </div>
          </div>

          <button type="submit" [disabled]="loading()" class="w-full bg-primary hover:bg-primary/90 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-primary/20 uppercase tracking-widest active:scale-95 text-sm sm:text-base">
            {{ loading() ? 'INICIANDO...' : 'ENTRAR AL GYM' }}
          </button>
        </form>

        <div class="mt-8 sm:mt-10 pt-6 border-t border-white/5 text-center">
          <p class="text-xs text-gray-500 mb-4">¿No tienes cuenta todavía?</p>
          <button 
            type="button"
            (click)="goToRegister()" 
            class="px-6 py-3 sm:px-8 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-secondary font-black uppercase tracking-widest text-[10px] transition-all hover:scale-105 active:scale-95 w-full sm:w-auto"
          >
            Crear nueva cuenta
          </button>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  loading = signal(false);
  error = signal<string | null>(null);
  showPassword = signal(false);

  onSubmit() {
    if (this.loginForm.invalid) return;
    this.loading.set(true);
    this.authService.login(this.loginForm.value).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: () => {
        this.loading.set(false);
      }
    });
  }

  goToRegister() {
    console.log('Botón de registro pulsado - Navegando a /register');
    this.router.navigate(['/register']).then(success => {
      if (success) {
        console.log('Navegación exitosa');
      } else {
        console.error('La navegación a /register ha fallado');
      }
    });
  }
}
