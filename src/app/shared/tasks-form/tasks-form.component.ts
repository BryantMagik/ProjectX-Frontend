import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { TaskService } from '../../service/task/task.service';

@Component({
    selector: 'app-tasks-form',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './tasks-form.component.html',
    styleUrl: './tasks-form.component.css',
    standalone: true,
})
export class TasksFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private taskService = inject(TaskService);
  private location = inject(Location);

  taskForm: FormGroup;
  taskId: string | null = null;
  isEditMode: boolean = false;
  submitting: boolean = false;

  constructor() {
    this.taskForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      code: ['', Validators.required],
      summary: ['', Validators.required],
      description: ['', Validators.required],
      priority: ['', Validators.required],
      task_type: ['', Validators.required],
      task_status: ['', Validators.required],
      projectId: ['', Validators.required],
      dueTime: ['']
    });

    // Auto-generate code from name
    this.taskForm.get('name')?.valueChanges.subscribe(name => {
      if (name && !this.isEditMode) {
        const code = this.generateTaskCode(name);
        this.taskForm.patchValue({ code }, { emitEvent: false });
      }
    });
  }

  ngOnInit(): void {
    // Get taskId from route params if editing
    this.taskId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.taskId;

    // Get projectId from query params
    this.route.queryParams.subscribe(params => {
      const projectId = params['projectId'];
      if (projectId) {
        this.taskForm.patchValue({ projectId });
      }
    });

    // If edit mode, load task data
    if (this.isEditMode && this.taskId) {
      this.loadTask(this.taskId);
    }
  }

  generateTaskCode(name: string): string {
    // Generate code like: TASK-{first 3 letters uppercase}-{timestamp}
    const prefix = name.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'X');
    const timestamp = Date.now().toString().slice(-4);
    return `TASK-${prefix}-${timestamp}`;
  }

  loadTask(taskId: string): void {
    this.taskService.getTasksById(taskId).subscribe({
      next: (task) => {
        if (task) {
          this.taskForm.patchValue({
            name: task.name,
            code: task.name, // El backend guarda code como name
            summary: task.summary,
            description: task.description,
            priority: task.priority,
            task_type: task.task_type,
            task_status: task.status,
            projectId: task.projectId,
            dueTime: task.dueTime
          });
        }
      },
      error: (error) => {
        console.error('Error loading task:', error);
        alert('Failed to load task data');
      }
    });
  }

  onCancel(): void {
    this.location.back();
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      this.submitting = true;

      // Extract form values
      const formValue = this.taskForm.value;

      // Prepare task data according to backend DTO
      const taskData = {
        code: formValue.code,
        summary: formValue.summary,
        description: formValue.description,
        priority: formValue.priority,
        task_type: formValue.task_type,
        task_status: formValue.task_status,
        dueTime: formValue.dueTime ? parseInt(formValue.dueTime) : undefined,
        projectId: formValue.projectId // Include projectId for service
      };

      if (this.isEditMode && this.taskId) {
        // Update existing task
        this.updateTask(this.taskId, taskData);
      } else {
        // Create new task
        this.createTask(taskData);
      }
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.taskForm.controls).forEach(key => {
        this.taskForm.get(key)?.markAsTouched();
      });
      alert('Please fill in all required fields');
    }
  }

  createTask(taskData: any): void {
    console.log('Creating task with data:', taskData);
    this.taskService.createTask(taskData).subscribe({
      next: (response) => {
        console.log('Task created successfully:', response);
        this.submitting = false;
        alert('Task created successfully!');
        this.location.back();
      },
      error: (error) => {
        console.error('Error creating task:', error);
        console.error('Error details:', error.error);
        this.submitting = false;
        alert(`Failed to create task: ${error.error?.message || 'Unknown error'}`);
      }
    });
  }

  updateTask(taskId: string, taskData: any): void {
    this.taskService.updateTask(taskId, taskData).subscribe({
      next: (response) => {
        console.log('Task updated successfully:', response);
        this.submitting = false;
        alert('Task updated successfully!');
        this.location.back();
      },
      error: (error) => {
        console.error('Error updating task:', error);
        this.submitting = false;
        alert('Failed to update task. Please try again.');
      }
    });
  }
}
