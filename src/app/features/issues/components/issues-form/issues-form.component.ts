import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { IssueService } from '../../data-access/issue.service';
import { ProjectService } from '../../../projects/data-access/project.service';
import { Issue, IssueStatus, IssueType, TaskPriority } from '../../../../core/models/issue.interface';

@Component({
  selector: 'app-issues-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ToastModule],
  templateUrl: './issues-form.component.html',
  styleUrl: './issues-form.component.css',
  providers: [MessageService],
})
export class IssuesFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private issueService = inject(IssueService);
  private projectService = inject(ProjectService);
  private messageService = inject(MessageService);

  issueForm!: FormGroup;
  submitting = false;

  issueTypes = Object.values(IssueType);
  issueStatuses = Object.values(IssueStatus);
  issuePriorities = Object.values(TaskPriority);
  projects: { id: string; name: string }[] = [];
  reporterId: string | null = null;

  ngOnInit(): void {
    this.reporterId = sessionStorage.getItem('userId');
    this.initializeForm();
    this.loadProjects();
  }

  private initializeForm(): void {
    this.issueForm = this.fb.group({
      code: ['', [Validators.required, Validators.maxLength(10)]],
      type: [IssueType.BUG, Validators.required],
      summary: ['', [Validators.required, Validators.maxLength(1024)]],
      description: [''],
      priority: [TaskPriority.MEDIUM, Validators.required],
      projectId: ['', Validators.required],
      reporterId: [this.reporterId],
      status: [IssueStatus.PENDING, Validators.required],
    });
  }

  private loadProjects(): void {
    this.projectService.getProjectsRequest().subscribe({
      next: (projects) => {
        this.projects = projects.map((project) => ({ id: project.id, name: project.name }));
      },
      error: () => {
        this.showError('No se pudieron cargar los proyectos.');
      },
    });
  }

  onSubmit(): void {
    if (this.submitting) {
      return;
    }

    if (this.issueForm.invalid) {
      this.issueForm.markAllAsTouched();
      this.showError('Completa los campos requeridos para crear el issue.');
      return;
    }

    this.submitting = true;

    const { reporterId, ...formValue } = this.issueForm.getRawValue();
    const issueData: Issue = {
      ...formValue,
      ...(reporterId ? { reporterId } : {}),
    };

    this.issueService.createIssue(issueData).subscribe({
      next: () => {
        this.showSuccess('Issue creado correctamente.');
        this.router.navigate(['/issues']);
      },
      error: () => {
        this.submitting = false;
        this.showError('Error al crear el issue. Intenta nuevamente.');
      },
    });
  }

  navigateToIssues(): void {
    this.router.navigate(['/issues']);
  }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.issueForm.get(controlName);
    return !!control && control.touched && control.hasError(errorName);
  }

  private showSuccess(message: string): void {
    this.messageService.add({ severity: 'success', summary: 'Exito', detail: message });
  }

  private showError(message: string): void {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
  }
}
