import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Toast, ToastService } from '../../../../services/toast.service';
import { fadeIn, slideIn } from '../../../animations';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="fixed bottom-4 right-4 z-50 space-y-2">
      <div *ngFor="let toast of toasts" 
           @fadeIn @slideIn
           class="p-4 rounded-lg shadow-lg text-white"
           [class.bg-success]="toast.type === 'success'"
           [class.bg-error]="toast.type === 'error'"
           [class.bg-warning]="toast.type === 'warning'">
        {{ toast.message | translate:toast.params }}
      </div>
    </div>
  `,
  animations: [fadeIn, slideIn]
})
export class ToastComponent implements OnInit {
  toasts: Toast[] = [];

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.toastService.getToasts().subscribe(toasts => {
      this.toasts = toasts;
    });
  }
}