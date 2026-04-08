import { catchError, Observable, of, switchMap } from "rxjs"
import { ApiService } from "../../core/services/api.service"
import { Project } from "../../core/models/project.interface"
import { Injectable, inject } from "@angular/core"
import { apiRoutes } from "../../../environments/environment"

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiService = inject(ApiService);

  constructor() { }

  /** Returns only the projects owned by the current user. */
  getProjectsRequest(): Observable<Project[]> {
    return this.apiService.get<Project[]>(apiRoutes.project.getOnlyOwn).pipe(
      catchError(() => of([]))
    );
  }

  getProjectByWorkspaceId(workspaceId: string): Observable<Project[]> {
    return this.apiService.get<Project[]>(`${apiRoutes.project.getAllProjectsByWorkspaceId}/${workspaceId}`).pipe(
      catchError(() => of([]))
    );
  }

  getProjectById(id: string): Observable<Project | null> {
    return this.apiService.get<Project>(`${apiRoutes.project.getById}/${id}`);
  }

  postProject(workspaceId: string, newProject: Omit<Project, 'workspaceId'>): Observable<Project[]> {
    return this.apiService.post<Project>(`${apiRoutes.project.create}/${workspaceId}`, newProject).pipe(
      switchMap(() => this.getProjectByWorkspaceId(workspaceId)),
      catchError(() => of([]))
    );
  }

  updateProject(newProject: Project, id: string): Observable<Project> {
    return this.apiService.patch<Project>(`${apiRoutes.project.update}/id/${id}`, newProject).pipe(
      catchError(() => of(newProject))
    );
  }

  getProjectByIdWhereId(): Observable<Project[]> {
    return this.getProjectsRequest();
  }
}
