import { Injectable, inject } from "@angular/core";
import { ApiService } from "../../core/services/api.service";
import { Observable, of, } from "rxjs";
import { User } from "../../core/models/user.interface";
import { apiRoutes } from '../../../environments/environment';
import { AuthService } from "../../core/services/auth.service";
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiService = inject(ApiService);
  private authService = inject(AuthService);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);


  constructor() { }

  profile(token: string): Observable<User> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.apiService.get<User>(`${apiRoutes.auth.profile}`, { headers });
  }

  private getAuthHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    if (this.authService.isAuthenticated()) {
      const token = this.authService.getToken();
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
    }
    return headers;
  }

  loadUserProfile(): Observable<User | null> {
    if (this.authService.isAuthenticated()) {
      const token = this.authService.getToken();
      if (token) {
        return this.profile(token);
      }
    }
    return of(null)
  }
  getAllUsers(): Observable<User[] | null> {
    const headers = this.getAuthHeaders();
    if (headers) {
      return this.apiService.get<User[]>(`${apiRoutes.users.getAll}`, { headers });
    }
    return of([]);
  }
}
