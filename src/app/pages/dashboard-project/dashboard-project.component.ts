import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../service/project/project.service';
import { Subscription, tap } from 'rxjs';
import { Project } from '../../model/project.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from '../../model/task.interface';
import { TaskService } from '../../service/task/task.service';
import { SeverityTagComponent } from '../../service/severity/severity-tag.component';

@Component({
  selector: 'app-dashboard-project',
  imports: [CommonModule, FormsModule, SeverityTagComponent],
  templateUrl: './dashboard-project.component.html',
  styleUrl: './dashboard-project.component.css',
  standalone: true
})
export class DashboardProjectComponent implements OnInit {
  private projectService = inject(ProjectService);
  private taskService = inject(TaskService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  routeSub: Subscription | null = null
  projectId: string | null = null
  workspaceId: string | null = null
  project: Project | null = null
  task: Task[] = []
  loading: boolean = true
  error: string | null = null
  currentView: 'table' | 'kanban' | 'calendar' = 'table'
  searchTerm: string = ''

  constructor() {}

  navigateToEditProject() {
    if (this.projectId) {
      this.router.navigate(['/pages/projects/subpages/edit-project', this.projectId]);
    }
  }

  navigateToNewTask() {
    console.log('navigateToNewTask called, projectId:', this.projectId);
    if (this.projectId) {
      this.router.navigate(['/pages/tasks/shared/tasks-form'], {
        queryParams: { projectId: this.projectId }
      });
    } else {
      console.warn('No projectId available');
    }
  }

  navigateToTask(taskId: string) {
    if (taskId) {
      this.router.navigate(['/pages/tasks', taskId]);
    }
  }

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe(params => {
      this.workspaceId = params.get('workspaceId')
      this.projectId = params.get('projectId')
      console.log('Route params - workspaceId:', this.workspaceId, 'projectId:', this.projectId)
      if (this.projectId) {
        this.getProjectById(this.projectId)
        this.getTaskByProjectId(this.projectId)
      }
    })
  }


  private getProjectById(projectId: string): void {
    this.projectService.getProjectById(projectId).pipe(
      tap({
        next: (project: Project | null) => {
          console.log(project)
          this.project = project
          this.loading = false
        },
        error: () => this.error = 'Failed to load projects',
        complete: () => this.loading = false
      })
    ).subscribe()
  }

  private getTaskByProjectId(projectId: string): void {
    this.taskService.getTaskByProjectId(projectId).pipe(
      tap({
        next: (tasks: Task[] | null) => {
          if (tasks) {
            this.task = tasks
            this.loading = false
          }
        },
        error: () => this.error = 'Failed to load tasks',
        complete: () => this.loading = false
      })
    ).subscribe()
  }
}
