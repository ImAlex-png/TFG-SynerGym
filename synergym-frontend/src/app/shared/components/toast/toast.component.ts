import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <div
        *ngFor="let toast of toastService.toasts()"
        [ngClass]="{
          'bg-green-600': toast.type === 'success',
          'bg-red-600': toast.type === 'error',
          'bg-blue-600': toast.type === 'info',
          'bg-yellow-600': toast.type === 'warning'
        }"
        class="flex items-center justify-between min-w-[300px] px-4 py-3 rounded-lg shadow-xl text-white transition-all transform hover:scale-105"
      >
        <div class="flex items-center gap-2">
          <span class="text-sm font-medium">{{ toast.message }}</span>
        </div>
        <button
          (click)="toastService.remove(toast.id)"
          class="ml-4 text-white hover:text-slate-200 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  `,
})
export class ToastComponent {
  toastService = inject(ToastService);
}
