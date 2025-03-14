import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { Product } from '../../../../services/mock.service';
import { ProductService, ProductFilters, InventoryHistory } from '../../../../services/product.service';
import { fadeIn, slideIn, cardAnimation } from '../../../../shared/animations';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    CardComponent,
    ButtonComponent
  ],
  templateUrl: './products.component.html',
  animations: [fadeIn, slideIn, cardAnimation]
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  productForm: FormGroup;
  showForm = false;
  editingProduct: Product | null = null;
  currentPage = 1;
  pageSize = 9;
  showHistory = false;
  selectedProduct: Product | null = null;
  inventoryHistory: InventoryHistory[] = [];

  filters: ProductFilters = {
    sortBy: 'nameAsc',
    stockLevel: 'all'
  };

  constructor(
    private productService: ProductService,
    private fb: FormBuilder
  ) {
    this.productForm = this.createForm();
  }

  ngOnInit() {
    this.loadProducts();
  }

  private createForm(product?: Product): FormGroup {
    return this.fb.group({
      name: [product?.name || ''],
      price: [product?.price || 0],
      description: [product?.description || ''],
      image: [product?.image || ''],
      stock: [product?.stock || 0]
    });
  }

  loadProducts() {
    this.productService.getProducts(this.filters, this.currentPage, this.pageSize)
      .subscribe(products => {
        this.products = products;
      });
  }

  showCreateForm() {
    this.showForm = true;
    this.editingProduct = null;
    this.productForm = this.createForm();
  }

  hideForm() {
    this.showForm = false;
    this.editingProduct = null;
  }

  editProduct(product: Product) {
    this.editingProduct = product;
    this.showForm = true;
    this.productForm = this.createForm(product);
  }

  onSubmit() {
    if (this.productForm.valid) {
      if (this.editingProduct) {
        this.productService.updateProduct(this.editingProduct.id, this.productForm.value);
      } else {
        this.productService.addProduct(this.productForm.value);
      }
      this.hideForm();
      this.loadProducts();
    }
  }

  confirmDelete(product: Product) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(product.id);
      this.loadProducts();
    }
  }

  applyFilters() {
    this.currentPage = 1;
    this.loadProducts();
  }

  changePage(page: number) {
    this.currentPage = page;
    this.loadProducts();
  }

  viewHistory(product: Product) {
    this.selectedProduct = product;
    this.showHistory = true;
    this.productService.getInventoryHistory(product.id)
      .subscribe(history => {
        this.inventoryHistory = history;
      });
  }
}