import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../features/projects/services/project.service';
import { tap } from 'rxjs';
import { Project } from '../../model/project.interface';
import { Router } from '@angular/router';
import { User } from '../../model/user.interface';
import { UserService } from '../../features/profile/services/user.service';
import { SeverityTagComponent } from '../../service/severity/severity-tag.component';

@Component({
    selector: 'app-projects',
    imports: [CommonModule, FormsModule, SeverityTagComponent],
    templateUrl: './projects.component.html',
    styleUrl: './projects.component.css',
    standalone:true

})

export class ProjectsComponent implements OnInit {
  private userService = inject(UserService);
  private projectsService = inject(ProjectService);
  private router = inject(Router);


  projectDialog: boolean = false
  submitted: boolean = false
  project: Project[] = []
  authors: User[] = []
  selectedProjects!: Project[] | null
  loading: boolean = true;
  error: string | null = null
  currentView: 'table' | 'kanban' | 'calendar' = 'table';
  searchTerm: string = '';



  constructor() { }

  ngOnInit(): void {
    this.getProject()
    this.getUsers()
  }

  navigateToProjectForm() {
    this.router.navigate(['/pages/projects/shared/project-form']);
  }

  navigateToProject(projectId: string) {
    this.router.navigate(['/pages/projects', projectId]);
  }

  openNew() {
    this.submitted = false
    this.projectDialog = true;
  }

  private getProject(): void {
    this.projectsService.getProjectByIdWhereId().pipe(
      tap({
        next: (project: Project[] | null) => {
          if (project) {
            this.project = project
          }
        },
        error: () => this.error = 'Failed to load projects',
        complete: () => this.loading = false
      })
    ).subscribe()
  }

  private getUsers(): void {
    this.userService.getAllUsers().pipe(
      tap({
        next: (authors: User[] | null) => {
          if (authors) {
            this.authors = authors
          }
        },
        error: () => this.error = 'Failed to load projects',
        complete: () => this.loading = false
      })
    ).subscribe()
  }

  filterGlobal(event: Event): void {
    const input = event.target as HTMLInputElement
    const value = input ? input.value : ''
    this.searchTerm = value.toLowerCase();
    // El filtrado se puede implementar con un pipe en el template o aquí
    // Por ahora, el binding con [(ngModel)] ya actualiza searchTerm
  }

}
