import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  isSidebarOpen = signal(false);

  toggleSidebar() {
    console.log('Toggling sidebar', !this.isSidebarOpen());
    this.isSidebarOpen.set(!this.isSidebarOpen());
  }

  closeSidebar() {
    console.log('Closing sidebar');
    this.isSidebarOpen.set(false);
  }
}
