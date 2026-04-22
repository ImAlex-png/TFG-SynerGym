import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './sidebar.component';
import { HeaderComponent } from './header.component';
import { ToastComponent } from '../toast/toast.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, HeaderComponent, ToastComponent],
  template: `
    <div class="min-h-screen bg-slate-950 flex">
      <app-sidebar></app-sidebar>
      <div class="flex-1 ml-64">
        <app-header></app-header>
        <main class="p-8">
          <router-outlet></router-outlet>
        </main>
      </div>
      <app-toast></app-toast>
    </div>
  `,
})
export class LayoutComponent {}
