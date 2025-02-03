import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ProjectService } from '../../service/project/project.service';
import { Subscription, tap } from 'rxjs';
import { Project } from '../../model/project.interface';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-project-list',
    imports: [CommonModule, NgFor, NgIf],
    templateUrl: './project-list.component.html',
    styleUrl: './project-list.component.css',
    standalone:true

})
export class ProjectListComponent implements OnInit {

  @Input() workspace: string | null = null

  projects: Project[] = []
  loading: boolean = true
  error: string | null = null
  private projectsSubscription: Subscription = new Subscription()

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
      this.projectsSubscription = this.projectService.projects$.subscribe({
        next: (projects) => {
          this.projects = projects;
          this.loading = false;
        },
        error: () => {
          this.error = 'Failed to load projects';
          this.loading = false;
        },
      });

      this.projectService.getProjectByWorkspaceId(this.workspace);
    }
  }

  navigateToProject(projectId: string): void {
    this.router.navigate(['/pages', this.workspace,  projectId])

  }

  private getProjectByWorkspaceId(workspaceId: string): void {
    this.projectService.getProjectByWorkspaceId(workspaceId).pipe(
      tap({
        next: (projects: Project[] | null) => {
          if (projects) {
            this.projects = projects
            console.log(projects)
          }
        },
        error: () => this.error = 'Failed to load projects',
        complete: () => this.loading = false
      })
    ).subscribe()
  }

  ngOnDestroy(): void {
    if (this.projectsSubscription) {
      this.projectsSubscription.unsubscribe();
    }
  }
}
