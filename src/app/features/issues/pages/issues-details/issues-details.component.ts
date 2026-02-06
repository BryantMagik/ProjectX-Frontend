import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { FormGroup, Validators, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IssueService } from '../../data-access/issue.service';
import { Assigneds, Issue, IssueStatus, IssueType, TaskPriority } from '../../../../core/models/issue.interface';
import { tap } from 'rxjs';
import { User } from '../../../../core/models/user.interface';
import { UserService } from '../../../profile/data-access/user.service';
import { MultiSelectModule } from 'primeng/multiselect';
import { CommentsListComponentComponent } from '../../../comments/components/comments-list/comments-list-component.component';

@Component({
  selector: 'app-issues-details',
  imports: [CommonModule, NgClass, ReactiveFormsModule, MultiSelectModule, CommentsListComponentComponent],
  templateUrl: './issues-details.component.html',
  styleUrl: './issues-details.component.css',
  standalone: true

})
export class IssuesDetailsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private issueService = inject(IssueService);
  private userService = inject(UserService);


  issue: Issue | null = null;
  issueId: string | null = null;
  users: User[] = [];
  availableAssigneds: { id: string; first_name: string }[] = [];

  isEditing = false;
  issuesFormular: FormGroup;

  issueTypes = Object.values(IssueType);
  taskPriorities = Object.values(TaskPriority);
  issueStatuses = Object.values(IssueStatus);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
    this.issuesFormular = this.fb.group({
      type: [{ value: '' }, Validators.required],
      summary: [{ value: '' }, [Validators.required, Validators.maxLength(10024)]],
      description: [{ value: '' }, [Validators.required, Validators.maxLength(10024)]],
      priority: [{ value: '' }, Validators.required],
      status: [{ value: '' }, Validators.required],
      assignedTo: [[]],
    });

  }

  ngOnInit(): void {
    this.issueId = this.route.snapshot.paramMap.get('issueId');
    if (this.issueId) {
      this.getIssueById(this.issueId);
    }
  }

  navigateToIssues() {
    this.router.navigate(['/issues']);
  }

  toggleEdit() {
    if (this.isEditing) {
      this.isEditing = false;
      this.issuesFormular.disable();
    } else {
      this.isEditing = true;
      this.issuesFormular.enable();
    }
  }

  getIssueById(id: string): void {
    this.issueService.getIssueById(id).subscribe({
      next: (issue) => {
        if (issue) {
          this.issue = issue;
          this.issuesFormular.patchValue({
            type: issue.type,
            summary: issue.summary,
            description: issue.description,
            priority: issue.priority,
            status: issue.status,
            assignedTo: issue.assignedTo?.map((assigned: Assigneds) => assigned.id) || []
          });
          this.availableAssigneds = issue.assignedTo
            ? issue.assignedTo.map((assigned: Assigneds) => ({
              id: assigned.id,
              first_name: assigned.first_name
            }))
            : [];
        } else {
          console.error('El issue no existe.');
        }
      },
      error: (err) => {
        console.error('Error al obtener el issue:', err);
      }
    });
  }

  onSubmit() {
    if (this.issuesFormular.valid && this.issueId) {
      const updatedIssue = this.issuesFormular.getRawValue();
      this.issueService.updateIssue(this.issueId, updatedIssue).subscribe({
        next: () => {
          console.log('Issue actualizado correctamente');
          this.isEditing = false;
          this.issuesFormular.disable();
        },
        error: (err) => {
          console.error('Error al actualizar el issue:', err);
        }
      });
    }

  }


}
