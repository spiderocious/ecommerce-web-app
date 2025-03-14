import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { Product } from '../../../../services/mock.service';
import { ProductService } from '../../../../services/product.service';
import { CartService } from '../../../../services/cart.service';
import { fadeIn, slideIn, cardAnimation } from '../../../../shared/animations';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TranslateModule,
    CardComponent,
    ButtonComponent
  ],
  templateUrl: './product-details.component.html',
  animations: [fadeIn, slideIn, cardAnimation]
})
export class ProductDetailsComponent implements OnInit {
  product: Product | null = null;
  relatedProducts: Product[] = [];
  quantity = 1;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.loadProduct(id);
    });
  }

  private loadProduct(id: string) {
    this.productService.getProducts().subscribe(products => {
      this.product = products.find(p => p.id === id) || null;
      if (this.product) {
        this.loadRelatedProducts();
      }
    });
  }

  private loadRelatedProducts() {
    this.productService.getProducts().subscribe(products => {
      this.relatedProducts = products
        .filter(p => p.id !== this.product?.id && p.category === this.product?.category)
        .slice(0, 4);
    });
  }

  addToCart() {
    if (this.product) {
      for (let i = 0; i < this.quantity; i++) {
        this.cartService.addToCart(this.product);
      }
    }
  }

  updateQuantity(value: number) {
    this.quantity = Math.max(1, Math.min(value, this.product?.stock || 1));
  }
}