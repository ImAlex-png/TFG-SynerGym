import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { UsuarioService } from '../../core/services/usuario.service';
import { Usuario } from '../../core/models/usuario.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      <!-- Profile Header Card -->
      <div class="bg-bg-card border border-white/5 rounded-2xl p-8 relative overflow-hidden group">
        <div class="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -mr-32 -mt-32 transition-all group-hover:bg-primary/20"></div>
        
        <div class="relative flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
          <div class="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-4xl font-black text-white shadow-2xl shadow-primary/20 border-4 border-white/10">
            {{ user()?.nombre?.charAt(0) }}
          </div>
          
          <div class="flex-1 text-center md:text-left">
            <div class="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
              <h1 class="text-3xl font-black text-white tracking-tight">{{ user()?.nombre }} {{ user()?.apellidos }}</h1>
              <span class="inline-flex px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider self-center md:self-auto">
                {{ user()?.rol }}
              </span>
            </div>
            <p class="text-gray-400 mt-2 font-medium">{{ user()?.email }}</p>
            
            <div class="flex flex-wrap justify-center md:justify-start gap-4 mt-6">
              <button (click)="toggleEdit()" class="px-6 py-2 bg-primary hover:bg-primary/80 text-white rounded-xl font-bold transition-all shadow-lg shadow-primary/20 active:scale-95">
                {{ isEditing() ? '❌ Cancelar' : '✍️ Editar Perfil' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Content Area -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <!-- Stats/Quick Info (Side) -->
        <div class="md:col-span-1 space-y-6">
          <div class="bg-bg-card border border-white/5 rounded-2xl p-6">
            <h3 class="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">Estado de Cuenta</h3>
            <div class="flex items-center space-x-3 p-3 rounded-xl bg-white/5 border border-white/5">
              <span class="w-3 h-3 rounded-full" [ngClass]="user()?.activo ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500'"></span>
              <span class="text-white font-bold">{{ user()?.activo ? 'Verificada y Activa' : 'Inactiva' }}</span>
            </div>
          </div>
          
          <div class="bg-bg-card border border-white/5 rounded-2xl p-6">
            <h3 class="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">Identificación</h3>
            <div class="space-y-4">
              <div class="p-3 rounded-xl bg-white/5 border border-white/5">
                <p class="text-[10px] text-primary font-bold uppercase mb-1">DNI / NIE</p>
                <p class="text-white font-mono">{{ user()?.dni || 'No asignado' }}</p>
              </div>
              <div class="p-3 rounded-xl bg-white/5 border border-white/5">
                <p class="text-[10px] text-primary font-bold uppercase mb-1">Teléfono</p>
                <p class="text-white">{{ user()?.telefono || 'No asignado' }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Info / Edit Form -->
        <div class="md:col-span-2">
          <div class="bg-bg-card border border-white/5 rounded-[32px] p-8 shadow-xl">
            
            @if (!isEditing()) {
              <div class="space-y-8 animate-fade-in">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label class="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Nombre</label>
                    <p class="text-xl text-white font-bold">{{ user()?.nombre }}</p>
                  </div>
                  <div>
                    <label class="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Apellidos</label>
                    <p class="text-xl text-white font-bold">{{ user()?.apellidos }}</p>
                  </div>
                  <div>
                    <label class="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Email</label>
                    <p class="text-xl text-white font-bold">{{ user()?.email }}</p>
                  </div>
                  <div>
                    <label class="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Rol</label>
                    <p class="text-xl text-primary font-black italic">{{ user()?.rol }}</p>
                  </div>
                </div>
              </div>
            } @else {
              <form [formGroup]="profileForm" (ngSubmit)="save()" class="space-y-6 animate-slide-up">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-2">
                    <label class="block text-xs font-black text-gray-400 uppercase tracking-widest">Nombre</label>
                    <input formControlName="nombre" type="text" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none transition-all">
                  </div>
                  <div class="space-y-2">
                    <label class="block text-xs font-black text-gray-400 uppercase tracking-widest">Apellidos</label>
                    <input formControlName="apellidos" type="text" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none transition-all">
                  </div>
                  <div class="space-y-2">
                    <label class="block text-xs font-black text-gray-400 uppercase tracking-widest">DNI</label>
                    <input formControlName="dni" type="text" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none transition-all">
                  </div>
                  <div class="space-y-2">
                    <label class="block text-xs font-black text-gray-400 uppercase tracking-widest">Teléfono</label>
                    <input formControlName="telefono" type="text" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none transition-all">
                  </div>
                </div>

                <div class="pt-6 border-t border-white/5 flex justify-end space-x-4">
                  <button type="button" (click)="toggleEdit()" class="px-6 py-3 text-gray-400 font-bold hover:text-white transition-colors">Cancelar</button>
                  <button type="submit" [disabled]="profileForm.invalid || isSaving()" class="px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-primary/20 disabled:opacity-50">
                    {{ isSaving() ? 'Guardando...' : 'Guardar Cambios' }}
                  </button>
                </div>
              </form>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.4s ease-out; }
    .animate-slide-up { animation: slideUp 0.4s ease-out; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
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
        // Actualizar el estado global
        localStorage.setItem('user', JSON.stringify(updatedUser));
        this.authService.currentUser.set(updatedUser);
        this.isEditing.set(false);
        this.isSaving.set(false);
      },
      error: (err) => {
        console.error('Error actualizando perfil', err);
        this.isSaving.set(false);
        alert('Error al guardar los cambios. Inténtalo de nuevo.');
      }
    });
  }
}
