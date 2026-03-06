import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private primeng = inject(PrimeNG);

  title = 'ProjectX';

  constructor() {
    this.applyMobileOsClass();

    this.primeng.theme.set({
        preset: Aura,
            options: {
                darkModeSelector: false,
                cssLayer: {
                    name: 'primeng',
                    order: 'tailwind-base, primeng, tailwind-utilities'
                }
            }
        })
    }

  private applyMobileOsClass(): void {
    if (typeof navigator === 'undefined' || typeof document === 'undefined') {
      return;
    }

    const userAgent = navigator.userAgent || navigator.vendor || '';
    const isIOS = /iPad|iPhone|iPod/i.test(userAgent);
    const isAndroid = /Android/i.test(userAgent);

    if (isIOS) {
      document.documentElement.setAttribute('data-mobile-os', 'ios');
      return;
    }

    if (isAndroid) {
      document.documentElement.setAttribute('data-mobile-os', 'android');
    }
  }
}
