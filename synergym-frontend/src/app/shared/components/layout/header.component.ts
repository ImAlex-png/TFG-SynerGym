import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="h-16 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-8 sticky top-0 z-40">
      <div class="flex items-center gap-4">
        <h2 class="text-lg font-semibold text-white">Panel de {{ authService.role() | titlecase }}</h2>
      </div>

      <div class="flex items-center gap-4">
        <div class="flex flex-col items-end">
          <span class="text-sm font-medium text-white">{{ authService.user()?.nombre }}</span>
          <span class="text-xs text-slate-400">{{ authService.user()?.email }}</span>
        </div>
        <div class="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold">
          {{ authService.user()?.nombre?.charAt(0) }}
        </div>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  authService = inject(AuthService);
}
