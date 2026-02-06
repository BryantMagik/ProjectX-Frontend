import { Injectable, inject } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Issue } from '../../core/models/issue.interface';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { apiRoutes } from "../../../environments/environment";



@Injectable({
  providedIn: 'root'
})
export class IssueService {
  private apiService = inject(ApiService);
  private authService = inject(AuthService);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);


  constructor() { }

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

  getAllIssues(): Observable<Issue[]> {
    const headers = this.getAuthHeaders();
    if (headers) {
      return this.apiService.get<Issue[]>(`${apiRoutes.issue.apiUrl}`, { headers });
    }
    return of([]);
  }

  getIssueById(id: string): Observable<Issue | null> {
    const headers = this.getAuthHeaders();
    if (headers) {
      return this.apiService.get<Issue>(`${apiRoutes.issue.getById}/${id}`, { headers });
    }
    return of(null);
  }

  createIssue(issue: Issue): Observable<Issue> {
    const headers = this.getAuthHeaders();
    return this.apiService.post<Issue>(`${apiRoutes.issue.apiUrl}`, issue, { headers });
  }

  updateIssue(id: string, updatedIssue: Partial<Issue>): Observable<Issue> {
    const headers = this.getAuthHeaders();
    return this.apiService.patch<Issue>(`${apiRoutes.issue.getById}/${id}`, updatedIssue, { headers });
  }

  deleteIssue(id: string): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.apiService.delete<void>(`${apiRoutes.issue.getById}/${id}`, { headers });
  }

}
