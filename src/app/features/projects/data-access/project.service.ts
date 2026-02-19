import { BehaviorSubject, catchError, Observable, of, switchMap, tap } from "rxjs"
import { ApiService } from "../../../core/services/api.service"
import { AuthService } from "../../../core/services/auth.service"
import { Project } from "../../../core/models/project.interface"
import { HttpHeaders } from "@angular/common/http"
import { Injectable, inject } from "@angular/core"
import { apiRoutes } from "../../../../environments/environment.development"

@Injectable({
  providedIn: 'root'
})

export class ProjectService {
  private apiService = inject(ApiService);
  private authService = inject(AuthService);

  private projectsSubject = new BehaviorSubject<Project[]>([])
    projects$ = this.projectsSubject.asObservable()

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() { }

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

  getProjectsRequest(): Observable<Project[]> {
    const headers = this.getAuthHeaders()
    if (headers) {
      return this.apiService.get<Project[]>(`${apiRoutes.project.getAll}`, { headers }).pipe(
        catchError(error => {
          console.error('Error al obtener todos los proyectos:', error)
          return of([])
        })
      )
    }
    return of([])
  }

  getProjectByWorkspaceId(workspaceId: string): Observable<Project[]> {
      const headers = this.getAuthHeaders()
      if (headers) {
        return this.apiService.get<Project[]>(`${apiRoutes.project.getAllProjectsByWorkspaceId}/${workspaceId}`, { headers }).pipe(
          tap((projects) => {
            this.projectsSubject.next(projects)
          }),
          catchError((error) => {
            console.error('Error al obtener los proyectos:', error);
            return of([])
          })
        )
      }
      return of([])
    }

  getProjectById(id: string): Observable<Project | null> {
    const headers = this.getAuthHeaders();
    if (headers) {
      return this.apiService.get<Project>(`${apiRoutes.project.getById}/${id}`, { headers })
    }
    return of(null)
  }

  postProject(workspaceId: string, newProject: Omit<Project, 'workspaceId'>): Observable<Project[]> {
      const headers = this.getAuthHeaders();
      if (headers) {
        return this.apiService.post<Project>(`${apiRoutes.project.create}/${workspaceId}`, newProject, { headers }).pipe(
          switchMap(() => this.getProjectByWorkspaceId(workspaceId)),
          catchError(error => {
            console.error('Error al crear el proyecto:', error)
            return of([])
          })
        )
      }
      return of([])
    }

  updateProject(newProject: Partial<Project>, id: string): Observable<Project> {
    const headers = this.getAuthHeaders();
    if (headers) {
      return this.apiService.patch<Project>(`${apiRoutes.project.update}/id/${id}`, newProject, { headers });
    }
    return of(newProject as Project)
  }


  getProjectByIdWhereId(): Observable<Project[]> {
    const headers = this.getAuthHeaders()
    if (headers) {
      return this.apiService.get<Project[]>(`${apiRoutes.project.getOnlyOwn}`, { headers })
    }
    return of([])
  }
}
