import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../data-access/project.service';
import { tap } from 'rxjs';
import { Project } from '../../../../core/models/project.interface';
import { Router } from '@angular/router';
import { User } from '../../../../core/models/user.interface';
import { UserService } from '../../../profile/data-access/user.service';

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

  projects: Project[] = [];
  filteredProjects: Project[] = [];
  authors: User[] = [];
  loading: boolean = true;
  error: string | null = null;
  searchTerm: string = '';
  currentWorkspaceId: string | null = null;

  constructor() { }

  ngOnInit(): void {
    this.getCurrentWorkspace();
    this.getProjects();
    this.getUsers();
  }

  private getCurrentWorkspace(): void {
    const userId = sessionStorage.getItem('userId');
    const storageKey = userId ? `workspace_${userId}` : 'selectedWorkspaceId';
    this.currentWorkspaceId = sessionStorage.getItem(storageKey);
  }

  navigateToProjectForm() {
    // Obtener workspaceId de sessionStorage (mismo método que usa workspace-switcher)
    const userId = sessionStorage.getItem('userId');
    const storageKey = userId ? `workspace_${userId}` : 'selectedWorkspaceId';
    const workspaceId = sessionStorage.getItem(storageKey);

    if (workspaceId) {
      this.router.navigate(['/projects/new'], {
        queryParams: { workspaceId }
      });
    } else {
      console.error('No workspace selected');
      this.router.navigate(['/projects/new']);
    }
  }

  navigateToProject(projectId: string) {
    this.router.navigate(['/projects', projectId]);
  }

  private getProjects(): void {
    this.projectsService.getProjectByIdWhereId().pipe(
      tap({
        next: (projects: Project[] | null) => {
          if (projects) {
            // Filtrar solo proyectos del workspace actual
            const workspaceProjects = this.currentWorkspaceId
              ? projects.filter(p => p.workspaceId === this.currentWorkspaceId)
              : projects;

            this.projects = workspaceProjects;
            this.filteredProjects = workspaceProjects;
          }
        },
        error: (err) => {
          console.error('Error loading projects:', err);
          this.error = 'Failed to load projects';
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
          // No mostrar error si solo fallan los usuarios
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
