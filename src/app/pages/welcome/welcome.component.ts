import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../../shared/components/ui/button/button.component';
import { CardComponent } from '../../shared/components/ui/card/card.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, ButtonComponent, CardComponent],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-6">
      <div class="max-w-4xl w-full text-center">
        <h1 class="text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
          {{ 'welcome.title' | translate }}
        </h1>
        <p class="text-xl mb-12 text-gray-600">
          {{ 'welcome.subtitle' | translate }}
        </p>
        <div class="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <app-card 
            class="transform transition-all hover:scale-105 cursor-pointer"
            [routerLink]="['/marketplace']">
            <div class="p-6 text-center">
              <div class="text-6xl mb-4">🛍️</div>
              <h2 class="text-2xl font-semibold mb-4">{{ 'welcome.shop.title' | translate }}</h2>
              <p class="text-gray-600">{{ 'welcome.shop.description' | translate }}</p>
            </div>
          </app-card>
          <app-card 
            class="transform transition-all hover:scale-105 cursor-pointer"
            [routerLink]="['/admin']">
            <div class="p-6 text-center">
              <div class="text-6xl mb-4">⚙️</div>
              <h2 class="text-2xl font-semibold mb-4">{{ 'welcome.admin.title' | translate }}</h2>
              <p class="text-gray-600">{{ 'welcome.admin.description' | translate }}</p>
            </div>
          </app-card>
        </div>
      </div>
    </div>
  `
})
export class WelcomeComponent {
  constructor(private authService: AuthService) {}
}