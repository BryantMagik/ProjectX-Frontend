import { catchError, Observable, of } from "rxjs";
import { ApiService } from "../api.service";
import { AuthService } from "../auth/auth.service";
import { Project } from "../../model/project.interface";
import { HttpHeaders } from "@angular/common/http";
import { projectApi } from "../../../environments/environment";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class ProjectService {
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
    return headers
  }

  getProjectsRequest(): Observable<Project[]> {
    const headers = this.getAuthHeaders();
    if (headers) {
      return this.apiService.get<Project[]>(`${projectApi.getAll}`, { headers })
    }
    return of([])
  }

  getProjectById(id: string): Observable<Project | null> {
    const headers = this.getAuthHeaders();
    if (headers) {
      return this.apiService.get<Project>(`${projectApi.getById}/${id}`, { headers })
    }
    return of(null)
  }

  postProject(newProject: Project): Observable<Project | null> {
    const headers = this.getAuthHeaders()
    if (headers) {
      return this.apiService.post<Project>(`${projectApi.create}`, newProject, { headers })
    }
    return of(null)
  }

  updateProject(newProject: Project, id: string): Observable<Project> {
    const headers = this.getAuthHeaders();
    if (headers) {
      return this.apiService.put<Project>(`${projectApi.update}/${id}`, newProject, { headers }).pipe(
        catchError(error => {
          console.error('Error al actualizar el proyecto:', error);
          // Retornar un proyecto vacío o predeterminado en lugar de null
          return of({} as Project); // Retornar un objeto vacío como fallback
        })
      );
    }
    // Retornar un proyecto vacío en caso de no haber headers
    return of({} as Project);
  }


  getProjectByIdWhereId(): Observable<Project[]> {
    const headers = this.getAuthHeaders();
    if (headers) {
      return this.apiService.get<Project[]>(`${projectApi.getOnlyOwn}`, { headers })
    }
    return of([])
  }
}