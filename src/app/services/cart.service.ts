import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Product } from './mock.service';
import { ToastService } from './toast.service';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  stock: number;
  quantity: number;
}

const CART_STORAGE_KEY = 'cart_items';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);

  constructor(private toastService: ToastService) {
    this.loadCart();
  }

  private loadCart() {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      this.cartItems.next(JSON.parse(stored));
    }
  }

  private saveCart(items: CartItem[]) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    this.cartItems.next(items);
  }

  getCartItems(): Observable<CartItem[]> {
    return this.cartItems.asObservable();
  }

  isInCart(productId: string): Observable<boolean> {
    return this.cartItems.pipe(
      map(items => items.some(item => item.id === productId))
    );
  }

  addToCart(product: Product) {
    const currentItems = this.cartItems.value;
    const existingItem = currentItems.find(item => item.id === product.id);
    
    if (existingItem) {
      const updatedItems = currentItems.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      this.saveCart(updatedItems);
      this.saveCart([...currentItems]);
      this.toastService.show('marketplace.cart.quantityUpdated', 'success');
    } else {
      const cartItem: CartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
        image: product.image,
        stock: product.stock,
        quantity: 1
      };
      this.saveCart([...currentItems, cartItem]);
      this.toastService.show('marketplace.cart.itemAdded', 'success');
    }
  }

  removeFromCart(productId: string) {
    const currentItems = this.cartItems.value;
    this.saveCart(currentItems.filter(item => item.id !== productId));
    this.toastService.show('marketplace.cart.itemRemoved', 'success');
  }

  updateQuantity(productId: string, quantity: number) {
    const currentItems = this.cartItems.value;
    const item = currentItems.find(item => item.id === productId);
    
    if (item) {
      item.quantity = quantity;
      this.saveCart([...currentItems]);
      this.toastService.show('marketplace.cart.quantityUpdated', 'success');
    }
  }

  clearCart() {
    this.saveCart([]);
    this.toastService.show('marketplace.cart.cleared', 'success');
  }

  getTotal(): Observable<number> {
    return new Observable<number>(observer => {
      this.cartItems.subscribe(items => {
        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        observer.next(total);
      });
    });
  }
}