import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { UiService } from '../../../core/services/ui.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, HeaderComponent],
  template: `
    <div class="flex h-screen bg-bg-dark overflow-hidden relative">
      <!-- Overlay para móvil -->
      @if (uiService.isSidebarOpen()) {
        <div (click)="uiService.closeSidebar()" class="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30 transition-opacity animate-fade-in"></div>
      }

      <!-- Sidebar -->
      <app-sidebar 
        class="fixed lg:static inset-y-0 left-0 w-64 flex-shrink-0 z-40 transition-transform duration-300 bg-bg-card"
        [ngClass]="{
          'translate-x-0': uiService.isSidebarOpen(),
          '-translate-x-full lg:translate-x-0': !uiService.isSidebarOpen()
        }"
      ></app-sidebar>
      
      <!-- Contenido Principal -->
      <div class="flex-1 flex flex-col min-w-0 relative">
        <app-header class="z-10"></app-header>
        <main class="flex-1 overflow-x-hidden overflow-y-auto bg-bg-dark p-4 md:p-8 custom-scrollbar">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.3s ease-out; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `]
})
export class LayoutComponent {
  uiService = inject(UiService);
}
