import { Injectable } from "@angular/core";
import { ApiService } from "../api.service";
import { map, Observable, of, tap } from "rxjs";
import { User } from "../../model/user.interface";
import { userApi } from "../../../environments/environment";
import { AuthService } from "../auth/auth.service";
import { HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(
        private apiService: ApiService,
        private authService: AuthService
    ) { }

    profile(token: string): Observable<User> {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.apiService.get<User>(`${userApi.apirurl}`, { headers });
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
}
