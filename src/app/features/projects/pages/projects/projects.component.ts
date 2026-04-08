import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../data-access/project.service';
import { tap } from 'rxjs';
import { Project } from '../../../../core/models/project.interface';
import { Router } from '@angular/router';
import { User } from '../../../../core/models/user.interface';
import { UserService } from '../../../profile/data-access/user.service';
import { WorkspaceStore } from '../../../../core/services/workspace.store';

@Component({
    selector: 'app-projects',
    imports: [CommonModule, FormsModule],
    templateUrl: './projects.component.html',
    styleUrl: './projects.component.css',
    standalone:true

})

export class ProjectsComponent implements OnInit {
  private userService = inject(UserService);
  private projectsService = inject(ProjectService);
  private router = inject(Router);
  private workspaceStore = inject(WorkspaceStore);

  projects: Project[] = [];
  filteredProjects: Project[] = [];
  authors: User[] = [];
  loading: boolean = true;
  error: string | null = null;
  searchTerm: string = '';

  get currentWorkspaceId(): string | null {
    return this.workspaceStore.selectedId();
  }

  constructor() { }

  ngOnInit(): void {
    const workspaceId = this.currentWorkspaceId;
    if (workspaceId) {
      this.getProjectByWorkspaceId(workspaceId);
    }
    this.getUsers();
  }

  navigateToProjectForm(): void {
    const workspaceId = this.workspaceStore.selectedId();
    if (workspaceId) {
      this.router.navigate(['/projects/new'], { queryParams: { workspaceId } });
    } else {
      this.router.navigate(['/projects/new']);
    }
  }

  navigateToProject(projectId: string) {
    this.router.navigate(['/projects', projectId]);
  }

  private getProjectByWorkspaceId(workspaceId: string): void {
    this.projectsService.getProjectByWorkspaceId(workspaceId).pipe(
      tap({
        next: (projects: Project[] | null) => {
          if (projects) {
            this.projects = projects;
            this.filteredProjects = projects;
          }
        },
        error: (err) => {
          console.error('Error loading projects by workspace:', err);
          this.error = 'Failed to load projects for the workspace. Please try again.';
          this.loading = false;
        },
        complete: () => this.loading = false
      })
    ).subscribe();
  }

  private getUsers(): void {
    this.userService.getAllUsers().pipe(
      tap({
        next: (authors: User[] | null) => {
          if (authors) {
            this.authors = authors;
          }
        },
        error: () => {
          // Don't show error if only users fail to load
        }
      })
    ).subscribe();
  }

  filterProjects(): void {
    this.filteredProjects = this.projects.filter(project => {
      const matchesSearch = !this.searchTerm ||
        project.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        project.code?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        project.description?.toLowerCase().includes(this.searchTerm.toLowerCase());

      return matchesSearch;
    });
  }

  onSearchChange(): void {
    this.filterProjects();
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
