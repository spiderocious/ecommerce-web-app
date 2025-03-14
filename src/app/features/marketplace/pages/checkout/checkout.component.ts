import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CartService, CartItem } from '../../../../services/cart.service';
import { fadeIn, slideIn } from '../../../../shared/animations';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    TranslateModule,
    CardComponent,
    ButtonComponent
  ],
  templateUrl: './checkout.component.html',
  animations: [fadeIn, slideIn]
})
export class CheckoutComponent implements OnInit {
  shippingForm: FormGroup;
  paymentForm: FormGroup;
  cartItems: CartItem[] = [];
  subtotal = 0;
  total = 0;
  discount = 0;
  acceptedTerms = false;
  showTermsError = false;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private router: Router
  ) {
    this.shippingForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', Validators.required],
      country: ['', Validators.required]
    });

    this.paymentForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
      expiryDate: ['', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])/[0-9]{2}$')]],
      cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]],
      nameOnCard: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
      this.calculateTotals();
    });
  }

  private calculateTotals() {
    this.cartService.getTotal().subscribe(total => {
      this.total = total;
      this.subtotal = total;
    });
  }

  placeOrder() {
    if (!this.acceptedTerms) {
      this.showTermsError = true;
      return;
    }

    if (this.shippingForm.valid && this.paymentForm.valid) {
      const order = {
        shipping: this.shippingForm.value,
        payment: this.paymentForm.value,
        items: this.cartItems,
        total: this.total,
        subtotal: this.subtotal,
        discount: this.discount
      };

      console.log('Order placed:', order);
      this.cartService.clearCart();
      this.router.navigate(['/marketplace/products']);
    } else {
      this.shippingForm.markAllAsTouched();
      this.paymentForm.markAllAsTouched();
    }
  }

  getFieldError(form: FormGroup, field: string): string {
    const control = form.get(field);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return 'checkout.validation.required';
      }
      if (control.errors['email']) {
        return 'checkout.validation.email';
      }
      if (control.errors['pattern']) {
        return `checkout.validation.${field}`;
      }
    }
    return '';
  }
}