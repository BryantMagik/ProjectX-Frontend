import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Issue } from '../../core/models/issue.interface';
import { ApiService } from '../../core/services/api.service';
import { apiRoutes } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class IssueService {
  private apiService = inject(ApiService);

  constructor() { }

  getAllIssues(): Observable<Issue[]> {
    return this.apiService.get<Issue[]>(apiRoutes.issue.apiUrl);
  }

  getIssueById(id: string): Observable<Issue | null> {
    return this.apiService.get<Issue>(`${apiRoutes.issue.getById}/${id}`);
  }

  createIssue(issue: Issue): Observable<Issue> {
    return this.apiService.post<Issue>(apiRoutes.issue.apiUrl, issue);
  }

  updateIssue(id: string, updatedIssue: Partial<Issue>): Observable<Issue> {
    return this.apiService.patch<Issue>(`${apiRoutes.issue.getById}/${id}`, updatedIssue);
  }

  deleteIssue(id: string): Observable<void> {
    return this.apiService.delete<void>(`${apiRoutes.issue.getById}/${id}`);
  }
}
