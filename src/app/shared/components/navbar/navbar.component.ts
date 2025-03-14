import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';
import { AuthService, User } from '../../../services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, LanguageSwitcherComponent],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {
  user: User | null = null;
  isMobileMenuOpen = false;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => {
      this.user = user;
    });
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.isMobileMenuOpen = false;
    });
  }

  isActive(path: string): boolean {
    return window.location.pathname === path;
  }

  isLandingPage(): boolean {
    return window.location.pathname === '/welcome';
  }

  // // isActive(route: string): boolean {
  // //   return this.router.url === route || this.router.url.startsWith(route + '/');
  // // }
  
  // isLandingPage(): boolean {
  //   return this.router.url === '/landing' || this.router.url === '/auth/login' || this.router.url === '/auth/register';
  // }
  
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}