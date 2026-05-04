import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { MessagingService } from '../../../core/services/messaging.service';
import { Rol } from '../../../core/models/usuario.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="w-64 bg-bg-card border-r border-white/5 flex flex-col h-full shadow-2xl">
      <div class="p-8">
        <h1 class="text-2xl font-black italic text-primary tracking-tighter uppercase">SynerGym</h1>
        <p class="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Power your limits</p>
      </div>

      <nav class="flex-1 px-4 space-y-2 mt-4">
        <a routerLink="/dashboard" routerLinkActive="bg-primary/20 text-primary border-r-4 border-primary" class="flex items-center space-x-3 p-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-all">
          <span>📊 Dashboard</span>
        </a>

        <!-- Admin Only -->
        @if (authService.hasRole(Rol.ADMINISTRADOR)) {
          <div class="pt-4 pb-2 text-xs font-semibold text-gray-500 uppercase px-3">Gestión Admin</div>
          <a routerLink="/admin/usuarios" routerLinkActive="bg-primary/20 text-primary border-r-4 border-primary" class="flex items-center space-x-3 p-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-all">
            <span>👥 Usuarios</span>
          </a>
          <a routerLink="/admin/clases" routerLinkActive="bg-primary/20 text-primary border-r-4 border-primary" class="flex items-center space-x-3 p-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-all">
            <span>🏋️ Clases</span>
          </a>
        }

        <!-- Entrenador Only -->
        @if (authService.hasRole(Rol.ENTRENADOR)) {
          <div class="pt-4 pb-2 text-xs font-semibold text-gray-500 uppercase px-3">Entrenador</div>
          <a routerLink="/entrenador/mis-clases" routerLinkActive="bg-primary/20 text-primary border-r-4 border-primary" class="flex items-center space-x-3 p-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-all">
            <span>📅 Mis Clases</span>
          </a>
        }

        <!-- Alumno Only -->
        @if (authService.hasRole(Rol.ALUMNO)) {
          <div class="pt-4 pb-2 text-xs font-semibold text-gray-500 uppercase px-3">Alumno</div>
          <a routerLink="/alumno/clases" routerLinkActive="bg-primary/20 text-primary border-r-4 border-primary" class="flex items-center space-x-3 p-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-all">
            <span>🏋️ Ver Clases</span>
          </a>
          <a routerLink="/alumno/mis-inscripciones" routerLinkActive="bg-primary/20 text-primary border-r-4 border-primary" class="flex items-center space-x-3 p-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-all">
            <span>📝 Mis Inscripciones</span>
          </a>
        }

        <div class="pt-4 pb-2 text-xs font-semibold text-gray-500 uppercase px-3">Comunidad</div>
        <a routerLink="/chat" routerLinkActive="bg-primary/20 text-primary border-r-4 border-primary" class="flex items-center justify-between p-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-all group">
          <div class="flex items-center space-x-3">
            <span>💬 Mensajería</span>
          </div>
          @if (hasNotifications()) {
            <span class="flex h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(255,77,77,0.5)]"></span>
          }
        </a>
      </nav>

      <div class="p-4 mt-auto border-t border-white/5 bg-black/20">
        <div routerLink="/perfil" class="flex items-center space-x-3 mb-4 p-2 rounded-xl hover:bg-white/5 transition-all cursor-pointer group">
          <div class="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold group-hover:scale-110 transition-transform">
            {{ currentUser()?.nombre?.charAt(0) }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-bold text-white truncate group-hover:text-primary transition-colors">{{ currentUser()?.nombre }}</p>
            <p class="text-[10px] text-gray-500 truncate uppercase tracking-widest">{{ currentUser()?.rol }}</p>
          </div>
        </div>
        <button (click)="logout()" class="w-full flex items-center space-x-3 p-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all font-bold text-sm">
          <span>🚪 Cerrar Sesión</span>
        </button>
      </div>
    </div>
  `
})
export class SidebarComponent {
  public authService = inject(AuthService);
  private messagingService = inject(MessagingService);
  Rol = Rol;
  
  currentUser = this.authService.currentUser;
  hasNotifications = this.messagingService.hasUnreadMessages;

  logout() {
    this.authService.logout();
  }
}
