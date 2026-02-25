import { CommonModule, Location } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../../../core/models/user.interface';
import { UserService } from '../../../profile/data-access/user.service';
import { TaskService } from '../../../../service/task/task.service';

@Component({
  selector: 'app-tasks-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tasks-form.component.html',
  styleUrl: './tasks-form.component.css',
  standalone: true,
})
export class TasksFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private taskService = inject(TaskService);
  private userService = inject(UserService);
  private location = inject(Location);

  taskForm: FormGroup;
  taskId: string | null = null;
  isEditMode = false;
  submitting = false;
  usersLoading = false;
  availableUsers: User[] = [];

  constructor() {
    this.taskForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      code: ['', Validators.required],
      summary: ['', Validators.required],
      description: ['', Validators.required],
      priority: ['', Validators.required],
      task_type: ['', Validators.required],
      status: ['', Validators.required],
      projectId: ['', Validators.required],
      dueTime: [''],
      assignedTo: [[]],
    });

    this.taskForm.get('name')?.valueChanges.subscribe((name) => {
      if (name && !this.isEditMode) {
        const code = this.generateTaskCode(name);
        this.taskForm.patchValue({ code }, { emitEvent: false });
      }
    });
  }

  ngOnInit(): void {
    this.loadUsers();

    this.taskId = this.route.snapshot.paramMap.get('taskId') || this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.taskId;

    this.route.queryParams.subscribe((params) => {
      const projectId = params['projectId'];
      if (projectId) {
        this.taskForm.patchValue({ projectId });
      }
    });

    if (this.isEditMode && this.taskId) {
      this.loadTask(this.taskId);
    }
  }

  private loadUsers(): void {
    this.usersLoading = true;
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.availableUsers = users || [];
        this.usersLoading = false;
      },
      error: () => {
        this.availableUsers = [];
        this.usersLoading = false;
      },
    });
  }

  generateTaskCode(name: string): string {
    const prefix = name.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'X');
    const timestamp = Date.now().toString().slice(-4);
    return `TASK-${prefix}-${timestamp}`;
  }

  loadTask(taskId: string): void {
    this.taskService.getTasksById(taskId).subscribe({
      next: (task) => {
        if (!task) {
          return;
        }

        this.taskForm.patchValue({
          name: task.name,
          code: task.name,
          summary: task.summary,
          description: task.description,
          priority: task.priority,
          task_type: task.task_type,
          status: task.status,
          projectId: task.projectId,
          dueTime: this.formatDateInput(task.dueTime),
          assignedTo: (task.users || []).map((user) => user.id),
        });
      },
      error: (error) => {
        console.error('Error loading task:', error);
        alert('Failed to load task data');
      },
    });
  }

  private formatDateInput(value?: string): string {
    if (!value) {
      return '';
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return '';
    }
    return date.toISOString().split('T')[0];
  }

  onCancel(): void {
    this.location.back();
  }

  onSubmit(): void {
    if (!this.taskForm.valid) {
      Object.keys(this.taskForm.controls).forEach((key) => {
        this.taskForm.get(key)?.markAsTouched();
      });
      alert('Please fill in all required fields');
      return;
    }

    this.submitting = true;
    const formValue = this.taskForm.value;
    const taskData = {
      code: formValue.code,
      summary: formValue.summary,
      description: formValue.description,
      priority: formValue.priority,
      task_type: formValue.task_type,
      status: formValue.status,
      dueTime: formValue.dueTime,
      projectId: formValue.projectId,
      assignedTo: formValue.assignedTo || [],
    };

    if (this.isEditMode && this.taskId) {
      this.updateTask(this.taskId, taskData);
      return;
    }

    this.createTask(taskData);
  }

  createTask(taskData: any): void {
    this.taskService.createTask(taskData).subscribe({
      next: () => {
        this.submitting = false;
        alert('Task created successfully!');
        this.location.back();
      },
      error: (error) => {
        console.error('Error creating task:', error);
        this.submitting = false;
        alert(`Failed to create task: ${error.error?.message || 'Unknown error'}`);
      },
    });
  }

  updateTask(taskId: string, taskData: any): void {
    this.taskService.actuaTask(taskId, taskData).subscribe({
      next: () => {
        this.submitting = false;
        alert('Task updated successfully!');
        this.location.back();
      },
      error: (error) => {
        console.error('Error updating task:', error);
        this.submitting = false;
        alert('Failed to update task. Please try again.');
      },
    });
  }
}

