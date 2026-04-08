import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Comment } from '../../core/models/comment.interface';
import { ApiService } from '../../core/services/api.service';
import { apiRoutes } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private apiService = inject(ApiService);

  create(comment: Comment): Observable<Comment | null> {
    return this.apiService.post<Comment>(apiRoutes.comment.apiUrl, comment);
  }

  findAll(): Observable<Comment[]> {
    return this.apiService.get<Comment[]>(apiRoutes.comment.apiUrl);
  }

  findOne(id: string): Observable<Comment | null> {
    return this.apiService.get<Comment>(`${apiRoutes.comment.getById}/${id}`);
  }

  update(id: string, comment: Partial<Comment>): Observable<Comment | null> {
    return this.apiService.patch<Comment>(`${apiRoutes.comment.getById}/${id}`, comment);
  }

  deleteCommentById(id: string): Observable<void> {
    return this.apiService.delete<void>(`${apiRoutes.comment.getById}/${id}`);
  }

  getCommentsByTask(taskId: string): Observable<Comment[]> {
    return this.apiService.get<Comment[]>(apiRoutes.comment.getByTask(taskId));
  }

  getCommentsByIssue(issueId: string): Observable<Comment[]> {
    return this.apiService.get<Comment[]>(apiRoutes.comment.getByIssue(issueId));
  }
}
