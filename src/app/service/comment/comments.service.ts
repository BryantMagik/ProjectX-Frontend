import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable,of } from 'rxjs';
import { commentApi } from '../../../environments/environment.development';
import { Comment } from '../../model/comment.interface';
import { ApiService } from '../api.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  constructor(
    private http: HttpClient,
    private apiService: ApiService,
    private authService: AuthService

  ) {}

  private getAuthHeaders(): HttpHeaders {
    let headers = new HttpHeaders()
    if (this.authService.isAuthenticated()) {
      const token = this.authService.getToken()
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`)
      }
    }
    return headers
  }

  create(comment: Comment): Observable<Comment | null> {
    const headers = this.getAuthHeaders();
    if (headers) {
      return this.apiService.post<Comment>(`${commentApi.apiUrl}`, comment, { headers });
    }
    return of(null);
  }

  findAll(): Observable<Comment[]> {
    const headers = this.getAuthHeaders();
    if (headers) {
      return this.apiService.get<Comment[]>(`${commentApi.apiUrl}`, { headers });
    }
    return of([]);
  }

  findOne(id: string): Observable<Comment | null> {
    const headers = this.getAuthHeaders();
    if (headers) {
      return this.apiService.get<Comment>(`${commentApi.apiUrl}/${id}`, { headers });
    }
    return of(null);
  }


}
