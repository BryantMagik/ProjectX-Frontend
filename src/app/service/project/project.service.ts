import { BehaviorSubject, catchError, Observable, of, switchMap, tap } from "rxjs"
import { ApiService } from "../api.service"
import { AuthService } from "../auth/auth.service"
import { Project } from "../../model/project.interface"
import { HttpHeaders } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { apiRoutes } from "../../../environments/environment.development"

@Injectable({
  providedIn: 'root'
})

export class ProjectService {
  private projectsSubject = new BehaviorSubject<Project[]>([])
    projects$ = this.projectsSubject.asObservable()
    
  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) { }

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

  updateProject(newProject: Project, id: string): Observable<Project> {
    const headers = this.getAuthHeaders();
    if (headers) {
      return this.apiService.patch<Project>(`${apiRoutes.project.update}/id/${id}`, newProject, { headers }).pipe(
        catchError(error => {
          console.error('Error al actualizar el proyecto:', error)
          return of(newProject)
        })
      );
    }
    return of(newProject)
  }


  getProjectByIdWhereId(): Observable<Project[]> {
    const headers = this.getAuthHeaders()
    if (headers) {
      return this.apiService.get<Project[]>(`${apiRoutes.project.getOnlyOwn}`, { headers })
    }
    return of([])
  }
}