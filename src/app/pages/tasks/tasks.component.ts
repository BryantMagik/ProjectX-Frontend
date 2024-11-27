import { CommonModule, NgClass, NgFor } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TaskService } from '../../service/task/task.service';
import { AuthService } from '../../service/auth/auth.service';
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
import { SeverityTagComponent } from "../../service/severity/severety,project";

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, TableModule, ToolbarModule, ToastModule, ButtonModule, FormsModule, TagModule, MultiSelectModule, SeverityTagComponent],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent implements OnInit {

  @ViewChild('dt') dt!: Table;
  task: Task[] = []
  authors: User[] = []
  error: string | null = null
  loading: boolean = true;
  selectedTask!: Task[] | null

  constructor(
    private userService: UserService,
    private router: Router,
    private taskService: TaskService,
  ) { }

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
