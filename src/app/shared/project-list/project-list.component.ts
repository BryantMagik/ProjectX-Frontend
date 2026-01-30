import { Component, Input, OnInit, SimpleChanges, OnChanges, OnDestroy, inject } from '@angular/core';
import { ProjectService } from '../../service/project/project.service';
import { Subscription, tap } from 'rxjs';
import { Project } from '../../model/project.interface';

import { Router } from '@angular/router';

@Component({
    selector: 'app-project-list',
    imports: [],
    templateUrl: './project-list.component.html',
    styleUrl: './project-list.component.css',
    standalone:true

})
export class ProjectListComponent implements OnInit, OnChanges, OnDestroy {
  private projectService = inject(ProjectService);
  private router = inject(Router);


  @Input() workspace: string | null = null

  projects: Project[] = []
  loading: boolean = true
  error: string | null = null
  private projectsSubscription: Subscription = new Subscription()

  constructor() {

  }

  ngOnInit(): void {
    if (this.workspace) {
      this.getProjectByWorkspaceId(this.workspace);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['workspace'] && !changes['workspace'].firstChange) {
      const newWorkspaceId = changes['workspace'].currentValue;
      if (newWorkspaceId) {
        this.loading = true;
        this.projects = [];
        this.getProjectByWorkspaceId(newWorkspaceId);
      }
    }
  }

  navigateToProject(projectId: string): void {
    this.router.navigate(['/pages', this.workspace,  projectId])
  }

  private getProjectByWorkspaceId(workspaceId: string): void {
    // Limpiar la suscripción anterior si existe
    if (this.projectsSubscription) {
      this.projectsSubscription.unsubscribe();
    }

    this.projectsSubscription = this.projectService.getProjectByWorkspaceId(workspaceId).pipe(
      tap({
        next: (projects: Project[] | null) => {
          if (projects) {
            this.projects = projects
            console.log('Projects loaded for workspace:', workspaceId, projects)
          }
        },
        error: () => {
          this.error = 'Failed to load projects'
          this.projects = []
        },
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
