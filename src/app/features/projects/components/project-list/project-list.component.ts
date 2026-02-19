import { Component, Input, OnInit, SimpleChanges, OnChanges, OnDestroy, inject } from '@angular/core';
import { ProjectService } from '../../data-access/project.service';
import { Subscription, tap } from 'rxjs';
import { Project } from '../../../../core/models/project.interface';

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
  private projectsChangedSubscription: Subscription | null = null

  constructor() {

  }

  ngOnInit(): void {
    if (this.workspace) {
      this.getProjectByWorkspaceId(this.workspace);
    }

    // Suscribirse a cambios en los proyectos
    this.projectsChangedSubscription = this.projectService.projects$.subscribe(projects => {
      if (projects && projects.length > 0) {
        // Solo actualizar si los proyectos son del workspace actual
        const belongsToCurrentWorkspace = projects.some(p => p.workspaceId === this.workspace)
        if (belongsToCurrentWorkspace) {
          this.projects = projects
        }
      }
    })
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
    this.router.navigate(['/projects', projectId])
  }

  getStatusClass(status: string | null | undefined): string {
    const normalizedStatus = (status || 'Inactive').toLowerCase();
    switch (normalizedStatus) {
      case 'active':
        return 'status-active';
      case 'completed':
        return 'status-completed';
      case 'ongoing':
        return 'status-ongoing';
      default:
        return 'status-inactive';
    }
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
    if (this.projectsChangedSubscription) {
      this.projectsChangedSubscription.unsubscribe();
    }
  }
}
