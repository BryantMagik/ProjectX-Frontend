import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TaskService } from '../../service/task/task.service';
import { UserService } from '../../service/user/user.service';
import { Task } from '../../model/task.interface';
import { tap } from 'rxjs';
import { User } from '../../model/user.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-tasks',
    imports: [
        CommonModule,
        FormsModule
    ],
    templateUrl: './tasks.component.html',
    styleUrl: './tasks.component.css',
    standalone:true
})
export class TasksComponent implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);
  private taskService = inject(TaskService);

  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  authors: User[] = [];
  error: string | null = null;
  loading: boolean = true;
  searchTerm: string = '';
  selectedStatus: string = 'all';
  selectedPriority: string = 'all';

  constructor() { }

  ngOnInit(): void {
    this.getTask();
    this.getUsers();
  }

  navigateToTaskForm() {
    this.router.navigate(['/pages/tasks/shared/tasks-form']);
  }

  navigateToTaskDetails(taskId: string) {
    this.router.navigate(['/pages/tasks/subpages/tasks-details', taskId]);
  }

  private getTask(): void {
    this.taskService.getTasksByIdWhereId().pipe(
      tap({
        next: (task: Task[] | null) => {
          if (task) {
            this.tasks = task;
            this.filteredTasks = task;
            console.log(this.tasks);
          }
        },
        error: () => this.error = 'Failed to load tasks',
        complete: () => this.loading = false
      })
    ).subscribe();
  }

  private getUsers(): void {
    this.userService.getAllUsers().pipe(
      tap({
        next: (authors: User[] | null) => {
          if(authors){
            this.authors = authors;
            console.log("Authors", authors);
          }
        },
        error: (err) => {
          console.warn('Could not load users:', err);
          // No mostrar error si solo fallan los usuarios
          // this.error = 'Failed to load users';
        }
      })
    ).subscribe();
  }

  filterTasks(): void {
    this.filteredTasks = this.tasks.filter(task => {
      const matchesSearch = !this.searchTerm ||
        task.code?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        task.summary?.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesStatus = this.selectedStatus === 'all' || task.status === this.selectedStatus;
      const matchesPriority = this.selectedPriority === 'all' || task.priority === this.selectedPriority;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }

  onSearchChange(): void {
    this.filterTasks();
  }

  onStatusChange(): void {
    this.filterTasks();
  }

  onPriorityChange(): void {
    this.filterTasks();
  }

  getPriorityClass(priority: string): string {
    const priorityMap: { [key: string]: string } = {
      'high': 'priority-high',
      'medium': 'priority-medium',
      'low': 'priority-low'
    };
    return priorityMap[priority?.toLowerCase()] || 'priority-low';
  }

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'completed': 'status-completed',
      'active': 'status-active',
      'ongoing': 'status-ongoing',
      'inactive': 'status-inactive'
    };
    return statusMap[status?.toLowerCase()] || 'status-inactive';
  }

  getActiveTasksCount(): number {
    return this.tasks.filter(t => t.status === 'Active' || t.status === 'Ongoing').length;
  }

  getCompletedTasksCount(): number {
    return this.tasks.filter(t => t.status === 'Completed').length;
  }

  getHighPriorityTasksCount(): number {
    return this.tasks.filter(t => t.priority?.toLowerCase() === 'high').length;
  }
}
