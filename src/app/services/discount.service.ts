import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Discount {
  id: string;
  code: string;
  percentage: number;
  validUntil: Date;
  isActive: boolean;
  usageLimit: number;
  usageCount: number;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class DiscountService {
  private readonly STORAGE_KEY = 'discounts';
  private discountsSubject = new BehaviorSubject<Discount[]>([]);

  constructor() {
    this.loadDiscounts();
  }

  private loadDiscounts(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      const discounts = JSON.parse(stored, (key, value) => {
        return key === 'validUntil' || key === 'createdAt' ? new Date(value) : value;
      });
      this.discountsSubject.next(discounts);
    }
  }

  private saveDiscounts(discounts: Discount[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(discounts));
    this.discountsSubject.next(discounts);
  }

  getDiscounts(): Observable<Discount[]> {
    return this.discountsSubject.asObservable();
  }

  isCodeUnique(code: string, excludeId?: string): boolean {
    return !this.discountsSubject.value
      .some(d => d.code === code && d.id !== excludeId);
  }

  addDiscount(discount: Omit<Discount, 'id'>): void {
    if (!this.isCodeUnique(discount.code)) {
      throw new Error('Discount code must be unique');
    }
    if (discount.validUntil < new Date()) {
      throw new Error('Expiration date cannot be in the past');
    }
    if (discount.percentage > 100 || discount.percentage <= 0) {
      throw new Error('Percentage must be between 1 and 100');
    }

    const discounts = this.discountsSubject.value;
    const newDiscount = {
      ...discount,
      id: crypto.randomUUID(),
      usageCount: 0,
      createdAt: new Date()
    };
    this.saveDiscounts([...discounts, newDiscount]);
  }

  updateDiscount(id: string, discount: Partial<Discount>): void {
    const discounts = this.discountsSubject.value;
    const index = discounts.findIndex(d => d.id === id);
    if (index === -1) return;

    if (discount.code && !this.isCodeUnique(discount.code, id)) {
      throw new Error('Discount code must be unique');
    }
    if (discount.validUntil && discount.validUntil < new Date()) {
      throw new Error('Expiration date cannot be in the past');
    }
    if (discount.percentage && (discount.percentage > 100 || discount.percentage <= 0)) {
      throw new Error('Percentage must be between 1 and 100');
    }

    discounts[index] = { ...discounts[index], ...discount };
    this.saveDiscounts(discounts);
  }

  deleteDiscount(id: string): void {
    const discounts = this.discountsSubject.value;
    this.saveDiscounts(discounts.filter(d => d.id !== id));
  }

  incrementUsage(id: string): void {
    const discounts = this.discountsSubject.value;
    const discount = discounts.find(d => d.id === id);
    if (discount && (!discount.usageLimit || discount.usageCount < discount.usageLimit)) {
      discount.usageCount++;
      this.saveDiscounts(discounts);
    }
  }
}