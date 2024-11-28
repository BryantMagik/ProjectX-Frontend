import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Issue } from '../../model/issue.interface';
import { issueApi } from '../../../environments/environment';
import { ApiService } from '../api.service';
import { AuthService } from '../auth/auth.service';



@Injectable({
  providedIn: 'root'
})
export class IssueService {

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) { }

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
      return this.apiService.get<Issue[]>(`${issueApi.apiUrl}`, { headers });
    }
    return of([]);
  }

  getIssueById(id: string): Observable<Issue | null> {
    const headers = this.getAuthHeaders();
    if (headers) {
      return this.apiService.get<Issue>(`${issueApi.apiUrl}/${id}`, { headers });
    }
    return of(null);
  }

  createIssue(issue: Issue): Observable<Issue> {
    const headers = this.getAuthHeaders();
    return this.apiService.post<Issue>(`${issueApi.apiUrl}`, issue, { headers });
  }

  updateIssue(id: string, updatedIssue: Partial<Issue>): Observable<Issue> {
    const headers = this.getAuthHeaders();
    return this.apiService.patch<Issue>(`${issueApi.apiUrl}/${id}`, updatedIssue, { headers });
  }

  deleteIssue(id: string): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.apiService.delete<void>(`${issueApi.apiUrl}/${id}`, { headers });
  }

}
