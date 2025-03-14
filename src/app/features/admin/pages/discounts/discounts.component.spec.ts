import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DiscountsComponent } from './discounts.component';
import { ApiService } from '../../../../services/api.service';
import { of } from 'rxjs';

describe('DiscountsComponent', () => {
  let component: DiscountsComponent;
  let fixture: ComponentFixture<DiscountsComponent>;
  let apiService: jest.Mocked<ApiService>;

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
    const apiServiceMock = {
      getDiscounts: jest.fn().mockReturnValue(of([mockDiscount])),
      addDiscount: jest.fn(),
      updateDiscount: jest.fn(),
      deleteDiscount: jest.fn(),
      isDiscountCodeUnique: jest.fn().mockReturnValue(true)
    };

    await TestBed.configureTestingModule({
      imports: [
        DiscountsComponent,
        TranslateModule.forRoot({
          defaultLanguage: 'en'
        }),
        NoopAnimationsModule
      ],
      providers: [
        { provide: ApiService, useValue: apiServiceMock }
      ]
    }).compileComponents();

    apiService = TestBed.inject(ApiService) as jest.Mocked<ApiService>;
    fixture = TestBed.createComponent(DiscountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load discounts', () => {
    expect(apiService.getDiscounts).toHaveBeenCalled();
    expect(component.discounts).toEqual([mockDiscount]);
  });

  it('should validate discount code uniqueness', () => {
    component.discountForm.patchValue({ code: 'TEST10' });
    component.validateField('code');
    expect(apiService.isDiscountCodeUnique).toHaveBeenCalled();
  });

  it('should validate percentage range', () => {
    component.discountForm.patchValue({ percentage: 150 });
    component.validateField('percentage');
    expect(component.validationErrors.percentage).toBeTruthy();
  });

  it('should validate future date', () => {
    component.discountForm.patchValue({ 
      validUntil: new Date(Date.now() - 86400000).toISOString().split('T')[0]
    });
    component.validateField('validUntil');
    expect(component.validationErrors.validUntil).toBeTruthy();
  });

  it('should create new discount', () => {
    component.discountForm.patchValue({
      code: 'NEW20',
      percentage: 20,
      validUntil: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      usageLimit: 50
    });

    component.onSubmit();
    expect(apiService.addDiscount).toHaveBeenCalled();
  });

  it('should update existing discount', () => {
    component.editDiscount(mockDiscount);
    component.discountForm.patchValue({ percentage: 15 });
    component.onSubmit();
    expect(apiService.updateDiscount).toHaveBeenCalled();
  });
});