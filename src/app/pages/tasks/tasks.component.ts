import { CommonModule, NgClass, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TaskService } from '../../service/task/task.service';
import { AuthService } from '../../service/auth/auth.service';
import { UserService } from '../../service/user/user.service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [NgFor, CommonModule, NgClass],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent {

  constructor(
    private userService: UserService,
    private router: Router,
    private taskService: TaskService,
  ) { }

  ngOnInit(): void {
    //TODO:: COMPLETE THE NEW METHODS
  }

  navigateToTaskForm() {
    this.router.navigate(['/pages/tasks/shared/tasks-form']);
  }

  private getTask(): void {

  }


}
