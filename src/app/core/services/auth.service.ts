import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError, BehaviorSubject } from 'rxjs';
import { apiRoutes } from '../../../environments/environment';

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  id: string;
}

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiService = inject(ApiService);
  private router = inject(Router);

  private readonly ACCESS_TOKEN_KEY = 'accessToken';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';
  private readonly USER_ID_KEY = 'userId';

  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  login(email: string, password: string): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>(`${apiRoutes.auth.login}`, { email, password }).pipe(
      tap(response => {
        if (response.accessToken) {
          this.setTokens(response.accessToken, response.refreshToken);
          sessionStorage.setItem(this.USER_ID_KEY, response.id);
        }
      })
    );
  }

  refreshTokens(): Observable<RefreshTokenResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.apiService.post<RefreshTokenResponse>(`${apiRoutes.auth.refresh}`, { refreshToken }).pipe(
      tap(response => {
        this.setTokens(response.accessToken, response.refreshToken);
      }),
      catchError(error => {
        this.logout();
        return throwError(() => error);
      })
    );
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem(this.ACCESS_TOKEN_KEY);
    }
    return null;
  }

  getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem(this.REFRESH_TOKEN_KEY);
    }
    return null;
  }

  getId(): string | null {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem(this.USER_ID_KEY);
    }
    return null;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000;
      return Date.now() < exp;
    } catch (error) {
      console.error('Error al parsear el token:', error);
      return false;
    }
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000;
      return Date.now() >= exp;
    } catch {
      return true;
    }
  }

  hasRefreshToken(): boolean {
    return !!this.getRefreshToken();
  }

  logout(): void {
    const refreshToken = this.getRefreshToken();

    if (refreshToken && this.getToken()) {
      this.apiService.post(`${apiRoutes.auth.logout}`, {}).subscribe({
        error: () => {}
      });
    }

    this.clearTokens();
    this.clearUserData();
    this.router.navigate(['/login']);
  }

  get isRefreshingToken(): boolean {
    return this.isRefreshing;
  }

  set isRefreshingToken(value: boolean) {
    this.isRefreshing = value;
  }

  get refreshToken$(): BehaviorSubject<string | null> {
    return this.refreshTokenSubject;
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    sessionStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    sessionStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  private clearTokens(): void {
    sessionStorage.removeItem(this.ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(this.REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(this.USER_ID_KEY);
  }

  private clearUserData(): void {
    // Limpiar workspace guardado del usuario
    const userId = this.getId();
    if (userId) {
      sessionStorage.removeItem(`workspace_${userId}`);
    }
    // También limpiar la key genérica por si acaso
    sessionStorage.removeItem('selectedWorkspaceId');
  }
}
