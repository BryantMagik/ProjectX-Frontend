
import { Component, Input, OnInit, inject } from '@angular/core';
import { ProjectCardComponent } from "../../components/project-card/project-card.component";
import { Project } from '../../model/project.interface';
import { ProjectService } from '../../features/projects/services/project.service';
import { Subscription, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ModalCreateProjectComponent } from "../../shared/modal-create-project/modal-create-project.component";
import { TaskService } from '../../service/task/task.service';
import { NgStyle,UpperCasePipe,NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
@Component({
    selector: 'app-dashboard',
    imports: [ProjectCardComponent, ModalCreateProjectComponent,NgStyle,UpperCasePipe,NgClass,RouterLink],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css',
    standalone: true
})
export class DashboardComponent implements OnInit {
  private projectService = inject(ProjectService);
  private route = inject(ActivatedRoute);
  private taskService = inject(TaskService);


  projects: Project[] = []
  loading: boolean = true
  error: string | null = null
  workspaceId: string | null = null
  routeSub: Subscription | null = null
  showModal = false;

  taskStats = {
    total: 0,
    assigned: 0,
    completed: 0,
    overdue: 0
  };


  constructor() {

  }

  ngOnInit(): void {
    this.loadGlobalMetrics();
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

  private loadGlobalMetrics() {
    this.taskService.getTaskTotalCount().subscribe(res => this.taskStats.total = res.count);
    this.taskService.getTaskAssignedCount().subscribe(res => this.taskStats.assigned = res.count);
    this.taskService.getTaskCompletedCount().subscribe(res => this.taskStats.completed = res.count);
    this.taskService.getTaskOverdueCount().subscribe(res => this.taskStats.overdue = res.count);
  }

  getPercentage(value: number, total: number): string {
  if (total === 0) return '0%';
  return `${Math.round((value / total) * 100)}%`;
}

  getPercentageValue(value: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  }

}
