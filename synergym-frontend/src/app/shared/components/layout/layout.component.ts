import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, HeaderComponent],
  template: `
    <div class="flex h-screen bg-bg-dark overflow-hidden">
      <!-- Sidebar fijo -->
      <app-sidebar class="w-64 flex-shrink-0 z-20"></app-sidebar>
      
      <!-- Contenido Principal -->
      <div class="flex-1 flex flex-col min-w-0 relative">
        <app-header class="z-10"></app-header>
        <main class="flex-1 overflow-x-hidden overflow-y-auto bg-bg-dark p-4 md:p-8 custom-scrollbar">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class LayoutComponent {}
