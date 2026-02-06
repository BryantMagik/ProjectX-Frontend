import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { TaskService } from '../../../../service/task/task.service';
import { ProjectService } from '../../../projects/data-access/project.service';
import { Project } from '../../../../core/models/project.interface';

@Component({
    selector: 'app-tasks-form',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './tasks-form.component.html',
    styleUrl: './tasks-form.component.css',
    standalone: true,
})
export class TasksFormComponent implements OnInit{

  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);
  private projectService = inject(ProjectService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  
  taskForm: FormGroup;
  projects: Project[] = [];
  loading = false;
  hasProjectId = false;
  projectId: string | null = null;

  constructor() {
    this.taskForm = this.fb.group({
      summary: ['', [Validators.required]],
      description: [''],
      // 'code' es obligatorio en la interfaz y el backend
      code: [{ value: '', disabled: true }, [Validators.required]], 
      task_type: ['FEATURE', [Validators.required]],
      priority: ['MEDIUM', [Validators.required]],
      status: ['TODO', [Validators.required]],
      projectId: ['', [Validators.required]],
      // Añadido debido a que está presente en la interfaz Task
      dueTime: ['', [Validators.required]] 
    });
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.projectId = params.get('projectId');
      if (this.projectId) {
        this.hasProjectId = true;
        this.taskForm.patchValue({ projectId: this.projectId });
        this.taskForm.get('projectId')?.disable({ emitEvent: false });
      } else {
        this.hasProjectId = false;
        this.loadProjects();
      }
    });
    this.assignNewCode();
  }

  private loadProjects(): void {
    this.projectService.getProjectByIdWhereId().subscribe({
      next: (projects) => this.projects = projects || [],
      error: (err) => console.error('Error loading projects:', err)
    });
  }

  private assignNewCode(): void {
    // Genera el formato TASK-XXX-0000 (ej. TASK-HYD-6407)
    const letters = Math.random().toString(36).substring(2, 5).toUpperCase();
    const numbers = Math.floor(1000 + Math.random() * 9000);
    const generatedCode = `TASK-${letters}-${numbers}`;
    this.taskForm.patchValue({ code: generatedCode });
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      this.loading = true;
      
      // getRawValue() incluye el campo 'code' aunque esté deshabilitado en el UI
      const taskData = this.taskForm.getRawValue();
      
      this.taskService.createTask(taskData).subscribe({
        next: () => this.router.navigate(['/tasks']),
        error: (err) => {
          console.error('Error creating task:', err);
          this.loading = false;
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/tasks']);
  }
}
