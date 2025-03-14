import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { ApiService } from '../../../../services/api.service';
import { Discount } from '../../../../services/discount.service';
import { fadeIn, slideIn, cardAnimation } from '../../../../shared/animations';

interface ValidationErrors {
  code?: string;
  percentage?: string;
  validUntil?: string;
  usageLimit?: string;
}

@Component({
  selector: 'app-discounts',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    CardComponent,
    ButtonComponent
  ],
  templateUrl: './discounts.component.html',
  animations: [fadeIn, slideIn, cardAnimation]
})
export class DiscountsComponent implements OnInit {
  discountForm: FormGroup;
  discounts: Discount[] = [];
  editingDiscount: Discount | null = null;
  showForm = false;
  validationErrors: ValidationErrors = {};
  isFormValid = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService
  ) {
    this.discountForm = this.createForm();
  }

  ngOnInit() {
    this.loadDiscounts();
    this.discountForm.valueChanges.subscribe(() => {
      this.validateForm();
    });
  }

  showCreateForm() {
    this.showForm = true;
    this.discountForm = this.createForm();
  }

  hideForm() {
    this.showForm = false;
    this.editingDiscount = null;
    this.discountForm = this.createForm();
    this.validationErrors = {};
  }

  private createForm(discount?: Discount): FormGroup {
    return this.fb.group({
      code: [discount?.code || ''],
      percentage: [discount?.percentage || ''],
      validUntil: [discount?.validUntil ? this.formatDate(discount.validUntil) : ''],
      usageLimit: [discount?.usageLimit || ''],
      isActive: [discount?.isActive ?? true]
    });
  }

  private formatDate(date: Date): string {
    return new Date(date).toISOString().split('T')[0];
  }

  validateField(field: keyof ValidationErrors) {
    const value = this.discountForm.get(field)?.value;
    
    switch (field) {
      case 'code':
        if (!value || value.length < 3) {
          this.validationErrors.code = 'discounts.form.codeRequired';
        } else if (!this.apiService.isDiscountCodeUnique(value, this.editingDiscount?.id)) {
          this.validationErrors.code = 'discounts.form.codeExists';
        } else {
          delete this.validationErrors.code;
        }
        break;

      case 'percentage':
        if (!value || value <= 0) {
          this.validationErrors.percentage = 'discounts.form.percentageRequired';
        } else if (value > 100) {
          this.validationErrors.percentage = 'discounts.form.percentageError';
        } else {
          delete this.validationErrors.percentage;
        }
        break;

      case 'validUntil':
        if (!value) {
          this.validationErrors.validUntil = 'discounts.form.dateRequired';
        } else if (new Date(value) < new Date()) {
          this.validationErrors.validUntil = 'discounts.form.dateError';
        } else {
          delete this.validationErrors.validUntil;
        }
        break;

      case 'usageLimit':
        if (value && value < 0) {
          this.validationErrors.usageLimit = 'discounts.form.usageLimitError';
        } else {
          delete this.validationErrors.usageLimit;
        }
        break;
    }

    this.validateForm();
  }

  private validateForm() {
    const formValue = this.discountForm.value;
    this.isFormValid = 
      formValue.code?.length >= 3 &&
      formValue.percentage > 0 &&
      formValue.percentage <= 100 &&
      formValue.validUntil &&
      new Date(formValue.validUntil) > new Date() &&
      (!formValue.usageLimit || formValue.usageLimit >= 0) &&
      Object.keys(this.validationErrors).length === 0;
  }

  private loadDiscounts() {
    this.apiService.getDiscounts().subscribe(discounts => {
      this.discounts = discounts;
    });
  }

  editDiscount(discount: Discount) {
    this.editingDiscount = discount;
    this.showForm = true;
    this.discountForm = this.createForm(discount);
    this.validateForm();
  }

  onSubmit() {
    if (this.isFormValid) {
      try {
        const formValue = {
          ...this.discountForm.value,
          validUntil: new Date(this.discountForm.value.validUntil)
        };

        if (this.editingDiscount) {
          this.apiService.updateDiscount(this.editingDiscount.id, formValue);
          this.editingDiscount = null;
        } else {
          this.apiService.addDiscount(formValue);
        }
        
        this.hideForm();
      } catch (error: any) {
        console.error(error.message);
      }
    }
  }

  toggleDiscount(discount: Discount) {
    this.apiService.updateDiscount(discount.id, {
      isActive: !discount.isActive
    });
  }

  deleteDiscount(id: string) {
    this.apiService.deleteDiscount(id);
  }

  getUsagePercentage(discount: Discount): number {
    if (!discount.usageLimit) return 0;
    return Math.min(100, (discount.usageCount / discount.usageLimit) * 100);
  }
}