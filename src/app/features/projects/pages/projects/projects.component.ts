import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../data-access/project.service';
import { Project } from '../../../../core/models/project.interface';
import { Router } from '@angular/router';
import { UserService } from '../../../profile/data-access/user.service';
import { WorkspaceStore } from '../../../../core/services/workspace.store';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-projects',
    imports: [CommonModule, FormsModule],
    templateUrl: './projects.component.html',
    styleUrl: './projects.component.css',
    standalone: true
})
export class ProjectsComponent {
  private projectsService = inject(ProjectService);
  private userService = inject(UserService);
  private router = inject(Router);
  private workspaceStore = inject(WorkspaceStore);

  searchTerm = '';

  projectsQuery = injectQuery(() => ({
    queryKey: ['projects', 'workspace', this.workspaceStore.selectedId()],
    queryFn: () => firstValueFrom(this.projectsService.getProjectByWorkspaceId(this.workspaceStore.selectedId()!)),
    enabled: !!this.workspaceStore.selectedId(),
  }));

  usersQuery = injectQuery(() => ({
    queryKey: ['users'],
    queryFn: () => firstValueFrom(this.userService.getAllUsers()),
  }));

  get filteredProjects(): Project[] {
    const term = this.searchTerm.toLowerCase();
    const projects = this.projectsQuery.data() ?? [];
    if (!term) return projects;
    return projects.filter(p =>
      p.name?.toLowerCase().includes(term) ||
      p.code?.toLowerCase().includes(term) ||
      p.description?.toLowerCase().includes(term)
    );
  }

  get loading(): boolean { return this.projectsQuery.isPending(); }
  get error(): string | null { return this.projectsQuery.isError() ? 'Failed to load projects' : null; }
  get authors() { return this.usersQuery.data() ?? []; }
  get currentWorkspaceId(): string | null { return this.workspaceStore.selectedId(); }

  onSearchChange(): void {}

  navigateToProjectForm(): void {
    const workspaceId = this.workspaceStore.selectedId();
    if (workspaceId) {
      this.router.navigate(['/projects/new'], { queryParams: { workspaceId } });
    } else {
      this.router.navigate(['/projects/new']);
    }
  }

  navigateToProject(projectId: string): void {
    this.router.navigate(['/projects', projectId]);
  }

  getActiveProjectsCount(): number {
    return this.filteredProjects.filter(p => p.status === 'Active').length;
  }

  getCompletedProjectsCount(): number {
    return this.filteredProjects.filter(p => p.status === 'Completed').length;
  }

  getOngoingProjectsCount(): number {
    return this.filteredProjects.filter(p => p.status === 'Ongoing').length;
  }
}
