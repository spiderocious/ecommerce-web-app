import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { ToastService } from './toast.service';

describe('CartService', () => {
  let service: CartService;
  let toastService: ToastService;

  const mockProduct = {
    id: '1',
    name: 'Test Product',
    price: 99.99,
    description: 'Test Description',
    image: 'test.jpg',
    stock: 10,
    category: 'gaming'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CartService, ToastService]
    });
    service = TestBed.inject(CartService);
    toastService = TestBed.inject(ToastService);
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add item to cart', (done) => {
    service.addToCart(mockProduct);
    
    service.getCartItems().subscribe(items => {
      expect(items.length).toBe(1);
      expect(items[0].id).toBe(mockProduct.id);
      expect(items[0].quantity).toBe(1);
      done();
    });
  });


  it('should remove item from cart', (done) => {
    service.addToCart(mockProduct);
    service.removeFromCart(mockProduct.id);
    
    service.getCartItems().subscribe(items => {
      expect(items.length).toBe(0);
      done();
    });
  });

  it('should update item quantity', (done) => {
    service.addToCart(mockProduct);
    service.updateQuantity(mockProduct.id, 3);
    
    service.getCartItems().subscribe(items => {
      expect(items[0].quantity).toBe(3);
      done();
    });
  });

  it('should clear cart', (done) => {
    service.addToCart(mockProduct);
    service.clearCart();
    
    service.getCartItems().subscribe(items => {
      expect(items.length).toBe(0);
      done();
    });
  });

  it('should calculate total correctly', (done) => {
    service.addToCart(mockProduct);
    service.updateQuantity(mockProduct.id, 2);
    
    service.getTotal().subscribe(total => {
      expect(total).toBe(mockProduct.price * 2);
      done();
    });
  });
});