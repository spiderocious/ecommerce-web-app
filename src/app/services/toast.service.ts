import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Toast {
  id: string;
  message: string;
  params?: Record<string, any>;
  type: 'success' | 'error' | 'warning';
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts = new BehaviorSubject<Toast[]>([]);

  getToasts(): Observable<Toast[]> {
    return this.toasts.asObservable();
  }

  show(message: string, type: Toast['type'] = 'success', params?: Record<string, any>) {
    const id = crypto.randomUUID();
    const toast: Toast = { id, message, type, params };
    this.toasts.next([...this.toasts.value, toast]);
    setTimeout(() => this.remove(id), 3000);
  }

  private remove(id: string) {
    this.toasts.next(this.toasts.value.filter(t => t.id !== id));
  }
}