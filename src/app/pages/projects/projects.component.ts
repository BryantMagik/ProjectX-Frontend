import {
  Component, OnInit,
  ViewChild
} from '@angular/core';
import { CommonModule, NgFor, NgClass } from '@angular/common';
import { ProjectService } from '../../service/project/project.service';
import { tap } from 'rxjs';
import { Project } from '../../model/project.interface';
import { Router } from '@angular/router';
import { Table, TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';
import { MultiSelectModule } from 'primeng/multiselect';
import { User } from '../../model/user.interface';
import { UserService } from '../../service/user/user.service';
import { SeverityTagComponent } from '../../service/severity/severety,project';

@Component({
    selector: 'app-projects',
    imports: [CommonModule, TableModule, ToolbarModule, ToastModule, ButtonModule, FormsModule, TagModule, MultiSelectModule, SeverityTagComponent],
    templateUrl: './projects.component.html',
    styleUrl: './projects.component.css',
    standalone:true

})

export class ProjectsComponent implements OnInit {

  @ViewChild('dt') dt!: Table;

  projectDialog: boolean = false
  submitted: boolean = false
  project: Project[] = []
  authors: User[] = []
  selectedProjects!: Project[] | null
  loading: boolean = true;
  error: string | null = null


  constructor(
    private userService: UserService,
    private projectsService: ProjectService,
    private router: Router

  ) { }

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
    this.dt.filterGlobal(value, 'contains')
  }

}
