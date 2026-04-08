import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { Subtask } from '../../../core/models/subtask.interface';
import { apiRoutes } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubtaskService {
  private apiService = inject(ApiService);

  constructor() { }

  getAllSubtasks(): Observable<Subtask[]> {
    return this.apiService.get<Subtask[]>(apiRoutes.subtask.apiUrl);
  }

  getSubtaskById(id: string): Observable<Subtask | null> {
    return this.apiService.get<Subtask>(`${apiRoutes.subtask.getById}/${id}`);
  }

  createSubtask(subtask: Partial<Subtask>): Observable<Subtask> {
    return this.apiService.post<Subtask>(apiRoutes.subtask.apiUrl, subtask);
  }

  updateSubtask(id: string, subtask: Partial<Subtask>): Observable<Subtask> {
    return this.apiService.patch<Subtask>(`${apiRoutes.subtask.getById}/${id}`, subtask);
  }

  deleteSubtask(id: string): Observable<void> {
    return this.apiService.delete<void>(`${apiRoutes.subtask.getById}/${id}`);
  }
}
