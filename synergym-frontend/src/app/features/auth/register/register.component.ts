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

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label class="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-[0.2em]">Teléfono</label>
              <input type="text" formControlName="telefono" class="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3 sm:px-5 sm:py-4 text-white focus:outline-none focus:border-primary transition-all text-sm sm:text-base">
            </div>
            <div>
              <label class="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-[0.2em]">DNI</label>
              <input type="text" formControlName="dni" class="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3 sm:px-5 sm:py-4 text-white focus:outline-none focus:border-primary transition-all text-sm sm:text-base">
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div class="relative">
              <label class="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-[0.2em]">Contraseña</label>
              <div class="relative">
                <input [type]="showPassword() ? 'text' : 'password'" formControlName="password" class="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3 sm:px-5 sm:py-4 text-white focus:outline-none focus:border-primary transition-all text-sm sm:text-base pr-12">
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
            <div class="relative">
              <label class="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-[0.2em]">Confirmar Contraseña</label>
              <div class="relative">
                <input [type]="showConfirmPassword() ? 'text' : 'password'" formControlName="confirmPassword" class="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3 sm:px-5 sm:py-4 text-white focus:outline-none focus:border-primary transition-all text-sm sm:text-base pr-12">
                <button type="button" (click)="showConfirmPassword.set(!showConfirmPassword())" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary transition-colors">
                  @if (showConfirmPassword()) {
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
    telefono: ['', [Validators.required, Validators.pattern('^[679][0-9]{8}$')]],
    dni: ['', [Validators.required, Validators.pattern('^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$')]],
    password: ['', [Validators.required, Validators.minLength(4)]],
    confirmPassword: ['', Validators.required]
  }, {
    validators: (group) => {
      const pass = group.get('password')?.value;
      const confirmPass = group.get('confirmPassword')?.value;
      return pass === confirmPass ? null : { notSame: true };
    }
  });

  loading = signal(false);
  error = signal<string | null>(null);
  showPassword = signal(false);
  showConfirmPassword = signal(false);

  constructor() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    this.authService.currentUser.set(null);
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      if (this.registerForm.get('dni')?.errors?.['pattern']) {
        this.error.set('El DNI debe tener 8 números y una letra (ej: 12345678A)');
      } else if (this.registerForm.get('telefono')?.errors?.['pattern']) {
        this.error.set('El teléfono debe tener 9 dígitos y empezar por 6, 7 o 9');
      } else if (this.registerForm.get('email')?.errors?.['email']) {
        this.error.set('El formato del email no es válido');
      } else if (this.registerForm.get('password')?.errors?.['minlength']) {
        this.error.set('La contraseña debe tener al menos 4 caracteres');
      } else if (this.registerForm.errors?.['notSame']) {
        this.error.set('Las contraseñas no coinciden');
      } else {
        this.error.set('Por favor, completa todos los campos correctamente.');
      }
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const formVal = this.registerForm.value;
    const registerData = {
      username: formVal.email,
      email: formVal.email,
      password1: formVal.password,
      password2: formVal.confirmPassword,
      nombre: formVal.nombre,
      apellidos: formVal.apellidos,
      telefono: formVal.telefono,
      dni: formVal.dni,
      rol: 'ALUMNO'
    };

    // REGISTRO
    this.authService.register(registerData).subscribe({
      next: () => this.doAutoLogin(formVal.email!, formVal.password!),
      error: (err) => {
        if (err.status === 403 || err.status === 401) {
          this.doAutoLogin(formVal.email!, formVal.password!);
        } else {
          // Manejar tanto string plano como objeto con message
          const msg = typeof err.error === 'string' ? err.error : (err.error?.message || 'Error al crear la cuenta.');
          this.error.set(msg);
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
        this.router.navigate(['/login'], { queryParams: { registered: 'true' } });
      }
    });
  }
}
