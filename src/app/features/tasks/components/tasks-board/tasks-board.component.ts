import { Component, inject, effect, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../data-access/task.service';
import { Task } from '../../../../core/models/task.interface';
import { Router } from '@angular/router';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { injectQuery, injectMutation } from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';

interface KanbanColumn {
  id: string;
  title: string;
  status: string;
  tasks: Task[];
  color: string;
}

@Component({
    selector: 'app-tasks-board',
    imports: [CommonModule, DragDropModule],
    templateUrl: './tasks-board.component.html',
    styleUrl: './tasks-board.component.css',
    standalone: true
})
export class TasksBoardComponent {
  private taskService = inject(TaskService);
  private router = inject(Router);

  projectId = input<string | null | undefined>(null);

  columns: KanbanColumn[] = [
    { id: 'backlog',     title: 'Backlog',      status: 'BACKLOG',      tasks: [], color: '#64748b' },
    { id: 'todo',        title: 'To Do',         status: 'TODO',         tasks: [], color: '#8b5cf6' },
    { id: 'in-progress', title: 'In Progress',   status: 'IN_PROGRESS',  tasks: [], color: '#3b82f6' },
    { id: 'review',      title: 'Review',        status: 'REVIEW',       tasks: [], color: '#f59e0b' },
    { id: 'done',        title: 'Done',          status: 'DONE',         tasks: [], color: '#10b981' },
  ];

  tasksQuery = injectQuery(() => {
    const pid = this.projectId();
    return {
      queryKey: pid ? ['tasks', 'project', pid] : ['tasks', 'own'],
      queryFn: () => firstValueFrom(
        pid ? this.taskService.getTaskByProjectId(pid) : this.taskService.getTasks()
      ),
    };
  });

  updateTaskMutation = injectMutation(() => ({
    mutationFn: ({ taskId, status }: { taskId: string; status: string }) =>
      firstValueFrom(this.taskService.updateTask({ status }, taskId)),
    onError: () => {
      this.distributeTasksToColumns(this.tasksQuery.data() ?? []);
    },
  }));

  get loading(): boolean { return this.tasksQuery.isPending(); }
  get error(): string | null { return this.tasksQuery.isError() ? 'Failed to load tasks' : null; }

  constructor() {
    effect(() => {
      const tasks = this.tasksQuery.data();
      if (tasks) this.distributeTasksToColumns(tasks);
    });
  }

  private distributeTasksToColumns(tasks: Task[]): void {
    this.columns.forEach(col => col.tasks = []);
    tasks.forEach(task => {
      const col = this.columns.find(c =>
        c.status.toLowerCase() === (task.status?.trim() || '').toLowerCase()
      );
      (col ?? this.columns[0]).tasks.push(task);
    });
  }

  drop(event: CdkDragDrop<Task[]>, targetColumn: KanbanColumn): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const task = event.previousContainer.data[event.previousIndex];
      const previousStatus = task.status;

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      task.status = targetColumn.status;

      this.updateTaskMutation.mutate(
        { taskId: task.id, status: targetColumn.status },
        {
          onError: () => {
            task.status = previousStatus;
            this.distributeTasksToColumns(this.tasksQuery.data() ?? []);
          }
        }
      );
    }
  }

  getPriorityColor(priority: string): string {
    const map: Record<string, string> = {
      'LOW': 'priority-low', 'MEDIUM': 'priority-medium',
      'HIGH': 'priority-high', 'URGENT': 'priority-urgent',
    };
    return map[priority.toUpperCase()] || 'priority-medium';
  }

  getPriorityBorderClass(priority: string): string {
    const map: Record<string, string> = {
      'LOW': 'border-low', 'MEDIUM': 'border-medium',
      'HIGH': 'border-high', 'URGENT': 'border-urgent',
    };
    return map[priority?.toUpperCase()] || 'border-medium';
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      'BACKLOG': 'status-backlog', 'TODO': 'status-todo',
      'IN_PROGRESS': 'status-inprogress', 'REVIEW': 'status-review',
      'DONE': 'status-done',
    };
    return map[status?.toUpperCase()] || 'status-todo';
  }

  getConnectedLists(currentColumnId: string): string[] {
    return this.columns.filter(col => col.id !== currentColumnId).map(col => col.id);
  }

  navigateToTask(taskId: string): void {
    this.router.navigate(['/tasks', taskId]);
  }
}
