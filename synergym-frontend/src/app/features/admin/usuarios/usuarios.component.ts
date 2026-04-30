import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../../core/services/usuario.service';
import { Usuario, Rol } from '../../../core/models/usuario.model';

@Component({
  selector: 'app-admin-usuarios',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-black italic tracking-tighter text-white uppercase">Gestión de Usuarios</h1>
        <button class="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-bold transition-all">
          + NUEVO USUARIO
        </button>
      </div>

      <div class="bg-bg-card rounded-2xl border border-white/10 overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-white/5 border-b border-white/10">
              <th class="p-4 text-xs font-black uppercase text-gray-400">Nombre</th>
              <th class="p-4 text-xs font-black uppercase text-gray-400">Email</th>
              <th class="p-4 text-xs font-black uppercase text-gray-400">Rol</th>
              <th class="p-4 text-xs font-black uppercase text-gray-400">Estado</th>
              <th class="p-4 text-xs font-black uppercase text-gray-400 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            @for (user of users(); track user.id) {
              <tr class="border-b border-white/5 hover:bg-white/2 transition-colors">
                <td class="p-4">
                  <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">
                      {{ user.nombre.charAt(0) }}
                    </div>
                    <span class="font-bold">{{ user.nombre }} {{ user.apellidos }}</span>
                  </div>
                </td>
                <td class="p-4 text-gray-400 text-sm">{{ user.email }}</td>
                <td class="p-4">
                  <span 
                    [class.bg-purple-500/10]="user.rol === 'ADMINISTRADOR'"
                    [class.text-purple-500]="user.rol === 'ADMINISTRADOR'"
                    [class.bg-red-500/10]="user.rol === 'ENTRENADOR'"
                    [class.text-red-500]="user.rol === 'ENTRENADOR'"
                    [class.bg-blue-500/10]="user.rol === 'ALUMNO'"
                    [class.text-blue-500]="user.rol === 'ALUMNO'"
                    class="px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest"
                  >
                    {{ user.rol }}
                  </span>
                </td>
                <td class="p-4">
                  @if (user.activo) {
                    <span class="w-2 h-2 rounded-full bg-green-500 inline-block mr-2"></span>
                    <span class="text-xs text-green-500 font-bold">ACTIVO</span>
                  } @else {
                    <span class="w-2 h-2 rounded-full bg-gray-500 inline-block mr-2"></span>
                    <span class="text-xs text-gray-500 font-bold">INACTIVO</span>
                  }
                </td>
                <td class="p-4 text-right space-x-2">
                  <button class="text-gray-400 hover:text-white transition-colors">✏️</button>
                  <button (click)="deleteUser(user.id)" class="text-gray-400 hover:text-red-500 transition-colors">🗑️</button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class AdminUsuariosComponent {
  usuarioService = inject(UsuarioService);
  users = signal<Usuario[]>([]);

  constructor() {
    this.loadUsers();
  }

  loadUsers() {
    this.usuarioService.getAll().subscribe(data => {
      this.users.set(data);
    });
  }

  deleteUser(id: number) {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      this.usuarioService.delete(id).subscribe(() => {
        this.loadUsers();
      });
    }
  }
}
