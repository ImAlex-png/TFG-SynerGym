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
    <div class="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12 p-4 md:p-0">
      
      <!-- Responsive Header -->
      <div class="flex flex-col sm:flex-row items-center gap-6 bg-bg-card p-6 md:p-10 rounded-[2.5rem] border border-white/5 shadow-xl">
        <button routerLink="/admin/usuarios" class="w-14 h-14 rounded-2xl bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-all border border-white/10 shrink-0 group">
          <span class="text-2xl group-hover:-translate-x-1 transition-transform">←</span>
        </button>
        <div class="text-center sm:text-left">
          <h1 class="text-3xl md:text-5xl font-black italic tracking-tighter text-white uppercase leading-none">
            {{ isEdit() ? 'EDITAR' : 'NUEVO' }} <span class="text-primary">{{ isEdit() ? 'MIEMBRO' : 'ATLETA' }}</span>
          </h1>
          <p class="text-gray-500 mt-2 font-medium text-sm">{{ isEdit() ? 'Actualiza el perfil del usuario en el sistema' : 'Registra un nuevo miembro en la comunidad SynerGym' }}</p>
        </div>
      </div>

      <form [formGroup]="userForm" (ngSubmit)="onSubmit()" class="bg-bg-card rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden backdrop-blur-xl relative">
        <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary opacity-50"></div>
        
        <div class="p-8 md:p-12 space-y-10">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-2">
              <label class="block text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2">Nombre</label>
              <input type="text" formControlName="nombre" class="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary transition-all shadow-inner placeholder:text-gray-700" placeholder="Ej: Roberto">
            </div>
            <div class="space-y-2">
              <label class="block text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2">Apellidos</label>
              <input type="text" formControlName="apellidos" class="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary transition-all shadow-inner placeholder:text-gray-700" placeholder="Ej: Casanova">
            </div>
            
            <div class="md:col-span-2 space-y-2">
              <label class="block text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2">Correo Electrónico Corporativo</label>
              <input type="email" formControlName="email" class="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary transition-all shadow-inner disabled:opacity-30 placeholder:text-gray-700" placeholder="atleta@synergym.com">
            </div>

            <div class="space-y-2">
              <label class="block text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2">DNI / NIE</label>
              <input type="text" formControlName="dni" class="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white font-mono focus:outline-none focus:border-primary transition-all shadow-inner placeholder:text-gray-700" placeholder="00000000X">
            </div>
            <div class="space-y-2">
              <label class="block text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2">Teléfono de Contacto</label>
              <input type="text" formControlName="telefono" class="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary transition-all shadow-inner placeholder:text-gray-700" placeholder="6XX XXX XXX">
            </div>

            <div class="space-y-2">
              <label class="block text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2">Rol dentro del Box</label>
              <div class="relative">
                <select formControlName="rol" class="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary transition-all shadow-inner appearance-none cursor-pointer">
                  <option [value]="Rol.ALUMNO">Alumno / Atleta</option>
                  <option [value]="Rol.ENTRENADOR">Entrenador / Coach</option>
                  <option [value]="Rol.ADMINISTRADOR">Administrador</option>
                </select>
                <div class="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-primary">▼</div>
              </div>
            </div>

            @if (!isEdit()) {
              <div class="space-y-2 animate-slide-up">
                <label class="block text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2">Contraseña Temporal</label>
                <input type="password" formControlName="password" class="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary transition-all shadow-inner" placeholder="••••••••">
              </div>
            } @else {
               <div class="flex items-end">
                  <div class="p-4 bg-white/5 border border-white/10 rounded-2xl w-full flex items-center justify-between">
                    <div>
                      <p class="text-[10px] font-black text-primary uppercase tracking-widest leading-none mb-1">Estado de Acceso</p>
                      <span class="text-sm text-white font-bold">{{ userForm.get('activo')?.value ? 'Cuenta Autorizada' : 'Acceso Revocado' }}</span>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" formControlName="activo" class="sr-only peer">
                      <div class="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
               </div>
            }
          </div>
        </div>

        <div class="bg-black/40 p-8 md:p-12 flex flex-col sm:flex-row justify-end gap-6 border-t border-white/5">
          <button type="button" routerLink="/admin/usuarios" class="px-10 py-4 rounded-2xl font-black text-gray-500 hover:text-white hover:bg-white/5 transition-all uppercase tracking-widest text-xs">
            DESCARTAR
          </button>
          <button type="submit" [disabled]="userForm.invalid || loading()" class="bg-primary hover:bg-primary/90 text-white px-14 py-5 rounded-2xl font-black uppercase tracking-[0.2em] transition-all shadow-2xl shadow-primary/30 active:scale-95 disabled:opacity-50 text-xs">
            {{ loading() ? 'PROCESANDO...' : (isEdit() ? 'ACTUALIZAR DATOS' : 'CREAR USUARIO') }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
    .animate-slide-up { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
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
      dni: ['', [Validators.required]],
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
      this.userForm.get('email')?.disable();
    } else {
      this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(4)]);
    }
  }

  loadUser(id: number) {
    this.usuarioService.getById(id).subscribe({
      next: (user) => {
        this.userForm.patchValue(user);
      },
      error: () => {
        this.router.navigate(['/admin/usuarios']);
      }
    });
  }

  onSubmit() {
    if (this.userForm.invalid) return;

    this.loading.set(true);
    const formValue = this.userForm.getRawValue();
    
    const obs = this.isEdit() 
      ? this.usuarioService.update(this.userId!, formValue)
      : this.usuarioService.create(formValue);

    obs.subscribe({
      next: () => this.router.navigate(['/admin/usuarios']),
      error: () => {
        this.loading.set(false);
      }
    });
  }
}
