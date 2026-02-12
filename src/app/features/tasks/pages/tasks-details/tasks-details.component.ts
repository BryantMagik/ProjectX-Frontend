import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommentsListComponentComponent } from '../../../comments/components/comments-list/comments-list-component.component';
import { TaskService } from '../../../../service/task/task.service';
import { Task } from '../../../../core/models/task.interface';

const TASK_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const TASK_TYPES = ['FEATURE', 'BUG', 'CHORE', 'IMPROVEMENT', 'HOTFIX'];
const TASK_STATUSES = ['BACKLOG', 'TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'];

@Component({
  selector: 'app-tasks-details',
  imports: [CommonModule, ReactiveFormsModule, CommentsListComponentComponent],
  templateUrl: './tasks-details.component.html',
  styleUrl: './tasks-details.component.css',
  standalone: true
})
export class TasksDetailsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private taskService = inject(TaskService);

  tasksPriority = TASK_PRIORITIES;
  tasksType = TASK_TYPES;
  tasksStatus = TASK_STATUSES;

  taskId: string = '';
  task: Task | null = null;
  isEditing = false;
  loading = true;
  error: string | null = null;
  tasksFormular: FormGroup;

  
  constructor(...args: unknown[]);
  constructor() {
    this.tasksFormular = this.fb.group({
      id: [{ value: '', disabled: true }],
      code: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(20)]],
      name: ['', [Validators.required, Validators.maxLength(255)]],
      summary: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['', [Validators.required, Validators.maxLength(10024)]],
      priority: ['', Validators.required],
      task_type: ['', Validators.required],
      status: ['', Validators.required],
      projectId: [{ value: '', disabled: true }, [Validators.required]],
      dueTime: ['']
    });
  }

  ngOnInit(): void {
    this.taskId = this.route.snapshot.paramMap.get('taskId') || '';
    if (this.taskId) {
      this.loadTask(this.taskId);
    } else {
      this.loading = false;
      this.error = 'Task id is missing.';
    }
    this.tasksFormular.disable();
  }

  navigateToTasks(): void {
    this.router.navigate(['/tasks']);
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.tasksFormular.enable();
      this.tasksFormular.get('code')?.disable();
      this.tasksFormular.get('projectId')?.disable();
      this.tasksFormular.get('id')?.disable();
    } else {
      this.resetForm();
      this.tasksFormular.disable();
    }
  }

  onSubmit(): void {
    if (!this.taskId) {
      return;
    }
    if (this.tasksFormular.valid) {
      const rawValue = this.tasksFormular.value


      const payload = {
        code: rawValue.name,
        summary: rawValue.summary,
        description: rawValue.description,
        priority: rawValue.priority || undefined,
        status: rawValue.status || undefined,
        task_type: rawValue.task_type || undefined,
        dueTime: rawValue.dueTime || undefined
      };
      this.taskService.actuaTask(this.taskId, payload).subscribe({
        next: (updated) => {
          this.task = { ...(this.task as Task), ...updated };
          this.isEditing = false;
          this.tasksFormular.disable();
          this.patchForm(this.task);
        },
        error: () => {
          console.log(this.task);
          this.error = 'No se pudo actualizar la tarea.';
        }
      });
    }
  }

  private loadTask(taskId: string): void {
    this.taskService.getTasksPorId(taskId).subscribe({
      next: (task) => {
        if (task) {
          this.task = task;
          this.patchForm(task);
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = 'No se pudo cargar la tarea.';
      }
    });
  }

  private formatDate(date: any): string {
  if (!date) return '';
  const d = new Date(date);
  // Validamos que sea una fecha válida antes de intentar transformarla
  if (isNaN(d.getTime())) return '';
  
  // Extraemos YYYY-MM-DD
  return d.toISOString().split('T')[0];
}

  private patchForm(task: Task): void {
    this.tasksFormular.patchValue({
      id: task.id,
      code: task.name,
      name: task.name,
      summary: task.summary,
      description: task.description,
      priority: typeof task.priority === 'object' ? (task.priority as any).name : task.priority,
      task_type: typeof task.task_type === 'object' ? (task.task_type as any).name : task.task_type,
      status: typeof task.status === 'object' ? (task.status as any).name : task.status,
      projectId: task.projectId,
      dueTime: this.formatDate(task.dueTime)
    });
  }

  private resetForm(): void {
    if (this.task) {
      this.patchForm(this.task);
    }
  }
}
