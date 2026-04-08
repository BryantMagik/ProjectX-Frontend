import { Injectable, inject } from "@angular/core";
import { ApiService } from "../../../core/services/api.service";
import { Workspace } from "../../../core/models/workspace.interface";
import { Observable, of } from "rxjs";
import { apiRoutes } from "../../../../environments/environment";

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
        return this.apiService.get<Workspace[]>(apiRoutes.workspace.getAll);
    }

    getWorkspaceById(workspaceId: string): Observable<Workspace | null> {
        return this.apiService.get<Workspace>(`${apiRoutes.workspace.getById}/${workspaceId}`);
    }

    deleteWorkspace(workspaceId: string): Observable<Workspace | null> {
        return this.apiService.delete<Workspace>(`${apiRoutes.workspace.delete}/${workspaceId}`);
    }
}
