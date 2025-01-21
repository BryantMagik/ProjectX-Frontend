import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgClass, NgIf } from '@angular/common';
import { FormGroup, Validators, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IssueService } from '../../service/issue/issue.service';
import { Issue, IssueStatus, IssueType, TaskPriority } from '../../model/issue.interface';
import { tap } from 'rxjs';
import { User } from '../../model/user.interface';
import { UserService } from '../../service/user/user.service';
import { MultiSelectModule } from 'primeng/multiselect';
import { CommentsListComponentComponent } from '../../shared/comments-list-component/comments-list-component.component';

@Component({
  selector: 'app-issuesdetails',
  imports: [CommonModule, NgClass, ReactiveFormsModule, NgIf, NgFor, MultiSelectModule, CommentsListComponentComponent],
  templateUrl: './issuesdetails.component.html',
  styleUrl: './issuesdetails.component.css',
  standalone: true

})
export class IssuesdetailsComponent implements OnInit {

  issue: Issue | null = null;
  issueId: string | null = null;
  users: User[] = [];
  availableAssigneds: { id: string; first_name: string }[] = [];

  isEditing = false;
  issuesFormular: FormGroup;

  issueTypes = Object.values(IssueType);
  taskPriorities = Object.values(TaskPriority);
  issueStatuses = Object.values(IssueStatus);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private issueService: IssueService,
    private userService: UserService,

  ) {
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
    this.issueId = this.route.snapshot.paramMap.get('id');
    if (this.issueId) {
      this.getIssueById(this.issueId);
    }
  }

  navigateToIssues() {
    this.router.navigate(['/pages/issues']);
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
            assignedTo: issue.assignedTo?.map(Assigneds => Assigneds.id) || []
          });
          this.availableAssigneds = issue.assignedTo
            ? issue.assignedTo.map(assigned => ({
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
