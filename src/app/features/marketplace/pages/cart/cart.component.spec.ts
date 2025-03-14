import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CartComponent } from './cart.component';
import { CartService } from '../../../../services/cart.service';
import { DiscountService } from '../../../../services/discount.service';
import { ToastService } from '../../../../services/toast.service';
import { of } from 'rxjs';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let cartService: jest.Mocked<CartService>;
  let discountService: jest.Mocked<DiscountService>;
  let router: jest.Mocked<Router>;

  const mockCartItems = [
    { id: '1', name: 'Product 1', price: 99.99, quantity: 2, stock: 10, description: '', image: '' }
  ];

  const mockDiscount = {
    id: '1',
    code: 'TEST10',
    percentage: 10,
    validUntil: new Date(Date.now() + 86400000),
    isActive: true,
    usageLimit: 100,
    usageCount: 0,
    createdAt: new Date()
  };

  beforeEach(async () => {
    const cartServiceMock = {
      getCartItems: jest.fn().mockReturnValue(of(mockCartItems)),
      updateQuantity: jest.fn(),
      removeFromCart: jest.fn(),
      clearCart: jest.fn()
    };

    const discountServiceMock = {
      getDiscounts: jest.fn().mockReturnValue(of([mockDiscount])),
      incrementUsage: jest.fn()
    };

    const routerMock = {
      navigate: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [CartComponent, TranslateModule.forRoot(), NoopAnimationsModule],
      providers: [
        { provide: CartService, useValue: cartServiceMock },
        { provide: DiscountService, useValue: discountServiceMock },
        { provide: Router, useValue: routerMock },
        ToastService
      ]
    }).compileComponents();

    cartService = TestBed.inject(CartService) as jest.Mocked<CartService>;
    discountService = TestBed.inject(DiscountService) as jest.Mocked<DiscountService>;
    router = TestBed.inject(Router) as jest.Mocked<Router>;
    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load cart items and calculate totals', () => {
    expect(component.cartItems).toEqual(mockCartItems);
    expect(component.subtotal).toBe(199.98);
  });

  it('should update quantity within stock limits', () => {
    component.updateQuantity(mockCartItems[0], 3);
    expect(cartService.updateQuantity).toHaveBeenCalledWith('1', 3);
  });

  it('should not update quantity beyond stock', () => {
    component.updateQuantity(mockCartItems[0], 11);
    expect(cartService.updateQuantity).not.toHaveBeenCalled();
  });

  it('should apply valid discount', () => {
    component.discountCode = 'TEST10';
    component.applyDiscount();
    expect(component.appliedDiscount).toEqual(mockDiscount);
    expect(discountService.incrementUsage).toHaveBeenCalledWith(mockDiscount.id);
  });

  it('should navigate to checkout', () => {
    component.checkout();
    expect(router.navigate).toHaveBeenCalledWith(['/marketplace/checkout']);
  });
});