import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { take } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CartService } from '../../../../services/cart.service';
import { DiscountService, Discount } from '../../../../services/discount.service';
import { fadeIn, slideIn, cardAnimation } from '../../../../shared/animations';
import { CartItem } from '../../../../services/cart.service';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, CardComponent, ButtonComponent],
  templateUrl: './cart.component.html',
  animations: [fadeIn, slideIn, cardAnimation]
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  subtotal = 0;
  total = 0;
  discountCode = '';
  appliedDiscount: Discount | null = null;
  discountError = '';

  constructor(
    private cartService: CartService,
    private discountService: DiscountService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCart();
  }

  private loadCart() {
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
      this.calculateTotals();
    });
  }

  private calculateTotals() {
    this.subtotal = this.cartItems.reduce((sum, item) => 
      sum + (item.price * item.quantity), 0);
    
    this.total = this.appliedDiscount
      ? this.subtotal * (1 - this.appliedDiscount.percentage / 100)
      : this.subtotal;
  }

  updateQuantity(item: CartItem, quantity: number) {
    if (quantity > 0 && quantity <= item.stock) {
      this.cartService.updateQuantity(item.id, quantity);
    } else if (quantity > item.stock) {
      this.toastService.show('marketplace.cart.item.stockLimit', 'warning', { stock: item.stock, name: item.name });
    }
  }

  removeItem(productId: string) {
    this.cartService.removeFromCart(productId);
  }

  clearCart() {
    this.cartService.clearCart();
    this.appliedDiscount = null;
    this.discountCode = '';
  }

  applyDiscount() {
    this.discountError = '';
    this.discountService.getDiscounts().pipe(take(1)).subscribe(discounts => {
      const discount = discounts.find(d => {
        const isValidCode = d.code.toLowerCase() === this.discountCode.toLowerCase();
        const isActive = d.isActive;
        const isNotExpired = new Date(d.validUntil) > new Date();
        const hasAvailableUsage = !d.usageLimit || d.usageCount < d.usageLimit;
        return isValidCode && isActive && isNotExpired && hasAvailableUsage;
      });

      if (discount) {
        this.appliedDiscount = discount;
        this.discountService.incrementUsage(discount.id);
        this.calculateTotals();
        this.toastService.show('marketplace.cart.discount.applied', 'success');
        this.discountCode = '';
      } else {
        this.discountError = 'marketplace.cart.discount.invalid';
        this.toastService.show('marketplace.cart.discount.invalid', 'error');
      }
    });
  }

  removeDiscount() {
    this.appliedDiscount = null;
    this.discountCode = '';
    this.calculateTotals();
  }

  checkout() {
    this.router.navigate(['/marketplace/checkout']);
  }
}