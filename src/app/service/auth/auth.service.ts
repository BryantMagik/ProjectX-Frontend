import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private apiService: ApiService, private router: Router) { }
  private tokenKey = 'tokeykey';
  private userId = 'userId'

  login(email: string, password: string): Observable<any> {
    return this.apiService.post<any>(`${environment.apirurl}`, { email, password }).pipe(
      tap(response => {
        if (response.token) {
          sessionStorage.setItem(this.tokenKey, response.token)
          sessionStorage.setItem('userId', response.id)
        }
      })
    )
  }

  private setToken(token: string): void {
    sessionStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem(this.tokenKey);
    } else {
      return null;
    }
  }

  getId(): string | null {
    if (typeof window !== 'undefined') {
        return sessionStorage.getItem(this.userId)
    } else {
      return null
    }
  }

  isAuthenticated(): boolean {
    const token = sessionStorage.getItem(this.tokenKey);
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

  
  logout(): void {
    sessionStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem('userId');
    this.router.navigate(['/login']);
  }
}
