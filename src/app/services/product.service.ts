import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { MockService, Product } from './mock.service';

export interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  stockLevel?: 'all' | 'low' | 'out';
  sortBy?: 'nameAsc' | 'nameDesc' | 'priceLow' | 'priceHigh';
  sortOrder?: 'asc' | 'desc';
}

export interface InventoryHistory {
  productId: string;
  date: Date;
  previousStock: number;
  newStock: number;
  type: 'update' | 'sale' | 'restock';
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly STORAGE_KEY = 'products';
  private readonly HISTORY_KEY = 'inventory_history';
  private productsSubject = new BehaviorSubject<Product[]>([]);
  private historySubject = new BehaviorSubject<InventoryHistory[]>([]);

  constructor(private mockService: MockService) {
    this.initializeProducts();
  }

  private initializeProducts(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      this.productsSubject.next(JSON.parse(stored));
    } else {
      this.mockService.getProducts().subscribe(products => {
        this.saveProducts(products);
      });
    }
  }

  private saveProducts(products: Product[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(products));
    this.productsSubject.next(products);
  }

  getTotalProducts(filters?: ProductFilters): Observable<number> {
    let filtered = [...this.productsSubject.value];

    if (filters) {
      if (filters.search) {
        const search = filters.search.toLowerCase();
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(search) || 
          p.description.toLowerCase().includes(search)
        );
      }

      if (filters.category && filters.category !== 'all') {
        filtered = filtered.filter(p => p.category === filters.category);
      }
    }

    return of(filtered.length);
  }

  getProducts(filters?: ProductFilters, page = 1, pageSize = 10): Observable<Product[]> {
    let filtered = [...this.productsSubject.value];

    if (filters) {
      if (filters.search) {
        const search = filters.search.toLowerCase();
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(search) || 
          p.description.toLowerCase().includes(search)
        );
      }

      if (filters.stockLevel) {
        filtered = filtered.filter(p => {
          switch (filters.stockLevel) {
            case 'low': return p.stock > 0 && p.stock <= 5;
            case 'out': return p.stock === 0;
            default: return true;
          }
        });
      }
      
      if (filters.category && filters.category !== 'all') {
        filtered = filtered.filter(p => p.category === filters.category);
      }

      if (filters.sortBy) {
        filtered.sort((a, b) => {
          switch (filters.sortBy) {
            case 'nameAsc': return a.name.localeCompare(b.name);
            case 'nameDesc': return b.name.localeCompare(a.name);
            case 'priceLow': return a.price - b.price;
            case 'priceHigh': return b.price - a.price;
            default: return 0;
          }
        });
      }
    }

    const start = (page - 1) * pageSize;
    const paged = filtered.slice(start, start + pageSize);
    return of(paged);
  }

  addProduct(product: Omit<Product, 'id'>): void {
    const products = this.productsSubject.value;
    const newProduct = {
      ...product,
      id: crypto.randomUUID()
    };
    this.saveProducts([...products, newProduct]);
  }

  updateProduct(id: string, updates: Partial<Product>): void {
    const products = this.productsSubject.value;
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      const oldStock = products[index].stock;
      products[index] = { ...products[index], ...updates };
      this.saveProducts(products);

      if (updates.stock !== undefined && updates.stock !== oldStock) {
        this.addInventoryHistory({
          productId: id,
          date: new Date(),
          previousStock: oldStock,
          newStock: updates.stock,
          type: 'update'
        });
      }
    }
  }

  deleteProduct(id: string): void {
    const products = this.productsSubject.value;
    this.saveProducts(products.filter(p => p.id !== id));
  }

  private addInventoryHistory(history: InventoryHistory): void {
    const stored = localStorage.getItem(this.HISTORY_KEY);
    const histories = stored ? JSON.parse(stored) : [];
    histories.push(history);
    localStorage.setItem(this.HISTORY_KEY, JSON.stringify(histories));
    this.historySubject.next(histories);
  }

  getInventoryHistory(productId?: string): Observable<InventoryHistory[]> {
    const histories = this.historySubject.value;
    return of(productId ? histories.filter(h => h.productId === productId) : histories);
  }
}