import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Comment } from '../../../core/models/comment.interface';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { apiRoutes } from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private http = inject(HttpClient);
  private apiService = inject(ApiService);
  private authService = inject(AuthService);

  constructor() {}

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
      return this.apiService.post<Comment>(`${apiRoutes.comment.apiUrl}`, comment, { headers });
    }
    return of(null);
  }

  findAll(): Observable<Comment[]> {
    const headers = this.getAuthHeaders();
    if (headers) {
      return this.apiService.get<Comment[]>(`${apiRoutes.comment.apiUrl}`, { headers });
    }
    return of([]);
  }

  findOne(id: string): Observable<Comment | null> {
    const headers = this.getAuthHeaders();
    if (headers) {
      return this.apiService.get<Comment>(`${apiRoutes.comment.getById}/${id}`, { headers });
    }
    return of(null);
  }

  update(id: string, comment: Partial<Comment>): Observable<Comment | null> {
    const headers = this.getAuthHeaders();
    if (headers) {
      return this.apiService.patch<Comment>(`${apiRoutes.comment.getById}/${id}`, comment, { headers });
    }
    return of(null);
  }

  deleteCommentById(id: string): Observable<void> {
    const headers = this.getAuthHeaders();
    if (headers) {
      return this.apiService.delete<void>(`${apiRoutes.comment.getById}/${id}`, { headers });
    }
    return of();
  }

  getCommentsByTask(taskId: string): Observable<Comment[]> {
    const headers = this.getAuthHeaders();
    if (headers) {
      return this.apiService.get<Comment[]>(`${apiRoutes.comment.getByTask(taskId)}`, { headers });
    }
    return of([]);
  }

  getCommentsByIssue(issueId: string): Observable<Comment[]> {
    const headers = this.getAuthHeaders();
    if (headers) {
      return this.apiService.get<Comment[]>(`${apiRoutes.comment.getByIssue(issueId)}`, { headers });
    }
    return of([]);
  }


}
