import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../services/auth.service';
import { MockService } from '../../../../services/mock.service';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { Product } from '../../../../services/mock.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  userName = 'Invendiv';
  metrics = {
    totalProducts: 0,
    lowStockItems: 0,
    activeDiscounts: 0
  };
  lowStockItems: Product[] = [];

  constructor(
    private authService: AuthService,
    private mockService: MockService
  ) {
    authService.getCurrentUser().subscribe(user => {
      this.userName = user.name;
    });
    // Switch to admin mode when accessing dashboard
    authService.switchToAdmin();
    
    // Load metrics
    this.loadMetrics();
  }

  private loadMetrics() {
    this.mockService.getProducts().subscribe(products => {
      this.metrics.totalProducts = products.length;
      this.lowStockItems = products.filter(p => p.stock <= 5);
      this.metrics.lowStockItems = this.lowStockItems.length;
      this.metrics.activeDiscounts = 2; // Mock value for now
    });
  }
}