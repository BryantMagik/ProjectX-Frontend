import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable,of } from 'rxjs';
import { ApiService } from '../api.service';
import { AuthService } from '../auth/auth.service';
import { Subtask } from '../../model/subtask.interface';
import { subtaskApi } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SubtaskService {

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

  getAllSubtasks(): Observable<Subtask[]> {
    const headers = this.getAuthHeaders();
    if (headers) {
      return this.apiService.get<Subtask[]>(`${subtaskApi.apiUrl}`, { headers });
    }
    return of([]);
  }

  getSubtaskById(id: string): Observable<Subtask | null> {
    const headers = this.getAuthHeaders();
    if (headers) {
      return this.apiService.get<Subtask>(`${subtaskApi.apiUrl}/${id}`, { headers });
    }
    return of(null);
  }

  createSubtask(subtask: Partial<Subtask>): Observable<Subtask> {
    const headers = this.getAuthHeaders();
    return this.apiService.post<Subtask>(`${subtaskApi.apiUrl}`, subtask, { headers });
  }
}
