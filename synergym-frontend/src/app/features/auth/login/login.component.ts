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
    <div class="min-h-screen flex items-center justify-center bg-bg-dark relative overflow-hidden px-4">
      <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary opacity-20 blur-[120px] rounded-full"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary opacity-20 blur-[120px] rounded-full"></div>

      <div class="bg-bg-card p-10 rounded-[40px] border border-white/10 shadow-2xl w-full max-w-md backdrop-blur-md z-10">
        <div class="text-center mb-10">
          <h1 class="text-4xl font-black italic tracking-tighter text-white uppercase">
            SYNER<span class="text-primary">GYM</span>
          </h1>
          <p class="text-gray-400 mt-2 font-medium">Bienvenido de nuevo, guerrero.</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div>
            <label class="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-[0.2em]">Email</label>
            <input type="email" formControlName="email" class="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-primary transition-all">
          </div>

          <div>
            <label class="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-[0.2em]">Contraseña</label>
            <input type="password" formControlName="password" class="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-primary transition-all">
          </div>

          <button type="submit" [disabled]="loading()" class="w-full bg-primary hover:bg-primary/90 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-primary/20 uppercase tracking-widest active:scale-95">
            {{ loading() ? 'INICIANDO...' : 'ENTRAR AL GYM' }}
          </button>
        </form>

        <div class="mt-10 pt-6 border-t border-white/5 text-center">
          <p class="text-xs text-gray-500 mb-4">¿No tienes cuenta todavía?</p>
          <button 
            type="button"
            (click)="goToRegister()" 
            class="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-secondary font-black uppercase tracking-widest text-[10px] transition-all hover:scale-105 active:scale-95"
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
