import { Injectable, inject } from "@angular/core";
import { ApiService } from "../../core/services/api.service";
import { AuthService } from "../../core/services/auth.service";
import { HttpHeaders } from "@angular/common/http";
import { Workspace } from "../../core/models/workspace.interface";
import { Observable, of, Subject } from "rxjs";
import { apiRoutes } from "../../../environments/environment.development";

@Injectable({
    providedIn: 'root'
})
export class WorkspaceService {
    private apiService = inject(ApiService);
    private authService = inject(AuthService);

    private workspacesChanged = new Subject<void>();
    workspacesChanged$ = this.workspacesChanged.asObservable();

    constructor() { }

    notifyWorkspacesChanged(): void {
        this.workspacesChanged.next();
    }

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
            return this.apiService.get<Workspace[]>(`${apiRoutes.workspace.getOnlyOwn}`, { headers })
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

    // Invitation methods
    createInvitation(workspaceId: string, invitationData: any): Observable<any> {
        const headers = this.getAuthHeaders()
        if (headers) {
            const baseUrl = apiRoutes.workspace.create.replace('/workspace', '');
            return this.apiService.post<any>(`${baseUrl}/workspace/${workspaceId}/invitations`, invitationData, { headers })
        }
        return of(null)
    }

    getWorkspaceInvitations(workspaceId: string): Observable<any[]> {
        const headers = this.getAuthHeaders()
        if (headers) {
            const baseUrl = apiRoutes.workspace.create.replace('/workspace', '');
            return this.apiService.get<any[]>(`${baseUrl}/workspace/${workspaceId}/invitations`, { headers })
        }
        return of([])
    }

    joinWorkspaceByToken(token: string): Observable<any> {
        const headers = this.getAuthHeaders()
        if (headers) {
            const baseUrl = apiRoutes.workspace.create.replace('/workspace', '');
            return this.apiService.post<any>(`${baseUrl}/workspace/join`, { token }, { headers })
        }
        return of(null)
    }

    getWorkspaceMembers(workspaceId: string): Observable<any> {
        const headers = this.getAuthHeaders()
        if (headers) {
            const baseUrl = apiRoutes.workspace.create.replace('/workspace', '');
            return this.apiService.get<any>(`${baseUrl}/workspace/${workspaceId}/members`, { headers })
        }
        return of(null)
    }

    deactivateInvitation(invitationId: string): Observable<any> {
        const headers = this.getAuthHeaders()
        if (headers) {
            const baseUrl = apiRoutes.workspace.create.replace('/workspace', '');
            return this.apiService.patch<any>(`${baseUrl}/workspace/invitations/${invitationId}/deactivate`, {}, { headers })
        }
        return of(null)
    }

    removeMemberFromWorkspace(workspaceId: string, userId: string): Observable<any> {
        const headers = this.getAuthHeaders()
        if (headers) {
            const baseUrl = apiRoutes.workspace.create.replace('/workspace', '');
            return this.apiService.delete<any>(`${baseUrl}/workspace/${workspaceId}/members/${userId}`, { headers })
        }
        return of(null)
    }
}
