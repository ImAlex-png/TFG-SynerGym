import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UsuarioService } from '../../../core/services/usuario.service';
import { Rol } from '../../../core/models/usuario.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      <!-- Header -->
      <div class="flex items-center space-x-6">
        <button routerLink="/admin/usuarios" class="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-all border border-white/10">
          ←
        </button>
        <div>
          <h1 class="text-4xl font-black italic tracking-tighter text-white uppercase leading-none">
            {{ isEdit() ? 'Editar Atleta' : 'Nuevo Miembro' }}
          </h1>
          <p class="text-gray-500 mt-1 font-medium">{{ isEdit() ? 'Modificando los datos del usuario' : 'Añade un nuevo usuario al ecosistema SynerGym' }}</p>
        </div>
      </div>

      <form [formGroup]="userForm" (ngSubmit)="onSubmit()" class="bg-bg-card rounded-[32px] border border-white/5 shadow-2xl overflow-hidden backdrop-blur-xl">
        <div class="p-8 md:p-12 space-y-10">
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-2">
              <label class="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Nombre</label>
              <input type="text" formControlName="nombre" class="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary transition-all shadow-inner" placeholder="Ej: Juan">
            </div>
            <div class="space-y-2">
              <label class="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Apellidos</label>
              <input type="text" formControlName="apellidos" class="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary transition-all shadow-inner" placeholder="Ej: Pérez García">
            </div>
            
            <div class="md:col-span-2 space-y-2">
              <label class="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Correo Electrónico</label>
              <input type="email" formControlName="email" class="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary transition-all shadow-inner disabled:opacity-50" placeholder="atleta@synergym.com">
            </div>

            <div class="space-y-2">
              <label class="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">DNI / NIE</label>
              <input type="text" formControlName="dni" class="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white font-mono focus:outline-none focus:border-primary transition-all shadow-inner" placeholder="12345678X">
            </div>
            <div class="space-y-2">
              <label class="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Teléfono</label>
              <input type="text" formControlName="telefono" class="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary transition-all shadow-inner" placeholder="600 000 000">
            </div>

            <div class="space-y-2">
              <label class="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Rol de Acceso</label>
              <select formControlName="rol" class="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary transition-all shadow-inner appearance-none cursor-pointer">
                <option [value]="Rol.ALUMNO">Alumno / Atleta</option>
                <option [value]="Rol.ENTRENADOR">Entrenador / Coach</option>
                <option [value]="Rol.ADMINISTRADOR">Administrador</option>
              </select>
            </div>

            @if (!isEdit()) {
              <div class="space-y-2 animate-slide-up">
                <label class="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Contraseña Inicial</label>
                <input type="password" formControlName="password" class="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary transition-all shadow-inner" placeholder="••••••••">
              </div>
            } @else {
               <div class="flex items-end pb-2">
                  <div class="p-4 bg-primary/10 border border-primary/20 rounded-2xl w-full">
                    <p class="text-[10px] font-black text-primary uppercase tracking-widest leading-none mb-1">Estado</p>
                    <div class="flex items-center space-x-2">
                       <input type="checkbox" formControlName="activo" class="w-5 h-5 rounded-md bg-black/40 border-white/10 text-primary focus:ring-primary cursor-pointer">
                       <span class="text-sm text-white font-bold">{{ userForm.get('activo')?.value ? 'Cuenta Activa' : 'Cuenta Suspendida' }}</span>
                    </div>
                  </div>
               </div>
            }
          </div>
        </div>

        <div class="bg-black/20 p-8 md:p-10 flex flex-col md:flex-row justify-end gap-4 border-t border-white/5">
          <button type="button" routerLink="/admin/usuarios" class="px-8 py-4 rounded-2xl font-black text-gray-400 hover:text-white hover:bg-white/5 transition-all uppercase tracking-widest text-sm">
            Cancelar
          </button>
          <button type="submit" [disabled]="userForm.invalid || loading()" class="bg-primary hover:bg-primary/90 text-white px-12 py-4 rounded-2xl font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-primary/20 active:scale-95 disabled:opacity-50 text-sm">
            {{ loading() ? 'PROCESANDO...' : (isEdit() ? 'GUARDAR ATLETA' : 'CREAR ATLETA') }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.5s ease-out; }
    .animate-slide-up { animation: slideUp 0.4s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
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

  userForm: FormGroup;

  constructor() {
    this.userForm = this.fb.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dni: ['', [Validators.required, Validators.pattern('^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$')]],
      telefono: ['', Validators.required],
      rol: [Rol.ALUMNO, Validators.required],
      password: [''],
      activo: [true]
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEdit.set(true);
      this.userId = +id;
      this.loadUser(this.userId);
      // El email no suele editarse para evitar problemas de identidad en este sistema
      this.userForm.get('email')?.disable();
    } else {
      // Password es obligatorio solo para nuevos
      this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(4)]);
    }
  }

  loadUser(id: number) {
    this.usuarioService.getById(id).subscribe({
      next: (user) => {
        this.userForm.patchValue(user);
      },
      error: () => {
        alert('Error al cargar el usuario');
        this.router.navigate(['/admin/usuarios']);
      }
    });
  }

  onSubmit() {
    if (this.userForm.invalid) return;

    this.loading.set(true);
    const formValue = this.userForm.getRawValue(); // Usamos getRawValue para incluir campos deshabilitados (email)
    
    const obs = this.isEdit() 
      ? this.usuarioService.update(this.userId!, formValue)
      : this.usuarioService.create(formValue);

    obs.subscribe({
      next: () => this.router.navigate(['/admin/usuarios']),
      error: (err) => {
        this.loading.set(false);
        alert(err.error?.message || 'Error al procesar la solicitud');
      }
    });
  }
}
