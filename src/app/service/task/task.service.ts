import { Injectable } from "@angular/core";
import { ApiService } from "../api.service";
import { AuthService } from "../auth/auth.service";
import { Observable, of } from "rxjs";
import { Task } from "../../model/task.interface";
import { HttpHeaders } from "@angular/common/http";
import { taskApi } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})

export class TaskService {
  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) { }

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
      return this.apiService.get<Task[]>(`${taskApi.getOnlyOwn}`, { headers })
    }
    return of([]);
  }

  getTasksById(id: string): Observable<Task | null> {
    const headers = this.getAuthHeaders()
    if (headers) {
      return this.apiService.get<Task>(`${taskApi.getById}/${id}`, { headers })
    }
    return of(null);
  }

  //TODO
  postTask() { }
  getTasksByIdWhereId(): Observable<Task[]> {
    const headers = this.getAuthHeaders()
    if (headers) {
      return this.apiService.get<Task[]>(`${taskApi.getOnlyOwn}`, { headers })
    }
    return of([]);

  }
}
