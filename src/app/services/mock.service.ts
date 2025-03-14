import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  stock: number;
  category: string;
}

@Injectable({
  providedIn: 'root'
})
export class MockService {
  private products: Product[] = [
    {
      id: '1',
      name: 'Pro Gaming Laptop',
      price: 99.99,
      description: 'High-performance gaming laptop with RGB keyboard',
      image: 'https://picsum.photos/seed/1/400/300',
      stock: 5,
      category: 'gaming'
    },
    {
      id: '2',
      name: 'Wireless Headphones',
      price: 149.99,
      description: 'Premium wireless headphones with noise cancellation',
      image: 'https://picsum.photos/seed/2/400/300',
      stock: 15,
      category: 'audio'
    },
    {
      id: '3',
      name: 'Mechanical Keyboard',
      price: 199.99,
      description: 'Mechanical gaming keyboard with custom switches',
      image: 'https://picsum.photos/seed/3/400/300',
      stock: 2,
      category: 'gaming'
    },
    {
      id: '4',
      name: '4K Monitor',
      price: 299.99,
      description: '32-inch 4K gaming monitor with HDR support',
      image: 'https://picsum.photos/seed/4/400/300',
      stock: 8,
      category: 'gaming'
    },
    {
      id: '5',
      name: 'Gaming Mouse',
      price: 79.99,
      description: 'High-DPI gaming mouse with programmable buttons',
      image: 'https://picsum.photos/seed/5/400/300',
      stock: 20,
      category: 'gaming'
    },
    {
      id: '6',
      name: 'Gaming Chair',
      price: 249.99,
      description: 'Ergonomic gaming chair with lumbar support',
      image: 'https://picsum.photos/seed/6/400/300',
      stock: 3,
      category: 'gaming'
    },
    {
      id: '7',
      name: 'RGB Mousepad',
      price: 29.99,
      description: 'Extended RGB mousepad with custom lighting',
      image: 'https://picsum.photos/seed/7/400/300',
      stock: 25,
      category: 'accessories'
    },
    {
      id: '8',
      name: 'Webcam Pro',
      price: 89.99,
      description: '1080p webcam with built-in microphone',
      image: 'https://picsum.photos/seed/8/400/300',
      stock: 12,
      category: 'accessories'
    },
    {
      id: '9',
      name: 'USB Microphone',
      price: 129.99,
      description: 'Professional USB condenser microphone',
      image: 'https://picsum.photos/seed/9/400/300',
      stock: 7,
      category: 'audio'
    },
    {
      id: '10',
      name: 'Graphics Card',
      price: 699.99,
      description: 'High-end gaming graphics card',
      image: 'https://picsum.photos/seed/10/400/300',
      stock: 4,
      category: 'gaming'
    },
    {
      id: '11',
      name: 'Gaming Console',
      price: 499.99,
      description: 'Next-gen gaming console',
      image: 'https://picsum.photos/seed/11/400/300',
      stock: 6,
      category: 'gaming'
    },
    {
      id: '12',
      name: 'Controller',
      price: 59.99,
      description: 'Wireless gaming controller',
      image: 'https://picsum.photos/seed/12/400/300',
      stock: 18,
      category: 'gaming'
    },
    {
      id: '13',
      name: 'Gaming Desk',
      price: 199.99,
      description: 'Spacious gaming desk with cable management',
      image: 'https://picsum.photos/seed/13/400/300',
      stock: 9,
      category: 'gaming'
    },
    {
      id: '14',
      name: 'Streaming Deck',
      price: 149.99,
      description: 'Customizable streaming control deck',
      image: 'https://picsum.photos/seed/14/400/300',
      stock: 11,
      category: 'accessories'
    },
    {
      id: '15',
      name: 'Gaming Speakers',
      price: 179.99,
      description: '2.1 gaming speakers with subwoofer',
      image: 'https://picsum.photos/seed/15/400/300',
      stock: 14,
      category: 'audio'
    },
  ];

  getProducts(): Observable<Product[]> {
    return of(this.products);
  }

  getProduct(id: string): Observable<Product | undefined> {
    return of(this.products.find(p => p.id === id));
  }
}