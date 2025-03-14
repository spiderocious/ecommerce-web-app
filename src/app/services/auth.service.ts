import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'customer';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User>({
    id: '1',
    name: 'Feranmi',
    role: 'customer',
  });

  getCurrentUser(): Observable<User> {
    return this.currentUserSubject.asObservable();
  }

  isAdmin(): boolean {
    return this.currentUserSubject.value.role === 'admin';
  }

  switchToAdmin(): void {
    this.currentUserSubject.next({
      id: '2',
      name: 'Invendiv',
      role: 'admin'
    });
  }

  switchToCustomer(): void {
    this.currentUserSubject.next({
      id: '1',
      name: 'Feranmi',
      role: 'customer'
    });
  }
}