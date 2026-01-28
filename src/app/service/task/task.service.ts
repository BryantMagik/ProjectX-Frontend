import { Injectable, inject } from "@angular/core";
import { ApiService } from "../../core/services/api.service";
import { AuthService } from "../../core/services/auth.service";
import { Observable, of } from "rxjs";
import { Task } from "../../model/task.interface";
import { HttpHeaders } from "@angular/common/http";
import { apiRoutes } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})

export class TaskService {
  private apiService = inject(ApiService);
  private authService = inject(AuthService);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() { }

  //COMPLETED TODO: TESTING
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

  getTasksRequest(): Observable<Task[]> {
    const headers = this.getAuthHeaders()
    if (headers) {
      return this.apiService.get<Task[]>(`${apiRoutes.task.getOnlyOwn}`, { headers })
    }
    return of([]);
  }

  getTasksById(id: string): Observable<Task | null> {
    const headers = this.getAuthHeaders()
    if (headers) {
      return this.apiService.get<Task>(`${apiRoutes.task.getById}/${id}`, { headers })
    }
    return of(null);
  }

  getTaskByProjectId(projectId: string): Observable<Task[]> {
    const headers = this.getAuthHeaders()
    if (headers) {
      return this.apiService.get<Task[]>(`${apiRoutes.task.getTaskByProjectId}/${projectId}`, { headers })
    }
    return of([])
  }

  //TODO
  postTask() { }
  getTasksByIdWhereId(): Observable<Task[]> {
    const headers = this.getAuthHeaders()
    if (headers) {
      return this.apiService.get<Task[]>(`${apiRoutes.task.getOnlyOwn}`, { headers })
    }
    return of([]);
  }
}
