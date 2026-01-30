import { Injectable } from "@angular/core";
import { ApiService } from "../../../core/services/api.service";
import { AuthService } from "../../../core/services/auth.service";
import { HttpHeaders } from "@angular/common/http";
import { Workspace } from "../../../model/workspace.interface";
import { Observable, of } from "rxjs";
import { apiRoutes } from "../../../../environments/environment.development";

@Injectable({
    providedIn: 'root'
})
export class WorkspaceService {
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

    postWorkspace(newWorkspace: Workspace): Observable<Workspace | null> {
        const headers = this.getAuthHeaders()
        if (headers) {
            return this.apiService.post<Workspace>(`${apiRoutes.workspace.create}`, newWorkspace, { headers })
        }
        return of(null)
    }

    updateWorkspace(newWorkspace: Workspace, id: string): Observable<Workspace | null> {
        const headers = this.getAuthHeaders()
        if (headers) {
            return this.apiService.patch<Workspace>(`${apiRoutes.workspace.update}/${id}`, newWorkspace, { headers })
        }
        return of(null)
    }

    getAllWorkspace(): Observable<Workspace[]> {
        const headers = this.getAuthHeaders()
        if (headers) {
            return this.apiService.get<Workspace[]>(`${apiRoutes.workspace.getAll}`, { headers })
        }
        return of([])
    }

    getWorkspaceById(workspaceId: string): Observable<Workspace | null> {
        const headers = this.getAuthHeaders()
        if (headers) {
            return this.apiService.get<Workspace>(`${apiRoutes.workspace.getById}/${workspaceId}`, { headers })
        }
        return of(null)
    }

    deleteWorkspace(workspaceId: string): Observable<Workspace | null> {
        const headers = this.getAuthHeaders()
        if (headers) {
            return this.apiService.delete<Workspace>(`${apiRoutes.workspace.delete}/${workspaceId}`, { headers })
        }
        return of(null)
    }
}
