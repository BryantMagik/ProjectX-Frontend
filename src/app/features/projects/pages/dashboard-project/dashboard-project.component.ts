import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../data-access/project.service';
import { Subscription, tap } from 'rxjs';
import { Project } from '../../../../core/models/project.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from '../../../../core/models/task.interface';
import { TaskService } from '../../../../service/task/task.service';
import { SeverityTagComponent } from '../../../../service/severity/severity-tag.component';
import { TasksBoardComponent } from '../../../tasks/components/tasks-board/tasks-board.component';
import { Issue } from '../../../../core/models/issue.interface';
import { IssueService } from '../../../issues/data-access/issue.service';

@Component({
  selector: 'app-dashboard-project',
  imports: [CommonModule, FormsModule, SeverityTagComponent, TasksBoardComponent],
  templateUrl: './dashboard-project.component.html',
  styleUrl: './dashboard-project.component.css',
  standalone: true
})
export class DashboardProjectComponent implements OnInit {
  private projectService = inject(ProjectService);
  private taskService = inject(TaskService);
  private issueService = inject(IssueService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  routeSub: Subscription | null = null
  projectId: string | null = null
  workspaceId: string | null = null
  project: Project | null = null
  task: Task[] = []
  issues: Issue[] = []
  loading: boolean = true
  error: string | null = null
  issuesLoading: boolean = true
  issuesError: string | null = null
  currentView: 'table' | 'kanban' | 'calendar' = 'table'
  searchTerm: string = ''

  constructor() {}

  navigateToEditProject() {
    if (this.projectId) {
      this.router.navigate(['/projects', this.projectId, 'edit']);
    }
  }

  navigateToNewTask() {
    console.log('navigateToNewTask called, projectId:', this.projectId);
    if (this.projectId) {
      this.router.navigate(['/tasks/new'], {
        queryParams: { projectId: this.projectId }
      });
    } else {
      console.warn('No projectId available');
    }
  }

  navigateToTask(taskId: string) {
    if (taskId) {
      this.router.navigate(['/tasks', taskId]);
    }
  }

  navigateToIssue(issueId?: string) {
    if (issueId) {
      this.router.navigate(['/issues', issueId]);
    }
  }

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe(params => {
      this.projectId = params.get('projectId')
      console.log('Route params - projectId:', this.projectId)
      if (this.projectId) {
        this.getProjectById(this.projectId)
        this.getTaskByProjectId(this.projectId)
        this.getIssuesByProjectId(this.projectId)
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

  private getIssuesByProjectId(projectId: string): void {
    this.issuesLoading = true;
    this.issuesError = null;

    this.issueService.getAllIssues().pipe(
      tap({
        next: (issues: Issue[] | null) => {
          this.issues = (issues || []).filter((issue) => issue.projectId === projectId);
          this.issuesLoading = false;
        },
        error: () => {
          this.issuesError = 'Failed to load issues';
          this.issuesLoading = false;
        }
      })
    ).subscribe();
  }

  get filteredTasks(): Task[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      return this.task;
    }

    return this.task.filter((t) =>
      (t.name || '').toLowerCase().includes(term) ||
      (t.code || '').toLowerCase().includes(term) ||
      (t.status || '').toLowerCase().includes(term) ||
      (t.priority || '').toLowerCase().includes(term) ||
      (t.creator?.first_name || '').toLowerCase().includes(term)
    );
  }

  get filteredIssues(): Issue[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      return this.issues;
    }

    return this.issues.filter((issue) =>
      (issue.summary || '').toLowerCase().includes(term) ||
      (issue.code || '').toLowerCase().includes(term) ||
      (issue.status || '').toLowerCase().includes(term) ||
      (issue.priority || '').toLowerCase().includes(term) ||
      (issue.reporter?.first_name || '').toLowerCase().includes(term)
    );
  }
}
