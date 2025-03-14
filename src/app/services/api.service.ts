import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MockService, Product } from './mock.service';
import { DiscountService, Discount } from './discount.service';

const USE_MOCK = true;

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(
    private mockService: MockService,
    private discountService: DiscountService
  ) {}

  isDiscountCodeUnique(code: string, excludeId?: string): boolean {
    let discounts: Discount[] = [];
    this.discountService.getDiscounts().subscribe(d => discounts = d);
    return !discounts.some(d => d.code === code && d.id !== excludeId);
  }

  // Products list get
  getProducts(): Observable<Product[]> {
    if (USE_MOCK) {
      return this.mockService.getProducts();
    }
    // this will be replaced by real api call in real life scenarios
    return this.mockService.getProducts();
  }

  getProduct(id: string): Observable<Product | undefined> {
    if (USE_MOCK) {
      return this.mockService.getProduct(id);
    }
    // this will be replaced by real api call in real life scenarios
    return this.mockService.getProduct(id);
  }

  // Discounts services ls
  getDiscounts(): Observable<Discount[]> {
    if (USE_MOCK) {
      return this.discountService.getDiscounts();
    }
    // this will be replaced by real api call in real life scenarios
    return this.discountService.getDiscounts();
  }

  addDiscount(discount: Omit<Discount, 'id'>): void {
    if (USE_MOCK) {
      this.discountService.addDiscount(discount);
      return;
    }
    // this will be replaced by real api call in real life scenarios
    this.discountService.addDiscount(discount);
  }

  updateDiscount(id: string, discount: Partial<Discount>): void {
    if (USE_MOCK) {
      this.discountService.updateDiscount(id, discount);
      return;
    }
    // this will be replaced by real api call in real life scenarios
    this.discountService.updateDiscount(id, discount);
  }

  deleteDiscount(id: string): void {
    if (USE_MOCK) {
      this.discountService.deleteDiscount(id);
      return;
    }
    // this will be replaced by real api call in real life scenarios
    this.discountService.deleteDiscount(id);
  }
}