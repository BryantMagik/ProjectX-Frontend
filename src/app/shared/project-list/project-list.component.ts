import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ProjectService } from '../../service/project/project.service';
import { tap } from 'rxjs';
import { Project } from '../../model/project.interface';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-project-list',
    imports: [CommonModule, NgFor, NgIf],
    templateUrl: './project-list.component.html',
    styleUrl: './project-list.component.css'
})
export class ProjectListComponent implements OnInit {

  @Input() workspace: string | null = null

  projects: Project[] = []
  loading: boolean = true
  error: string | null = null

  constructor(
    private projectService: ProjectService,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    if (this.workspace) {
      this.getProjectByWorkspaceId(this.workspace);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['workspace']) {
      this.loadProjects()
    }
  }
  private loadProjects(): void {
    if (this.workspace) {
      this.getProjectByWorkspaceId(this.workspace);
    }
  }

  navigateToProject(projectId: string): void {
    this.router.navigate(['/pages', this.workspace,  projectId]);

  }

  private getProjectByWorkspaceId(workspaceId: string): void {
    this.projectService.getProjectByWorkspaceId(workspaceId).pipe(
      tap({
        next: (projects: Project[] | null) => {
          if (projects) {
            this.projects = projects
          }
        },
        error: () => this.error = 'Failed to load projects',
        complete: () => this.loading = false
      })
    ).subscribe()
  }
}
