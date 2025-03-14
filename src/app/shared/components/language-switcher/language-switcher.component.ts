import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { ButtonComponent } from '../ui/button/button.component';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="flex gap-2">
      <app-button 
        variant="outline"
        [class.active]="currentLang === 'en'"
        (click)="switchLanguage('en')">
        🇺🇸 EN
      </app-button>
      <app-button 
        variant="outline"
        [class.active]="currentLang === 'he'"
        (click)="switchLanguage('he')">
        🇮🇱 HE
      </app-button>
    </div>
  `,
  styles: [`
    .active {
      @apply bg-primary/10;
    }
  `]
})
export class LanguageSwitcherComponent {
  currentLang: string;

  constructor(private translate: TranslateService) {
    this.currentLang = translate.currentLang || 'en';
  }

  switchLanguage(lang: string) {
    this.currentLang = lang;
    this.translate.use(lang);
    document.dir = lang === 'he' ? 'rtl' : 'ltr';
  }
}