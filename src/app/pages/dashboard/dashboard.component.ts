import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ProjectCardComponent } from "../../components/project-card/project-card.component";
import { Project } from '../../model/project.interface';
import { ProjectService } from '../../service/project/project.service';
import { Subscription, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-dashboard',
    imports: [CommonModule, ProjectCardComponent],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  projects: Project[] = []
  loading: boolean = true
  error: string | null = null
  workspaceId: string | null = null
  routeSub: Subscription | null = null

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,

  ) {

  }

  ngOnInit(): void {
    this.routeSub = this.route.parent?.paramMap.subscribe(params => {
      this.workspaceId = params.get('workspaceId')
      if (this.workspaceId) {
        this.getProjectByWorkspaceId(this.workspaceId)
      }
    }) || null
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
