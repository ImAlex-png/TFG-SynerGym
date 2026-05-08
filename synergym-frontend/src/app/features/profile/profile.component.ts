import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { UsuarioService } from '../../core/services/usuario.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12 p-4 md:p-0">
      
      <!-- Profile Header Card (Responsive) -->
      <div class="bg-bg-card border border-white/5 rounded-3xl p-6 md:p-10 relative overflow-hidden group shadow-2xl">
        <div class="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -mr-32 -mt-32 transition-all group-hover:bg-primary/20"></div>
        
        <div class="relative flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-10">
          <!-- Avatar -->
          <div class="w-28 h-28 md:w-40 md:h-40 rounded-[2rem] bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-5xl md:text-6xl font-black text-white shadow-2xl shadow-primary/30 border-4 border-white/10 shrink-0 transform hover:rotate-3 transition-transform">
            {{ user()?.nombre?.charAt(0) }}
          </div>
          
          <div class="flex-1 text-center md:text-left space-y-4">
            <div class="space-y-2">
              <div class="flex flex-col md:flex-row md:items-center gap-3 justify-center md:justify-start">
                <h1 class="text-3xl md:text-5xl font-black text-white tracking-tighter italic uppercase leading-tight">
                  {{ user()?.nombre }} <span class="text-primary">{{ user()?.apellidos }}</span>
                </h1>
              </div>
              <div class="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
                <span class="px-4 py-1 rounded-full bg-white/5 text-gray-400 text-[10px] font-black uppercase tracking-widest border border-white/10">
                  {{ user()?.rol }}
                </span>
                <span class="px-4 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] font-black uppercase tracking-widest border border-green-500/20 flex items-center">
                  <span class="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                  Cuenta Activa
                </span>
              </div>
            </div>
            
            <p class="text-gray-400 font-medium text-lg">{{ user()?.email }}</p>
            
            <div class="pt-4">
              <button (click)="toggleEdit()" 
                      [class]="isEditing() ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-primary text-white border-primary/20'"
                      class="w-full md:w-auto px-8 py-4 rounded-2xl font-black uppercase tracking-widest transition-all border shadow-xl active:scale-95 flex items-center justify-center space-x-3">
                <span>{{ isEditing() ? 'CANCELAR EDICIÓN' : 'EDITAR PERFIL' }}</span>
                <span class="text-xl">{{ isEditing() ? '✕' : '✍️' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Content Area -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <!-- Sidebar Info -->
        <div class="md:col-span-1 space-y-6 order-2 md:order-1">
          <div class="bg-bg-card border border-white/5 rounded-3xl p-8 space-y-6 shadow-xl">
             <h3 class="text-[10px] font-black text-primary uppercase tracking-[0.3em] border-b border-white/5 pb-4">Detalles Técnicos</h3>
             
             <div class="space-y-4">
                <div class="group">
                  <p class="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1 group-hover:text-gray-400 transition-colors">DNI / NIE</p>
                  <p class="text-white font-mono font-bold tracking-widest">{{ user()?.dni || 'No asignado' }}</p>
                </div>
                
                <div class="group">
                  <p class="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1 group-hover:text-gray-400 transition-colors">Teléfono</p>
                  <p class="text-white font-bold">{{ user()?.telefono || 'No asignado' }}</p>
                </div>

                <div class="group">
                  <p class="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1 group-hover:text-gray-400 transition-colors">ID Sistema</p>
                  <p class="text-white font-mono text-sm opacity-50">#SYNER-{{ user()?.id }}</p>
                </div>
             </div>
          </div>
        </div>

        <!-- Main Form / Info -->
        <div class="md:col-span-2 order-1 md:order-2">
          <div class="bg-bg-card border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <div class="relative z-10">
               @if (!isEditing()) {
                <div class="space-y-10 animate-fade-in">
                  <h3 class="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-8">Información Personal</h3>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
                    <div class="space-y-1">
                      <label class="block text-[9px] font-black text-gray-500 uppercase tracking-widest">Nombre</label>
                      <p class="text-2xl text-white font-black italic uppercase tracking-tighter">{{ user()?.nombre }}</p>
                    </div>
                    <div class="space-y-1">
                      <label class="block text-[9px] font-black text-gray-500 uppercase tracking-widest">Apellidos</label>
                      <p class="text-2xl text-white font-black italic uppercase tracking-tighter">{{ user()?.apellidos }}</p>
                    </div>
                    <div class="space-y-1 sm:col-span-2">
                      <label class="block text-[9px] font-black text-gray-500 uppercase tracking-widest">Correo Electrónico</label>
                      <p class="text-2xl text-white font-black italic uppercase tracking-tighter truncate">{{ user()?.email }}</p>
                    </div>
                  </div>
                </div>
              } @else {
                <form [formGroup]="profileForm" (ngSubmit)="save()" class="space-y-8 animate-slide-up">
                  <h3 class="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-8">Modificar Datos</h3>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div class="space-y-2">
                      <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Nombre</label>
                      <input formControlName="nombre" type="text" class="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-primary outline-none transition-all shadow-inner">
                    </div>
                    <div class="space-y-2">
                      <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Apellidos</label>
                      <input formControlName="apellidos" type="text" class="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-primary outline-none transition-all shadow-inner">
                    </div>
                    <div class="space-y-2">
                      <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">DNI</label>
                      <input formControlName="dni" type="text" class="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white font-mono focus:border-primary outline-none transition-all shadow-inner">
                    </div>
                    <div class="space-y-2">
                      <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Teléfono</label>
                      <input formControlName="telefono" type="text" class="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-primary outline-none transition-all shadow-inner">
                    </div>
                  </div>

                  <div class="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-end gap-4">
                    <button type="button" (click)="toggleEdit()" class="px-8 py-4 text-gray-400 font-bold hover:text-white transition-colors uppercase tracking-widest text-xs">Cancelar</button>
                    <button type="submit" [disabled]="profileForm.invalid || isSaving()" class="px-10 py-4 bg-gradient-to-r from-primary to-secondary text-white font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-primary/20 disabled:opacity-50 active:scale-95 text-xs">
                      {{ isSaving() ? 'GUARDANDO...' : 'GUARDAR CAMBIOS' }}
                    </button>
                  </div>
                </form>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
    .animate-slide-up { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class ProfileComponent {
  private authService = inject(AuthService);
  private usuarioService = inject(UsuarioService);
  private fb = inject(FormBuilder);

  user = this.authService.currentUser;
  isEditing = signal(false);
  isSaving = signal(false);
  profileForm: FormGroup;

  constructor() {
    this.profileForm = this.fb.group({
      nombre: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      dni: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      email: [{ value: '', disabled: true }],
      rol: [{ value: '', disabled: true }]
    });
  }

  toggleEdit() {
    if (!this.isEditing()) {
      const current = this.user();
      if (current) {
        this.profileForm.patchValue(current);
      }
    }
    this.isEditing.set(!this.isEditing());
  }

  save() {
    if (this.profileForm.invalid) return;
    
    const current = this.user();
    if (!current) return;

    this.isSaving.set(true);
    const updatedData = { ...current, ...this.profileForm.getRawValue() };

    this.usuarioService.update(current.id, updatedData).subscribe({
      next: (updatedUser) => {
        localStorage.setItem('user', JSON.stringify(updatedUser));
        this.authService.currentUser.set(updatedUser);
        this.isEditing.set(false);
        this.isSaving.set(false);
      },
      error: (err) => {
        console.error('Error actualizando perfil', err);
        this.isSaving.set(false);
      }
    });
  }
}
