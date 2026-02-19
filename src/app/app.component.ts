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
}
