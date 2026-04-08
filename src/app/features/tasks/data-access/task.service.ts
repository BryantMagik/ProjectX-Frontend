import { Injectable, inject } from "@angular/core";
import { ApiService } from "../../../core/services/api.service";
import { Observable } from "rxjs";
import { Task } from "../../../core/models/task.interface";
import { apiRoutes } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiService = inject(ApiService);

  getTasks(): Observable<Task[]> {
    return this.apiService.get<Task[]>(apiRoutes.task.getOnlyOwn);
  }

  getTasksById(id: string): Observable<Task | null> {
    return this.apiService.get<Task>(`${apiRoutes.task.getById}/${id}`);
  }

  getTasksPorId(id: string): Observable<Task | null> {
    return this.apiService.get<Task>(`${apiRoutes.task.getPorId}/id/${id}`);
  }

  getTaskByProjectId(projectId: string): Observable<Task[]> {
    return this.apiService.get<Task[]>(`${apiRoutes.task.getTaskByProjectId}/${projectId}`);
  }

  createTask(taskData: any): Observable<Task> {
    const { projectId, ...dataToSend } = taskData;
    return this.apiService.post<Task>(`${apiRoutes.task.create}/${projectId}`, dataToSend);
  }

  actuaTask(taskId: string, taskData: any): Observable<Task> {
    return this.apiService.patch<Task>(`${apiRoutes.task.update}/${taskId}`, taskData);
  }

  updateTask(taskData: Partial<Task>, taskId: string): Observable<Task> {
    return this.apiService.patch<Task>(`${apiRoutes.task.update}/${taskId}`, taskData);
  }

  deleteTask(taskId: string): Observable<void> {
    return this.apiService.delete<void>(`${apiRoutes.task.update}/${taskId}`);
  }

  getTaskTotalCount(): Observable<{ count: number }> {
    return this.apiService.get<{ count: number }>(apiRoutes.task.metrics.total);
  }

  getTaskAssignedCount(): Observable<{ count: number }> {
    return this.apiService.get<{ count: number }>(apiRoutes.task.metrics.assigned);
  }

  getTaskCompletedCount(): Observable<{ count: number }> {
    return this.apiService.get<{ count: number }>(apiRoutes.task.metrics.completed);
  }

  getTaskOverdueCount(): Observable<{ count: number }> {
    return this.apiService.get<{ count: number }>(apiRoutes.task.metrics.overdue);
  }
}
