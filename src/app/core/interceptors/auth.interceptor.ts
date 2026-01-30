import { HttpInterceptorFn, HttpErrorResponse, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, filter, take, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // No añadir token a las rutas de auth (login, register, refresh)
  if (isAuthRoute(req.url)) {
    return next(req);
  }

  const token = authService.getToken();

  if (token) {
    req = addToken(req, token);
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && authService.hasRefreshToken()) {
        return handleTokenRefresh(req, next, authService);
      }
      return throwError(() => error);
    })
  );
};

function addToken(req: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
}

function isAuthRoute(url: string): boolean {
  const authRoutes = ['/auth/login', '/auth/register', '/auth/refresh'];
  return authRoutes.some(route => url.includes(route));
}

function handleTokenRefresh(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService
) {
  if (!authService.isRefreshingToken) {
    authService.isRefreshingToken = true;
    authService.refreshToken$.next(null);

    return authService.refreshTokens().pipe(
      switchMap((tokens) => {
        authService.isRefreshingToken = false;
        authService.refreshToken$.next(tokens.accessToken);
        return next(addToken(req, tokens.accessToken));
      }),
      catchError((error) => {
        authService.isRefreshingToken = false;
        authService.logout();
        return throwError(() => error);
      })
    );
  }

  // Si ya se está refrescando, esperar al nuevo token
  return authService.refreshToken$.pipe(
    filter(token => token !== null),
    take(1),
    switchMap(token => next(addToken(req, token!)))
  );
}
