import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MultiSelectModule } from 'primeng/multiselect';
import { CommentsListComponentComponent } from '../../../comments/components/comments-list/comments-list-component.component';
import { Assigneds, Issue, IssueStatus, IssueType, TaskPriority } from '../../../../core/models/issue.interface';
import { User } from '../../../../core/models/user.interface';
import { IssueService } from '../../data-access/issue.service';
import { UserService } from '../../../profile/data-access/user.service';

@Component({
  selector: 'app-issues-details',
  standalone: true,
  imports: [CommonModule, NgClass, ReactiveFormsModule, MultiSelectModule, CommentsListComponentComponent],
  templateUrl: './issues-details.component.html',
  styleUrl: './issues-details.component.css'
})
export class IssuesDetailsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private issueService = inject(IssueService);
  private userService = inject(UserService);

  issue: Issue | null = null;
  issueId: string | null = null;
  availableAssigneds: { id: string; first_name: string }[] = [];
  isEditing = false;
  loading = true;
  saving = false;
  error: string | null = null;

  issuesFormular: FormGroup = this.fb.group({
    code: [{ value: '', disabled: true }],
    type: [{ value: '', disabled: true }, Validators.required],
    summary: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(1024)]],
    description: [{ value: '', disabled: true }, [Validators.maxLength(1024)]],
    priority: [{ value: '', disabled: true }, Validators.required],
    status: [{ value: '', disabled: true }, Validators.required],
    assignedTo: [{ value: [], disabled: true }],
    reporter: [{ value: '', disabled: true }]
  });

  issueTypes = Object.values(IssueType);
  taskPriorities = Object.values(TaskPriority);
  issueStatuses = Object.values(IssueStatus);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);
  constructor() {}

  ngOnInit(): void {
    this.issueId = this.route.snapshot.paramMap.get('issueId');
    if (this.issueId) {
      this.getIssueById(this.issueId);
      this.loadAssignableUsers();
    } else {
      this.loading = false;
      this.error = 'No se encontró el identificador del issue.';
    }
  }

  navigateToIssues(): void {
    this.router.navigate(['/issues']);
  }

  toggleEdit(): void {
    if (!this.issue) {
      return;
    }

    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.issuesFormular.enable();
      this.issuesFormular.get('code')?.disable();
      this.issuesFormular.get('reporter')?.disable();
    } else {
      this.patchForm(this.issue);
      this.issuesFormular.disable();
    }
  }

  onSubmit(): void {
    if (!this.issueId || !this.issuesFormular.valid) {
      this.issuesFormular.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.error = null;

    const rawIssue = this.issuesFormular.getRawValue();
    const payload: Partial<Issue> = {
      type: rawIssue.type,
      summary: rawIssue.summary,
      description: rawIssue.description,
      priority: rawIssue.priority,
      status: rawIssue.status,
      assignedTo: rawIssue.assignedTo
    };

    this.issueService.updateIssue(this.issueId, payload).subscribe({
      next: (updated) => {
        this.issue = { ...(this.issue || {} as Issue), ...updated };
        this.patchForm(this.issue);
        this.isEditing = false;
        this.issuesFormular.disable();
        this.saving = false;
      },
      error: () => {
        this.saving = false;
        this.error = 'No se pudo actualizar el issue. Verifica permisos e inténtalo de nuevo.';
      }
    });
  }

  getPriorityClass(priority?: string): string {
    switch ((priority || '').toUpperCase()) {
      case 'HIGH':
        return 'priority-high';
      case 'MEDIUM':
        return 'priority-medium';
      default:
        return 'priority-low';
    }
  }

  getStatusClass(status?: string): string {
    switch ((status || '').toUpperCase()) {
      case 'COMPLETED':
        return 'status-completed';
      case 'ONGOING':
        return 'status-ongoing';
      default:
        return 'status-active';
    }
  }

  private getIssueById(id: string): void {
    this.loading = true;
    this.error = null;

    this.issueService.getIssueById(id).subscribe({
      next: (issue) => {
        if (!issue) {
          this.error = 'El issue solicitado no existe.';
        } else {
          this.issue = issue;
          this.patchForm(issue);
          this.issuesFormular.disable();
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = 'Error al obtener el issue.';
      }
    });
  }

  private loadAssignableUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users: User[] | null) => {
        this.availableAssigneds = (users || []).map((user) => ({
          id: user.id,
          first_name: user.first_name
        }));
      },
      error: () => {
        this.availableAssigneds = [];
      }
    });
  }

  private patchForm(issue: Issue): void {
    const assignedIds = issue.assignedTo?.map((assigned: Assigneds) => assigned.id) || [];

    this.issuesFormular.patchValue({
      code: issue.code,
      type: issue.type,
      summary: issue.summary,
      description: issue.description || '',
      priority: issue.priority,
      status: issue.status,
      assignedTo: assignedIds,
      reporter: issue.reporter?.first_name || 'Sin reporter'
    });
  }
}
