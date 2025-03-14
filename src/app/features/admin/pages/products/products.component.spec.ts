import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ProductsComponent } from './products.component';
import { ProductService } from '../../../../services/product.service';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('AdminProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let productService: jest.Mocked<ProductService>;

  const mockProducts = [
    { id: '1', name: 'Product 1', price: 99.99, stock: 10, category: 'gaming', description: '', image: '' }
  ];

  beforeEach(async () => {
    const productServiceMock = {
      getProducts: jest.fn().mockReturnValue(of(mockProducts)),
      addProduct: jest.fn(),
      updateProduct: jest.fn(),
      deleteProduct: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [ProductsComponent, TranslateModule.forRoot(), NoopAnimationsModule],
      providers: [
        { provide: ProductService, useValue: productServiceMock }
      ]
    }).compileComponents();

    productService = TestBed.inject(ProductService) as jest.Mocked<ProductService>;
    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products', () => {
    expect(productService.getProducts).toHaveBeenCalled();
    expect(component.products).toEqual(mockProducts);
  });

  it('should show create form', () => {
    component.showCreateForm();
    expect(component.showForm).toBeTruthy();
    expect(component.editingProduct).toBeNull();
  });

  it('should edit product', () => {
    component.editProduct(mockProducts[0]);
    expect(component.showForm).toBeTruthy();
    expect(component.editingProduct).toEqual(mockProducts[0]);
  });

  it('should submit new product', () => {
    component.showCreateForm();
    component.productForm.patchValue({
      name: 'New Product',
      price: 199.99,
      stock: 5,
      description: 'Description',
      image: 'image.jpg'
    });

    component.onSubmit();
    expect(productService.addProduct).toHaveBeenCalled();
  });

  it('should update existing product', () => {
    component.editProduct(mockProducts[0]);
    component.productForm.patchValue({
      name: 'Updated Product'
    });

    component.onSubmit();
    expect(productService.updateProduct).toHaveBeenCalled();
  });
});