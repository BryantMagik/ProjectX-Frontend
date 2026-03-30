import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WorkspaceStore {
  private getStorageKey(): string {
    const userId = sessionStorage.getItem('userId');
    return userId ? `workspace_${userId}` : 'selectedWorkspaceId';
  }

  readonly selectedId = signal<string | null>(
    localStorage.getItem(
      sessionStorage.getItem('userId')
        ? `workspace_${sessionStorage.getItem('userId')}`
        : 'selectedWorkspaceId'
    )
  );

  select(workspaceId: string): void {
    localStorage.setItem(this.getStorageKey(), workspaceId);
    this.selectedId.set(workspaceId);
  }

  clear(): void {
    const userId = sessionStorage.getItem('userId');
    if (userId) localStorage.removeItem(`workspace_${userId}`);
    localStorage.removeItem('selectedWorkspaceId');
    this.selectedId.set(null);
  }
}
