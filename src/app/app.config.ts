import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import { provideTanStackQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { withDevtools } from '@tanstack/angular-query-experimental/devtools';
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    provideRouter(routes),
    provideTanStackQuery(new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60,      // 1 minuto antes de considerar dato viejo
          gcTime: 1000 * 60 * 5,     // 5 minutos en caché sin observadores
          retry: 1,
          refetchOnWindowFocus: false,
        },
      },
    }), withDevtools()),
    MessageService,
    providePrimeNG({
      theme: {
        options: {
          prefix: 'p',
          darkModeSelector: false,
          cssLayer: {
            name: 'primeng',
            order: 'app-styles, primeng, another-css-library'
          }
        }
      }
    })
  ],
};
