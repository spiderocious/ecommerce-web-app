import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ProductsComponent } from './products.component';
import { ProductService } from '../../../../services/product.service';
import { CartService } from '../../../../services/cart.service';
import { AuthService } from '../../../../services/auth.service';
import { of } from 'rxjs';
import { ActivatedRoute, convertToParamMap } from '@angular/router';

describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let productService: jest.Mocked<ProductService>;
  let cartService: jest.Mocked<CartService>;

  const mockProducts = [
    { id: '1', name: 'Product 1', price: 99.99, stock: 10, category: 'gaming', description: '', image: '' },
    { id: '2', name: 'Product 2', price: 149.99, stock: 5, category: 'audio', description: '', image: '' }
  ];

  beforeEach(async () => {
    const productServiceMock = {
      getProducts: jest.fn().mockReturnValue(of(mockProducts)),
      getTotalProducts: jest.fn().mockReturnValue(of(mockProducts.length)),
      getInventoryHistory: jest.fn().mockReturnValue(of([]))
    };

    const cartServiceMock = {
      getCartItems: jest.fn().mockReturnValue(of([])),
      addToCart: jest.fn(),
      isInCart: jest.fn().mockReturnValue(of(false))
    };

    const activatedRouteMock = {
    snapshot: {
      paramMap: convertToParamMap({}),
      queryParamMap: convertToParamMap({}),
      data: {}
    },
    paramMap: of(convertToParamMap({})),
    queryParamMap: of(convertToParamMap({}))
    };
    
    await TestBed.configureTestingModule({
      imports: [ProductsComponent, TranslateModule.forRoot(), NoopAnimationsModule],
      providers: [
        { provide: ProductService, useValue: productServiceMock },
        { provide: CartService, useValue: cartServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        AuthService
      ]
    }).compileComponents();

    productService = TestBed.inject(ProductService) as jest.Mocked<ProductService>;
    cartService = TestBed.inject(CartService) as jest.Mocked<CartService>;
    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', () => {
    expect(productService.getProducts).toHaveBeenCalled();
    expect(component.products).toEqual(mockProducts);
  });

  it('should apply filters and reload products', () => {
    component.filters = { category: 'gaming', sortBy: 'nameAsc' };
    component.applyFilters();
    expect(productService.getProducts).toHaveBeenCalledWith(
      { category: 'gaming', sortBy: 'nameAsc' },
      1,
      15
    );
  });

  it('should add product to cart', () => {
    component.addToCart(mockProducts[0]);
    expect(cartService.addToCart).toHaveBeenCalledWith(mockProducts[0]);
  });

  it('should change page and reload products', () => {
    component.changePage(2);
    expect(component.currentPage).toBe(2);
    expect(productService.getProducts).toHaveBeenCalledWith(
      expect.any(Object),
      2,
      15
    );
  });
});