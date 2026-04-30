import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="h-16 bg-bg-card border-b border-white/10 flex items-center justify-between px-8 z-10">
      <div class="flex items-center space-x-4">
        <h2 class="text-lg font-bold text-white">Panel de Control</h2>
      </div>

      <div class="flex items-center space-x-4">
        <div class="text-right mr-4">
          <p class="text-sm font-bold text-white">{{ authService.currentUser()?.nombre }}</p>
          <p class="text-xs text-primary font-semibold uppercase tracking-widest">{{ authService.currentUser()?.rol }}</p>
        </div>
        <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold border-2 border-primary/50">
          {{ authService.currentUser()?.nombre?.charAt(0) }}
        </div>
      </div>
    </header>
  `
})
export class HeaderComponent {
  authService = inject(AuthService);
}
