import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../features/projects/services/project.service';
import { tap } from 'rxjs';
import { Project } from '../../model/project.interface';
import { Router } from '@angular/router';
import { User } from '../../model/user.interface';
import { UserService } from '../../features/profile/services/user.service';

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

  constructor() { }

  ngOnInit(): void {
    this.getProjects();
    this.getUsers();
  }

  navigateToProjectForm() {
    // Obtener workspaceId de sessionStorage (mismo método que usa workspace-switcher)
    const userId = sessionStorage.getItem('userId');
    const storageKey = userId ? `workspace_${userId}` : 'selectedWorkspaceId';
    const workspaceId = sessionStorage.getItem(storageKey);

    if (workspaceId) {
      this.router.navigate(['/pages/shared/project-form'], {
        queryParams: { workspaceId }
      });
    } else {
      console.error('No workspace selected');
      this.router.navigate(['/pages/shared/project-form']);
    }
  }

  navigateToProject(projectId: string) {
    this.router.navigate(['/pages/projects', projectId]);
  }

  private getProjects(): void {
    this.projectsService.getProjectByIdWhereId().pipe(
      tap({
        next: (projects: Project[] | null) => {
          if (projects) {
            this.projects = projects;
            this.filteredProjects = projects;
            console.log('Projects loaded:', projects);
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
            console.log('Authors loaded:', authors);
          }
        },
        error: (err) => {
          console.warn('Could not load users:', err);
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
