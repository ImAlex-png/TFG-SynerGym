import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../../core/services/usuario.service';
import { Usuario } from '../../../core/models/usuario.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-usuarios',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-8 animate-fade-in p-4 md:p-0">
      
      <!-- Header Section -->
      <div class="flex flex-col md:flex-row justify-between items-center gap-6 bg-bg-card p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
        <div class="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16"></div>
        <div class="text-center md:text-left z-10">
          <h1 class="text-4xl md:text-6xl font-black italic tracking-tighter text-white uppercase leading-none">GESTIÓN DE <span class="text-primary">USUARIOS</span></h1>
          <p class="text-gray-500 mt-3 font-medium text-sm md:text-base">Administra la comunidad SynerGym desde un solo lugar.</p>
        </div>
        <button routerLink="/admin/usuarios/nuevo" class="w-full md:w-auto bg-primary hover:bg-primary/90 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-primary/20 active:scale-95 z-10 flex items-center justify-center space-x-3">
          <span>Añadir Miembro</span>
          <span class="text-2xl">+</span>
        </button>
      </div>

      <!-- DESKTOP VIEW: Table (Hidden on small screens) -->
      <div class="hidden lg:block bg-bg-card rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl backdrop-blur-xl">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-white/[0.02] border-b border-white/5">
                <th class="p-8 text-[10px] font-black uppercase text-gray-500 tracking-[0.3em]">Atleta / Perfil</th>
                <th class="p-8 text-[10px] font-black uppercase text-gray-500 tracking-[0.3em]">Rol Asignado</th>
                <th class="p-8 text-[10px] font-black uppercase text-gray-500 tracking-[0.3em]">Estado</th>
                <th class="p-8 text-[10px] font-black uppercase text-gray-500 tracking-[0.3em] text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              @for (user of users(); track user.id) {
                <tr class="hover:bg-white/[0.03] transition-all group">
                  <td class="p-8">
                    <div class="flex items-center space-x-6">
                      <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center text-xl font-black border border-white/10 group-hover:border-primary/50 transition-colors shadow-lg">
                        {{ user.nombre.charAt(0) }}
                      </div>
                      <div>
                        <p class="font-black text-white italic uppercase tracking-tight text-lg">{{ user.nombre }} {{ user.apellidos }}</p>
                        <p class="text-sm text-gray-500 font-medium">{{ user.email }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="p-8">
                    <span 
                      [class.bg-purple-500/10]="user.rol === 'ADMINISTRADOR'"
                      [class.text-purple-400]="user.rol === 'ADMINISTRADOR'"
                      [class.bg-red-500/10]="user.rol === 'ENTRENADOR'"
                      [class.text-red-400]="user.rol === 'ENTRENADOR'"
                      [class.bg-blue-500/10]="user.rol === 'ALUMNO'"
                      [class.text-blue-400]="user.rol === 'ALUMNO'"
                      class="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/5 inline-block"
                    >
                      {{ user.rol }}
                    </span>
                  </td>
                  <td class="p-8">
                    <div class="flex items-center space-x-3 bg-white/[0.02] border border-white/5 px-4 py-2 rounded-xl w-max">
                      <span class="w-2 h-2 rounded-full" [class.bg-green-500]="user.activo" [class.bg-gray-500]="!user.activo" [class.animate-pulse]="user.activo"></span>
                      <span class="text-[10px] font-black uppercase tracking-widest" [class.text-green-500]="user.activo" [class.text-gray-500]="!user.activo">
                        {{ user.activo ? 'ACTIVO' : 'INACTIVO' }}
                      </span>
                    </div>
                  </td>
                  <td class="p-8 text-right">
                    <div class="flex justify-end space-x-3 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button (click)="toggleUserStatus(user)" 
                              class="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center transition-all border border-white/5 hover:bg-white/10"
                              [class.text-green-500]="user.activo"
                              [class.text-gray-400]="!user.activo">
                        <span class="text-lg">{{ user.activo ? '🔓' : '🔒' }}</span>
                      </button>
                      <button [routerLink]="['/admin/usuarios/editar', user.id]" 
                              class="w-12 h-12 rounded-2xl bg-white/5 hover:bg-primary/20 text-white flex items-center justify-center transition-all border border-white/5 hover:border-primary/50">
                        <span class="text-lg">✏️</span>
                      </button>
                      <button (click)="confirmDelete(user)" 
                              class="w-12 h-12 rounded-2xl bg-white/5 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition-all border border-white/5 hover:border-red-500/50">
                        <span class="text-lg">🗑️</span>
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- MOBILE VIEW: Cards (Visible on small screens) -->
      <div class="lg:hidden grid grid-cols-1 gap-6">
        @for (user of users(); track user.id) {
          <div class="bg-bg-card rounded-3xl border border-white/5 p-6 space-y-6 shadow-xl relative overflow-hidden group">
            <div class="flex items-center space-x-4">
              <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-transparent flex items-center justify-center text-2xl font-black text-white border border-white/10 shrink-0">
                {{ user.nombre.charAt(0) }}
              </div>
              <div class="overflow-hidden">
                <h3 class="font-black text-white italic uppercase tracking-tight text-xl truncate">{{ user.nombre }} {{ user.apellidos }}</h3>
                <p class="text-xs text-gray-500 font-medium truncate">{{ user.email }}</p>
              </div>
            </div>

            <div class="flex justify-between items-center">
               <span 
                  [class.bg-purple-500/10]="user.rol === 'ADMINISTRADOR'"
                  [class.text-purple-400]="user.rol === 'ADMINISTRADOR'"
                  [class.bg-red-500/10]="user.rol === 'ENTRENADOR'"
                  [class.text-red-400]="user.rol === 'ENTRENADOR'"
                  [class.bg-blue-500/10]="user.rol === 'ALUMNO'"
                  [class.text-blue-400]="user.rol === 'ALUMNO'"
                  class="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border border-white/5"
                >
                  {{ user.rol }}
                </span>
                <div class="flex items-center space-x-2">
                  <span class="w-1.5 h-1.5 rounded-full" [class.bg-green-500]="user.activo" [class.bg-gray-500]="!user.activo"></span>
                  <span class="text-[9px] font-black uppercase tracking-widest text-gray-400">{{ user.activo ? 'ACTIVO' : 'INACTIVO' }}</span>
                </div>
            </div>

            <div class="grid grid-cols-3 gap-3 pt-4 border-t border-white/5">
                <button (click)="toggleUserStatus(user)" class="py-3 rounded-xl bg-white/5 flex items-center justify-center text-sm border border-white/5 active:scale-95">
                  {{ user.activo ? 'Desactivar' : 'Activar' }}
                </button>
                <button [routerLink]="['/admin/usuarios/editar', user.id]" class="py-3 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-sm border border-primary/20 active:scale-95">
                  Editar
                </button>
                <button (click)="confirmDelete(user)" class="py-3 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center text-sm border border-red-500/20 active:scale-95">
                  Borrar
                </button>
            </div>
          </div>
        }
      </div>

      <!-- DELETE MODAL -->
      @if (showDeleteModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in" (click)="showDeleteModal.set(false)">
          <div class="bg-bg-card w-full max-w-sm rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl p-10 space-y-8 text-center transform transition-all" (click)="$event.stopPropagation()">
            <div class="w-24 h-24 bg-red-500/20 text-red-500 rounded-[2rem] flex items-center justify-center text-5xl mx-auto border border-red-500/20 animate-pulse">
              ⚠️
            </div>
            <div>
              <h2 class="text-3xl font-black text-white italic uppercase tracking-tighter">¿Atención!</h2>
              <p class="text-gray-400 mt-3 font-medium">Estás a punto de eliminar permanentemente a <span class="text-white font-black italic">{{ userToDelete()?.nombre }}</span>.</p>
            </div>
            <div class="flex flex-col gap-3">
              <button (click)="deleteUser()" class="w-full py-5 bg-red-500 hover:bg-red-600 text-white font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-red-500/30 active:scale-95">
                SÍ, ELIMINAR
              </button>
              <button (click)="showDeleteModal.set(false)" class="w-full py-4 text-gray-500 font-bold uppercase tracking-widest hover:text-white transition-colors">
                No, mantener
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class AdminUsuariosComponent {
  usuarioService = inject(UsuarioService);
  users = signal<Usuario[]>([]);
  
  showDeleteModal = signal(false);
  userToDelete = signal<Usuario | null>(null);

  constructor() {
    this.loadUsers();
  }

  loadUsers() {
    this.usuarioService.getAll().subscribe(data => {
      this.users.set(data);
    });
  }

  confirmDelete(user: Usuario) {
    this.userToDelete.set(user);
    this.showDeleteModal.set(true);
  }

  toggleUserStatus(user: Usuario) {
    const updatedUser = { ...user, activo: !user.activo };
    this.usuarioService.update(user.id, updatedUser).subscribe({
      next: () => {
        this.loadUsers();
      }
    });
  }

  deleteUser() {
    const user = this.userToDelete();
    if (!user) return;

    this.usuarioService.delete(user.id).subscribe({
      next: () => {
        this.showDeleteModal.set(false);
        this.loadUsers();
      }
    });
  }
}
