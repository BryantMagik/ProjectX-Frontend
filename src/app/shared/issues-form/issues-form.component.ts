import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToastModule } from 'primeng/toast';
import { IssueService } from '../../service/issue/issue.service';
import { IssueType,IssueStatus,TaskPriority,Issue } from '../../model/issue.interface';
import { ProjectService } from '../../service/project/project.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-issues-form',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,DropdownModule,InputTextModule,ToastModule,MultiSelectModule],
  templateUrl: './issues-form.component.html',
  styleUrl: './issues-form.component.css',
  providers: [MessageService]
})
export class IssuesFormComponent implements OnInit {
  issueForm!: FormGroup;
  issueTypes = Object.values(IssueType);
  issueStatues = Object.values(IssueStatus);
  issuePriorities= Object.values(TaskPriority);
  projects: {id: string; name:string}[] = [];
  reporterId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router:Router,
    private issueService: IssueService,
    private projectService: ProjectService,
    private messageService: MessageService

  ) {}

  ngOnInit(): void {
    this.reporterId = sessionStorage.getItem('userId');

    this.projectService.getProjectsRequest().subscribe({
      next: (projects) => {
        this.projects = projects.map(project => ({ id: project.id, name: project.name }));
      },
      error: (err) => {
        console.error('Error al cargar los proyectos:', err);
      }
    });

    this.issueForm = this.fb.group({
      code: ['', [Validators.required, Validators.maxLength(10)]],
      type: ['', Validators.required],
      summary: ['', [Validators.required, Validators.maxLength(1024)]],
      description: [''],
      priority: ['', Validators.required],
      projectId: ['', Validators.required],
      reporterId: [this.reporterId, Validators.required],
      status: ['', Validators.required],
    });

  }

  navigateToIssues(){
    this.router.navigate(['/pages/issues']);
  }

  onSubmit(): void {
    if (this.issueForm.valid) {
      const issueData: Issue = {
        ...this.issueForm.value,
      };

      this.issueService.createIssue(issueData).subscribe({
        next: () => {
          this.showSuccess('Issue creado exitosamente');
          this.navigateToIssues();
        },
        error: (err) => {
          console.error('Error al crear el issue:', err);
          this.showError('Error al crear el issue');
        }
      });
    } else {
      console.log('Formulario inválido:', this.issueForm.errors);
    }
  }

  showSuccess(message: string) {
    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: message });
  }

  showError(message: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
  }

}
