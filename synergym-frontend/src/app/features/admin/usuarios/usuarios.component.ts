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
    <div class="space-y-8 animate-fade-in">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 class="text-4xl font-black italic tracking-tighter text-white uppercase leading-none">Gestión de Usuarios</h1>
          <p class="text-gray-500 mt-2 font-medium">Administra los atletas, entrenadores y administradores del sistema.</p>
        </div>
        <button routerLink="/admin/usuarios/nuevo" class="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg shadow-primary/20 active:scale-95">
          + Nuevo Usuario
        </button>
      </div>

      <div class="bg-bg-card rounded-[32px] border border-white/5 overflow-hidden shadow-2xl backdrop-blur-xl">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-white/[0.02] border-b border-white/5">
                <th class="p-6 text-[10px] font-black uppercase text-gray-500 tracking-[0.2em]">Usuario</th>
                <th class="p-6 text-[10px] font-black uppercase text-gray-500 tracking-[0.2em]">Rol</th>
                <th class="p-6 text-[10px] font-black uppercase text-gray-500 tracking-[0.2em]">Estado</th>
                <th class="p-6 text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              @for (user of users(); track user.id) {
                <tr class="hover:bg-white/[0.02] transition-colors group">
                  <td class="p-6">
                    <div class="flex items-center space-x-4">
                      <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center text-lg font-black border border-white/10 group-hover:border-primary/50 transition-colors">
                        {{ user.nombre.charAt(0) }}
                      </div>
                      <div>
                        <p class="font-black text-white italic uppercase tracking-tight">{{ user.nombre }} {{ user.apellidos }}</p>
                        <p class="text-xs text-gray-500">{{ user.email }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="p-6">
                    <span 
                      [class.bg-purple-500/10]="user.rol === 'ADMINISTRADOR'"
                      [class.text-purple-400]="user.rol === 'ADMINISTRADOR'"
                      [class.bg-red-500/10]="user.rol === 'ENTRENADOR'"
                      [class.text-red-400]="user.rol === 'ENTRENADOR'"
                      [class.bg-blue-500/10]="user.rol === 'ALUMNO'"
                      [class.text-blue-400]="user.rol === 'ALUMNO'"
                      class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/5"
                    >
                      {{ user.rol }}
                    </span>
                  </td>
                  <td class="p-6">
                    <div class="flex items-center space-x-2">
                      <span class="w-2 h-2 rounded-full" [class.bg-green-500]="user.activo" [class.bg-gray-500]="!user.activo"></span>
                      <span class="text-[10px] font-black uppercase tracking-widest" [class.text-green-500]="user.activo" [class.text-gray-500]="!user.activo">
                        {{ user.activo ? 'Activo' : 'Inactivo' }}
                      </span>
                    </div>
                  </td>
                  <td class="p-6 text-right">
                    <div class="flex justify-end space-x-2">
                      <button (click)="toggleUserStatus(user)" 
                              [title]="user.activo ? 'Desactivar' : 'Activar'"
                              class="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center transition-all border border-white/5 hover:border-white/20"
                              [class.text-green-500]="user.activo"
                              [class.text-gray-500]="!user.activo">
                        <span class="text-sm">{{ user.activo ? '🔓' : '🔒' }}</span>
                      </button>
                      <button [routerLink]="['/admin/usuarios/editar', user.id]" 
                              title="Editar"
                              class="w-10 h-10 rounded-xl bg-white/5 hover:bg-primary/20 text-white flex items-center justify-center transition-all border border-white/5 hover:border-primary/50">
                        <span class="text-sm">✏️</span>
                      </button>
                      <button (click)="confirmDelete(user)" 
                              title="Eliminar"
                              class="w-10 h-10 rounded-xl bg-white/5 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition-all border border-white/5 hover:border-red-500/50">
                        <span class="text-sm">🗑️</span>
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- DELETE MODAL -->
      @if (showDeleteModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in" (click)="showDeleteModal.set(false)">
          <div class="bg-bg-card w-full max-w-sm rounded-[32px] border border-white/10 overflow-hidden shadow-2xl p-8 space-y-6 text-center transform transition-all" (click)="$event.stopPropagation()">
            <div class="w-20 h-20 bg-red-500/20 text-red-500 rounded-3xl flex items-center justify-center text-4xl mx-auto border border-red-500/20">
              ⚠️
            </div>
            <div>
              <h2 class="text-2xl font-black text-white italic uppercase tracking-tight">¿Estás seguro?</h2>
              <p class="text-gray-400 mt-2">Vas a eliminar a <span class="text-white font-bold">{{ userToDelete()?.nombre }}</span>. Esta acción no se puede deshacer.</p>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <button (click)="showDeleteModal.set(false)" class="py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-all">
                Cancelar
              </button>
              <button (click)="deleteUser()" class="py-4 bg-red-500 hover:bg-red-600 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-red-500/20">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.5s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
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
      },
      error: (err) => {
        alert('Error al cambiar el estado del usuario');
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
      },
      error: (err) => {
        alert(err.error || 'Error al eliminar usuario');
        this.showDeleteModal.set(false);
      }
    });
  }
}
