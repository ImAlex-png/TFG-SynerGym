import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-bg-dark relative overflow-hidden px-4 py-8">
      <div class="absolute top-[-10%] left-[-10%] w-[60%] md:w-[40%] h-[40%] bg-primary opacity-20 blur-[80px] md:blur-[120px] rounded-full"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[60%] md:w-[40%] h-[40%] bg-secondary opacity-20 blur-[80px] md:blur-[120px] rounded-full"></div>

      <div class="bg-bg-card p-6 sm:p-10 rounded-[30px] sm:rounded-[40px] border border-white/10 shadow-2xl w-full max-w-lg backdrop-blur-md z-10">
        <div class="text-center mb-8 sm:mb-10">
          <h1 class="text-3xl sm:text-4xl font-black italic tracking-tighter text-white uppercase">
            JOIN <span class="text-primary">SYNERGYM</span>
          </h1>
          <p class="text-sm sm:text-base text-gray-400 mt-2 font-medium">Crea tu cuenta y empieza a entrenar.</p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-4 sm:space-y-5">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label class="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-[0.2em]">Nombre</label>
              <input type="text" formControlName="nombre" class="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3 sm:px-5 sm:py-4 text-white focus:outline-none focus:border-primary transition-all text-sm sm:text-base">
            </div>
            <div>
              <label class="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-[0.2em]">Apellidos</label>
              <input type="text" formControlName="apellidos" class="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3 sm:px-5 sm:py-4 text-white focus:outline-none focus:border-primary transition-all text-sm sm:text-base">
            </div>
          </div>

          <div>
            <label class="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-[0.2em]">Email</label>
            <input type="email" formControlName="email" class="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3 sm:px-5 sm:py-4 text-white focus:outline-none focus:border-primary transition-all text-sm sm:text-base">
          </div>

          <div>
            <label class="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-[0.2em]">Teléfono</label>
            <input type="text" formControlName="telefono" class="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3 sm:px-5 sm:py-4 text-white focus:outline-none focus:border-primary transition-all text-sm sm:text-base">
          </div>

          <div>
            <label class="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-[0.2em]">Contraseña</label>
            <input type="password" formControlName="password" class="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3 sm:px-5 sm:py-4 text-white focus:outline-none focus:border-primary transition-all text-sm sm:text-base">
          </div>

          @if (error()) {
            <div class="bg-red-500/10 border border-red-500/20 text-red-500 p-3 sm:p-4 rounded-2xl text-xs text-center font-bold">
              ⚠️ {{ error() }}
            </div>
          }

          <button type="submit" [disabled]="loading()" class="w-full bg-primary hover:bg-primary/90 text-white font-black py-4 sm:py-5 rounded-2xl transition-all shadow-lg shadow-primary/20 uppercase tracking-[0.1em] active:scale-95 text-sm sm:text-base">
            {{ loading() ? 'PREPARANDO TU PERFIL...' : 'ENTRAR AL GYM AHORA' }}
          </button>
        </form>

        <div class="mt-6 sm:mt-8 text-center text-xs text-gray-500 font-medium">
          ¿Ya eres atleta? <a routerLink="/login" class="text-secondary font-black hover:underline uppercase ml-1 block sm:inline mt-2 sm:mt-0">Inicia sesión</a>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm = this.fb.group({
    nombre: ['', Validators.required],
    apellidos: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telefono: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });

  loading = signal(false);
  error = signal<string | null>(null);

  constructor() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    this.authService.currentUser.set(null);
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.error.set('Por favor, completa todos los campos.');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const formVal = this.registerForm.value;
    const registerData = {
      username: formVal.email,
      email: formVal.email,
      password1: formVal.password,
      password2: formVal.password,
      nombre: formVal.nombre,
      apellidos: formVal.apellidos,
      telefono: formVal.telefono,
      dni: this.generateRandomDNI(),
      rol: 'ALUMNO'
    };

    // REGISTRO
    this.authService.register(registerData).subscribe({
      next: () => this.doAutoLogin(formVal.email!, formVal.password!),
      error: (err) => {
        // Si es 403, es probable que se haya creado el usuario pero fallara el login interno del server
        // Intentamos login manual desde el cliente
        if (err.status === 403 || err.status === 401) {
          this.doAutoLogin(formVal.email!, formVal.password!);
        } else {
          this.error.set(err.error?.message || 'Error al crear la cuenta.');
          this.loading.set(false);
        }
      }
    });
  }

  private doAutoLogin(email: string, pass: string) {
    this.authService.login({ email, password: pass }).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        // Si todo falla, al menos que vaya al login con el aviso
        this.router.navigate(['/login'], { queryParams: { registered: 'true' } });
      }
    });
  }

  private generateRandomDNI(): string {
    const num = Math.floor(10000000 + Math.random() * 90000000);
    const letters = 'TRWAGMYFPDXBNJZSQVHLCKE';
    return `${num}${letters[num % 23]}`;
  }
}
