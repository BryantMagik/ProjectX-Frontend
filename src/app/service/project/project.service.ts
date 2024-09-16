import { Observable, of } from "rxjs";
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

  private getAuthHeaders(): HttpHeaders | null {
    if (this.authService.isAuthenticated()) {
      const token = this.authService.getToken()
      if (token) {
        return new HttpHeaders().set('Authorization', `Bearer ${token}`);
      }
    }
    return null;

  }

  getProjectsRequest(): Observable<Project[]> {
    const headers = this.getAuthHeaders();
    if (headers) {
      return this.apiService.get<Project[]>(`${projectApi.getAll}`, { headers });
    }
    return of([]);
  }

  getProjectById(id: string): Observable<Project | null> {
    const headers = this.getAuthHeaders();
    if (headers) {
      return this.apiService.get<Project>(`${projectApi.getById}/${id}`, { headers });
    }
    return of(null);
  }
}