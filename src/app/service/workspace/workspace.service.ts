import { Injectable, inject } from "@angular/core";
import { ApiService } from "../../core/services/api.service";
import { Workspace } from "../../core/models/workspace.interface";
import { Observable, of } from "rxjs";
import { apiRoutes } from "../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class WorkspaceService {
    private apiService = inject(ApiService);

    postWorkspace(newWorkspace: Workspace): Observable<Workspace | null> {
        return this.apiService.post<Workspace>(apiRoutes.workspace.create, newWorkspace);
    }

    updateWorkspace(newWorkspace: Workspace, id: string): Observable<Workspace | null> {
        return this.apiService.patch<Workspace>(`${apiRoutes.workspace.update}/${id}`, newWorkspace);
    }

    getAllWorkspace(): Observable<Workspace[]> {
        return this.apiService.get<Workspace[]>(apiRoutes.workspace.getOnlyOwn);
    }

    getWorkspaceById(workspaceId: string): Observable<Workspace | null> {
        return this.apiService.get<Workspace>(`${apiRoutes.workspace.getById}/${workspaceId}`);
    }

    deleteWorkspace(workspaceId: string): Observable<Workspace | null> {
        return this.apiService.delete<Workspace>(`${apiRoutes.workspace.delete}/${workspaceId}`);
    }

    createInvitation(workspaceId: string, invitationData: any): Observable<any> {
        const baseUrl = apiRoutes.workspace.create.replace('/workspace', '');
        return this.apiService.post<any>(`${baseUrl}/workspace/${workspaceId}/invitations`, invitationData);
    }

    getWorkspaceInvitations(workspaceId: string): Observable<any[]> {
        const baseUrl = apiRoutes.workspace.create.replace('/workspace', '');
        return this.apiService.get<any[]>(`${baseUrl}/workspace/${workspaceId}/invitations`);
    }

    joinWorkspaceByToken(token: string): Observable<any> {
        const baseUrl = apiRoutes.workspace.create.replace('/workspace', '');
        return this.apiService.post<any>(`${baseUrl}/workspace/join`, { token });
    }

    getWorkspaceMembers(workspaceId: string): Observable<any> {
        const baseUrl = apiRoutes.workspace.create.replace('/workspace', '');
        return this.apiService.get<any>(`${baseUrl}/workspace/${workspaceId}/members`);
    }

    deactivateInvitation(invitationId: string): Observable<any> {
        const baseUrl = apiRoutes.workspace.create.replace('/workspace', '');
        return this.apiService.patch<any>(`${baseUrl}/workspace/invitations/${invitationId}/deactivate`, {});
    }

    removeMemberFromWorkspace(workspaceId: string, userId: string): Observable<any> {
        const baseUrl = apiRoutes.workspace.create.replace('/workspace', '');
        return this.apiService.delete<any>(`${baseUrl}/workspace/${workspaceId}/members/${userId}`);
    }
}
