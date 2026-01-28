import { NgClass } from '@angular/common';
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TaskService } from '../../service/task/task.service';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../service/user/user.service';
import { ToolbarModule } from 'primeng/toolbar';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';
import { MultiSelectModule } from 'primeng/multiselect';
import { Task } from '../../model/task.interface';
import { tap } from 'rxjs';
import { User } from '../../model/user.interface';
import { SeverityTagComponent } from "../../service/severity/severity-tag.component";

@Component({
    selector: 'app-tasks',
    imports: [TableModule, ToolbarModule, ToastModule, ButtonModule, FormsModule, TagModule, MultiSelectModule, SeverityTagComponent],
    templateUrl: './tasks.component.html',
    styleUrl: './tasks.component.css',
    standalone:true
})
export class TasksComponent implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);
  private taskService = inject(TaskService);


  @ViewChild('dt') dt!: Table;
  task: Task[] = []
  authors: User[] = []
  error: string | null = null
  loading: boolean = true;
  selectedTask!: Task[] | null

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() { }

  ngOnInit(): void {
    this.getTask()
    this.getUsers()
  }

  navigateToTaskForm() {
    this.router.navigate(['/pages/tasks/shared/tasks-form']);
  }

  private getTask(): void {
    this.taskService.getTasksByIdWhereId().pipe(
      tap({
        next: (task: Task[] | null) => {
          if (task) {
            this.task = task;
            console.log(this.task)
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
            this.authors = authors
            console.log("Authores",authors)
          }
        },
        error: () => this.error = 'Failed to load projects',
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
