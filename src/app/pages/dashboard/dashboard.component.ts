
import { Component, Input, OnInit, inject } from '@angular/core';
import { ProjectCardComponent } from "../../components/project-card/project-card.component";
import { Project } from '../../model/project.interface';
import { ProjectService } from '../../features/projects/services/project.service';
import { Subscription, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ModalCreateProjectComponent } from "../../shared/modal-create-project/modal-create-project.component";

@Component({
    selector: 'app-dashboard',
    imports: [ProjectCardComponent, ModalCreateProjectComponent],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css',
    standalone: true
})
export class DashboardComponent implements OnInit {
  private projectService = inject(ProjectService);
  private route = inject(ActivatedRoute);


  projects: Project[] = []
  loading: boolean = true
  error: string | null = null
  workspaceId: string | null = null
  routeSub: Subscription | null = null
  showModal = false;


  constructor() {

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

  openModal() {
    this.showModal = true;
  }
  closeModal() {
    this.showModal = false;
  }

}
