import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [ngClass]="{'overlay': overlay}" class="flex items-center justify-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <span *ngIf="message" class="ml-3">{{message}}</span>
    </div>
  `,
  styles: [`
    .overlay {
      @apply fixed inset-0 bg-black/20 backdrop-blur-sm z-50;
    }
  `]
})
export class LoadingComponent {
  @Input() message?: string;
  @Input() overlay = false;
}