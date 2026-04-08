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
    standalone: true
})
export class ProjectListComponent implements OnInit, OnChanges, OnDestroy {
  private projectService = inject(ProjectService);
  private router = inject(Router);

  @Input() workspace: string | null = null;

  projects: Project[] = [];
  loading = true;
  error: string | null = null;
  private projectsSub: Subscription | null = null;

  ngOnInit(): void {
    if (this.workspace) {
      this.loadProjects(this.workspace);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['workspace'] && !changes['workspace'].firstChange) {
      const id = changes['workspace'].currentValue;
      if (id) {
        this.loading = true;
        this.projects = [];
        this.loadProjects(id);
      }
    }
  }

  navigateToProject(projectId: string): void {
    this.router.navigate(['/projects', projectId]);
  }

  getStatusClass(status: string | null | undefined): string {
    const s = (status || 'inactive').toLowerCase();
    const map: Record<string, string> = { active: 'status-active', completed: 'status-completed', ongoing: 'status-ongoing' };
    return map[s] ?? 'status-inactive';
  }

  private loadProjects(workspaceId: string): void {
    this.projectsSub?.unsubscribe();
    this.projectsSub = this.projectService.getProjectByWorkspaceId(workspaceId).pipe(
      tap({
        next: (projects) => {
          this.projects = projects ?? [];
        },
        error: () => {
          this.error = 'Failed to load projects';
          this.projects = [];
        },
        complete: () => { this.loading = false; }
      })
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.projectsSub?.unsubscribe();
  }
}
