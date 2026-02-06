import { Component, OnInit, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../data-access/task.service';
import { Task } from '../../../../core/models/task.interface';
import { tap } from 'rxjs';
import { Router } from '@angular/router';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

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
export class TasksBoardComponent implements OnInit {
  private taskService = inject(TaskService);
  private router = inject(Router);

  @Input() projectId?: string | null;

  tasks: Task[] = [];
  loading: boolean = true;
  error: string | null = null;
  currentWorkspaceId: string | null = null;

  columns: KanbanColumn[] = [
    { id: 'backlog', title: 'Backlog', status: 'BACKLOG', tasks: [], color: '#64748b' },
    { id: 'todo', title: 'To Do', status: 'TODO', tasks: [], color: '#8b5cf6' },
    { id: 'in-progress', title: 'In Progress', status: 'IN_PROGRESS', tasks: [], color: '#3b82f6' },
    { id: 'review', title: 'Review', status: 'REVIEW', tasks: [], color: '#f59e0b' },
    { id: 'done', title: 'Done', status: 'DONE', tasks: [], color: '#10b981' }
  ];

  ngOnInit(): void {
    this.getCurrentWorkspace();
    this.getTasks();
  }

  private getCurrentWorkspace(): void {
    const userId = sessionStorage.getItem('userId');
    const storageKey = userId ? `workspace_${userId}` : 'selectedWorkspaceId';
    this.currentWorkspaceId = sessionStorage.getItem(storageKey);
  }

  private getTasks(): void {
    const tasksObservable = this.projectId
      ? this.taskService.getTaskByProjectId(this.projectId)
      : this.taskService.getTasks();

    tasksObservable.pipe(
      tap({
        next: (tasks: Task[] | null) => {
          if (tasks) {
            this.tasks = tasks;
            this.distributeTasksToColumns(tasks);
            console.log('Tasks loaded for kanban:', tasks);
          }
        },
        error: (err) => {
          console.error('Error loading tasks:', err);
          this.error = 'Failed to load tasks';
          this.loading = false;
        },
        complete: () => this.loading = false
      })
    ).subscribe();
  }

  private distributeTasksToColumns(tasks: Task[]): void {
    // Limpiar columnas
    this.columns.forEach(col => col.tasks = []);

    // Distribuir tareas según su estado
    tasks.forEach(task => {
      const taskStatus = task.status?.trim() || '';
      const column = this.columns.find(col =>
        col.status.toLowerCase() === taskStatus.toLowerCase()
      );

      if (column) {
        column.tasks.push(task);
      } else {
        // Si no coincide con ningún estado, poner en la primera columna por defecto
        console.warn(`Task ${task.id} has unknown status: ${taskStatus}, adding to first column`);
        this.columns[0].tasks.push(task);
      }
    });

    console.log('Tasks distributed:', this.columns.map(c => ({ title: c.title, count: c.tasks.length })));
  }

  drop(event: CdkDragDrop<Task[]>, targetColumn: KanbanColumn): void {
    if (event.previousContainer === event.container) {
      // Reordenar dentro de la misma columna
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Mover entre columnas
      const task = event.previousContainer.data[event.previousIndex];
      const previousStatus = task.status;

      // Actualizar UI inmediatamente (optimistic update)
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      // Actualizar el estado local de la tarea inmediatamente
      task.status = targetColumn.status;

      // Actualizar el estado de la tarea en el backend
      this.updateTaskStatus(task, targetColumn.status, previousStatus);
    }
  }

  private updateTaskStatus(task: Task, newStatus: string, previousStatus: string): void {
    // Enviar solo el campo que cambió
    const updatePayload = { status: newStatus };

    console.log('Updating task:', {
      taskId: task.id,
      previousStatus: previousStatus,
      newStatus: newStatus,
      payload: updatePayload
    });

    this.taskService.updateTask(updatePayload, task.id).subscribe({
      next: (updatedTask) => {
        console.log(`Task ${task.id} updated successfully to ${updatedTask.status}`);
        // La tarea ya está actualizada en la UI, solo confirmamos
      },
      error: (err) => {
        console.error('Error updating task status:', err);
        console.error('Error details:', err.error);
        // En caso de error, revertir el cambio visual
        task.status = previousStatus;
        this.distributeTasksToColumns(this.tasks);
      }
    });
  }

  getPriorityColor(priority: string): string {
    const priorityMap: { [key: string]: string } = {
      'LOW': 'priority-low',
      'MEDIUM': 'priority-medium',
      'HIGH': 'priority-high',
      'URGENT': 'priority-urgent'
    };
    return priorityMap[priority.toUpperCase()] || 'priority-medium';
  }

  getConnectedLists(currentColumnId: string): string[] {
    return this.columns
      .filter(col => col.id !== currentColumnId)
      .map(col => col.id);
  }

  navigateToTask(taskId: string): void {
    this.router.navigate(['/tasks', taskId]);
  }
}
