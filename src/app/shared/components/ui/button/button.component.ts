import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      [class]="baseClass + ' ' + variantClass"
      [disabled]="disabled">
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    :host {
      display: inline-block;
    }
  `]
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'outline' = 'primary';
  @Input() disabled = false;

  get baseClass(): string {
    return 'px-4 py-2 rounded-md font-medium transition-colors';
  }

  get variantClass(): string {
    const variants = {
      primary: 'bg-primary text-white hover:bg-primary/90',
      secondary: 'bg-secondary text-white hover:bg-secondary/90',
      outline: 'border-2 border-primary text-primary hover:bg-primary/10'
    };
    return variants[this.variant];
  }
}