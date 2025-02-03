import { Component, OnInit, ViewChild } from '@angular/core';
import { ProjectService } from '../../service/project/project.service';
import { Subscription, tap } from 'rxjs';
import { Project } from '../../model/project.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'primeng/tabs';
import { Table, TableModule } from 'primeng/table';
import { Task } from '../../model/task.interface';
import { TaskService } from '../../service/task/task.service';
import { TasksTableComponent } from "../../shared/tasks-table/tasks-table.component";
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-dashboard-project',
  imports: [CommonModule, TabsModule, TableModule, TasksTableComponent, ToolbarModule, ButtonModule],
  templateUrl: './dashboard-project.component.html',
  styleUrl: './dashboard-project.component.css',
  standalone: true
})
export class DashboardProjectComponent implements OnInit {

  @ViewChild('dt') dt!: Table

  routeSub: Subscription | null = null
  projectId: string | null = null
  project: Project | null = null
  task: Task[] = []
  loading: boolean = true
  error: string | null = null

  constructor(
    private projectService: ProjectService,
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router

  ) {

  }

  navigateToEditProject() {
    if (this.projectId) {
      this.router.navigate(['/pages/projects/subpages/edit-project', this.projectId]);
    }
  }

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe(params => {
      this.projectId = params.get('projectId')
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

  filterGlobal(event: Event): void {
    const input = event.target as HTMLInputElement
    const value = input ? input.value : ''
    this.dt.filterGlobal(value, 'contains')
  }
}
