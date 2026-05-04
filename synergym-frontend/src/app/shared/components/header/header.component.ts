import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="h-16 bg-bg-card border-b border-white/10 flex items-center justify-between px-8 z-10">
      <div class="flex items-center space-x-4">
        <h2 class="text-lg font-bold text-white">Panel de Control</h2>
      </div>

      <div class="flex items-center space-x-4">
        <div routerLink="/perfil" class="flex items-center space-x-4 cursor-pointer hover:bg-white/5 p-2 rounded-xl transition-all group">
          <div class="text-right mr-2">
            <p class="text-sm font-bold text-white group-hover:text-primary transition-colors">{{ authService.currentUser()?.nombre }}</p>
            <p class="text-[10px] text-primary font-semibold uppercase tracking-widest">{{ authService.currentUser()?.rol }}</p>
          </div>
          <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold border-2 border-primary/50 group-hover:scale-110 transition-transform">
            {{ authService.currentUser()?.nombre?.charAt(0) }}
          </div>
        </div>
      </div>
    </header>
  `
})
export class HeaderComponent {
  authService = inject(AuthService);
}
