import { Injectable } from "@angular/core";
import { ApiService } from "../api.service";
import { AuthService } from "../auth/auth.service";
import { HttpHeaders } from "@angular/common/http";
import { Workspace } from "../../model/workspace.interface";
import { Observable, of } from "rxjs";
import { workspaceApi } from "../../../environments/environment";

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
            return this.apiService.post<Workspace>(`${workspaceApi.create}`, newWorkspace, { headers })
        }
        return of(null)
    }
}