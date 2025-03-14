import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { CheckoutComponent } from './checkout.component';
import { CartService } from '../../../../services/cart.service';
import { of } from 'rxjs';

describe('CheckoutComponent', () => {
  let component: CheckoutComponent;
  let fixture: ComponentFixture<CheckoutComponent>;
  let cartService: jest.Mocked<CartService>;
  let router: jest.Mocked<Router>;

  const mockCartItems = [
    { id: '1', name: 'Product 1', price: 99.99, quantity: 2, stock: 10, description: '', image: '' }
  ];

  beforeEach(async () => {
    const cartServiceMock = {
      getCartItems: jest.fn().mockReturnValue(of(mockCartItems)),
      getTotal: jest.fn().mockReturnValue(of(199.98)),
      clearCart: jest.fn()
    };

    const routerMock = {
      navigate: jest.fn()
    };

    const activatedRouteMock = {
      params: of({})
    };

    await TestBed.configureTestingModule({
      imports: [
        CheckoutComponent,
        TranslateModule.forRoot({
          defaultLanguage: 'en'
        }),
        NoopAnimationsModule
       ],
      providers: [
        { provide: CartService, useValue: cartServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    }).compileComponents();

    cartService = TestBed.inject(CartService) as jest.Mocked<CartService>;
    router = TestBed.inject(Router) as jest.Mocked<Router>;
    fixture = TestBed.createComponent(CheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize forms', () => {
    expect(component.shippingForm.get('name')).toBeTruthy();
    expect(component.paymentForm.get('cardNumber')).toBeTruthy();
  });

  it('should validate shipping form', () => {
    const form = component.shippingForm;
    expect(form.valid).toBeFalsy();
    
    form.patchValue({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      address: '123 Main St',
      city: 'City',
      state: 'State',
      zip: '12345',
      country: 'Country'
    });

    expect(form.valid).toBeTruthy();
  });

  it('should validate payment form', () => {
    const form = component.paymentForm;
    expect(form.valid).toBeFalsy();
    
    form.patchValue({
      cardNumber: '1234567890123456',
      expiryDate: '12/25',
      cvv: '123',
      nameOnCard: 'John Doe'
    });

    expect(form.valid).toBeTruthy();
  });

  it('should require terms acceptance', () => {
    component.placeOrder();
    expect(component.showTermsError).toBeTruthy();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should place order with valid forms and terms', () => {
    component.shippingForm.patchValue({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      address: '123 Main St',
      city: 'City',
      state: 'State',
      zip: '12345',
      country: 'Country'
    });

    component.paymentForm.patchValue({
      cardNumber: '1234567890123456',
      expiryDate: '12/25',
      cvv: '123',
      nameOnCard: 'John Doe'
    });

    component.acceptedTerms = true;
    component.placeOrder();

    expect(cartService.clearCart).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/marketplace/products']);
  });
});