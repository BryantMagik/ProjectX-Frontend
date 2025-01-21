import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideHttpClient(withFetch()),
    provideAnimationsAsync(),
    provideRouter(routes), 
    MessageService, provideAnimationsAsync(),
    providePrimeNG({ 
      theme: {
          preset: Aura,
          options: {
            prefix: 'p',
            darkModeSelector: 'system',
            cssLayer: false
        }
      }
  })
  ],
};