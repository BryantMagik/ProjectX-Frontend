import { Component, inject, effect, computed } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TaskService } from '../../data-access/task.service';
import { UserService } from '../../../profile/data-access/user.service';
import { Task } from '../../../../core/models/task.interface';
import { Project } from '../../../../core/models/project.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TasksBoardComponent } from '../../components/tasks-board/tasks-board.component';
import { ProjectService } from '../../../projects/data-access/project.service';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-tasks',
    imports: [CommonModule, FormsModule, TasksBoardComponent],
    templateUrl: './tasks.component.html',
    styleUrl: './tasks.component.css',
    standalone: true
})
export class TasksComponent {
  private userService = inject(UserService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private taskService = inject(TaskService);
  private projectService = inject(ProjectService);

  private params = toSignal(this.route.paramMap);
  projectId = computed(() => this.params()?.get('projectId') ?? null);

  // UI state
  filteredTasks: Task[] = [];
  searchTerm = '';
  selectedStatus = 'all';
  selectedPriority = 'all';
  selectedProjectId: string | null = null;
  showKanban = false;
  showProjectModal = false;

  tasksQuery = injectQuery(() => ({
    queryKey: ['tasks', 'own'],
    queryFn: () => firstValueFrom(this.taskService.getTasksByIdWhereId()),
  }));

  usersQuery = injectQuery(() => ({
    queryKey: ['users'],
    queryFn: () => firstValueFrom(this.userService.getAllUsers()),
  }));

  projectsQuery = injectQuery(() => ({
    queryKey: ['projects', 'own'],
    queryFn: () => firstValueFrom(this.projectService.getProjectByIdWhereId()),
  }));

  projectQuery = injectQuery(() => ({
    queryKey: ['projects', this.projectId()],
    queryFn: () => firstValueFrom(this.projectService.getProjectById(this.projectId()!)),
    enabled: !!this.projectId(),
  }));

  get loading(): boolean { return this.tasksQuery.isPending(); }
  get error(): string | null { return this.tasksQuery.isError() ? 'Failed to load tasks' : null; }
  get projects(): Project[] { return (this.projectsQuery.data() ?? []) as Project[]; }

  constructor() {
    effect(() => {
      const tasks = this.tasksQuery.data();
      if (tasks) this.applyFilters(tasks);
    });

    effect(() => {
      const pid = this.projectId();
      if (pid) this.selectedProjectId = pid;
    });
  }

  navigateToTaskDetails(taskId: string): void {
    this.router.navigate(['/tasks', taskId]);
  }

  private applyFilters(tasks: Task[]): void {
    const search = this.searchTerm.toLowerCase();
    this.filteredTasks = tasks.filter(task => {
      const matchesSearch = !this.searchTerm ||
        task.code?.toLowerCase().includes(search) ||
        task.summary?.toLowerCase().includes(search);
      const matchesStatus = this.selectedStatus === 'all' || task.status === this.selectedStatus;
      const matchesPriority = this.selectedPriority === 'all' || task.priority === this.selectedPriority;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }

  onSearchChange(): void { this.applyFilters(this.tasksQuery.data() ?? []); }
  onStatusChange(): void { this.applyFilters(this.tasksQuery.data() ?? []); }
  onPriorityChange(): void { this.applyFilters(this.tasksQuery.data() ?? []); }

  getPriorityClass(priority: string): string {
    const map: Record<string, string> = {
      'critical': 'priority-critical', 'high': 'priority-high',
      'medium': 'priority-medium', 'low': 'priority-low',
    };
    return map[priority?.toLowerCase()] || 'priority-low';
  }

  getPriorityBorderClass(priority: string): string {
    const map: Record<string, string> = {
      'critical': 'border-critical', 'high': 'border-high',
      'medium': 'border-medium', 'low': 'border-low',
    };
    return map[priority?.toLowerCase()] || 'border-low';
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      'backlog': 'status-backlog', 'todo': 'status-todo',
      'in_progress': 'status-in-progress', 'blocked': 'status-blocked',
      'review': 'status-review', 'testing': 'status-testing',
      'done': 'status-done', 'cancelled': 'status-cancelled',
    };
    return map[status?.toLowerCase()] || 'status-backlog';
  }

  getActiveTasksCount(): number {
    return (this.tasksQuery.data() ?? []).filter(t =>
      t.status === 'IN_PROGRESS' || t.status === 'REVIEW' || t.status === 'TESTING'
    ).length;
  }

  getCompletedTasksCount(): number {
    return (this.tasksQuery.data() ?? []).filter(t => t.status === 'DONE').length;
  }

  getHighPriorityTasksCount(): number {
    return (this.tasksQuery.data() ?? []).filter(t =>
      t.priority === 'HIGH' || t.priority === 'CRITICAL'
    ).length;
  }

  toggleKanban(): void { this.showKanban = !this.showKanban; }

  openCreateTaskModal(): void { this.showProjectModal = true; }
  closeCreateTaskModal(): void { this.showProjectModal = false; }

  confirmCreateTask(): void {
    const projectId = this.selectedProjectId || this.projectId();
    if (projectId) {
      this.showProjectModal = false;
      this.router.navigate(['/tasks/new'], { queryParams: { projectId } });
    }
  }
}
