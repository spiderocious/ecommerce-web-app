import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { Product } from '../../../../services/mock.service';
import { AuthService } from '../../../../services/auth.service';
import { ProductService } from '../../../../services/product.service';
import { CartService } from '../../../../services/cart.service';
import { fadeIn, cardAnimation } from '../../../../shared/animations';
import { ProductFilters } from '../../../../services/product.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TranslateModule,
    CardComponent,
    ButtonComponent
  ],
  templateUrl: './products.component.html',
  animations: [fadeIn, cardAnimation]
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  cartStatus: { [key: string]: boolean } = {};
  filters: ProductFilters = {};
  categories = ['gaming', 'accessories', 'audio'];
  currentPage = 1;
  pageSize = 15;
  totalProducts = 0;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService
  ) {
    this.authService.switchToCustomer();
  }

  ngOnInit() {
    this.loadProducts();
    this.cartService.getCartItems().subscribe(items => {
      this.cartStatus = {};
      items.forEach(item => {
        this.cartStatus[item.id] = true;
      });
    });
  }

  loadProducts() {
    this.productService.getProducts(this.filters, this.currentPage, this.pageSize).subscribe(products => {
      this.products = products;
    });
    this.productService.getTotalProducts(this.filters).subscribe(total => {
      this.totalProducts = total;
    });
  }

  applyFilters() {
    this.currentPage = 1;
    this.loadProducts();
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }

  changePage(page: number) {
    this.currentPage = page;
    this.loadProducts();
  }

  get totalPages(): number {
    return Math.ceil(this.totalProducts / this.pageSize);
  }
}