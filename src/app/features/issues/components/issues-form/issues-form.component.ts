import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { IssueService } from '../../data-access/issue.service';
import { ProjectService } from '../../../../service/project/project.service';
import { Issue, IssueStatus, IssueType, TaskPriority } from '../../../../core/models/issue.interface';
import { map } from 'rxjs';
import { UserService } from '../../../../service/user/user.service';
import { User } from '../../../../core/models/user.interface';

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
  private userService = inject(UserService); 
  
  users: { id: string; name: string }[] = [];

  issueForm!: FormGroup;
  submitting = false;

  issueTypes = Object.values(IssueType);
  issueStatuses = Object.values(IssueStatus);
  issuePriorities = Object.values(TaskPriority);
  projects: { id: string; name: string }[] = [];

  ngOnInit(): void {
    this.initializeForm();
    this.loadProjects();
    this.loadUsers();
    this.loadOwnProjects();
    this.fetchAndGenerateCode();
  }

  private initializeForm(): void {
    this.issueForm = this.fb.group({
      code: [{ value: '', disabled: false }, [Validators.required]],
      type: ['', Validators.required],
      summary: ['', [Validators.required, Validators.maxLength(1024)]],
      description: [''],
      priority: ['', Validators.required],
      projectId: ['', Validators.required],
      status: ['', Validators.required],
      assignedTo: [[], Validators.required],
    });
  }

  private loadOwnProjects(): void {
    this.projectService.getProjectsRequest().subscribe({
      next: (projects) => {
        this.projects = projects.map(p => ({ id: p.id, name: p.name }));
      },
      error: () => this.showError('No se pudieron cargar tus proyectos.')
    });
  }

  private loadUsers(): void {
    this.userService.getAllUsers().subscribe({

      next: (usersResponse: User[] | null) => {

        this.users = (usersResponse || []).map(u => ({
          id: u.id,
       
          name: `${u.first_name} ${u.last_name}`.trim() || u.email
        }));
      },
      error: () => this.showError('Error al cargar usuarios asignables.')
    });
  }

  private fetchAndGenerateCode(): void {
    this.issueService.getLatestIssueCode().subscribe({
      next: (res) => {
        const nextCode = this.generateNextCode(res.code);
        this.issueForm.patchValue({ code: nextCode });
      },
      error: () => this.showError('No se pudo autogenerar el código.')
    });
  }

  private generateNextCode(lastCode: string | null): string {
    if (!lastCode) return 'ISS-A00-001';

    // Formato: ISS - A00 - 000
    const parts = lastCode.split('-');
    if (parts.length !== 3) return 'ISS-A00-001';

    let alphaPart = parts[1]; // Ejemplo: "A00"
    let numericPart = parseInt(parts[2], 10); // Ejemplo: 1

    numericPart++;

    if (numericPart > 999) {
      numericPart = 1;
      alphaPart = this.incrementAlphaBlock(alphaPart);
    }

    const newNumeric = numericPart.toString().padStart(3, '0');
    return `ISS-${alphaPart}-${newNumeric}`;
  }

  private incrementAlphaBlock(alphaBlock: string): string {
    let letter = alphaBlock.charAt(0);
    let number = parseInt(alphaBlock.substring(1), 10);

    number++;
    if (number > 99) {
      number = 0;
      letter = String.fromCharCode(letter.charCodeAt(0) + 1);
    }

    return `${letter}${number.toString().padStart(2, '0')}`;
  }
  

  private loadProjects(): void {
    this.projectService.getProjectsRequest().subscribe({
      next: (projects) => {
        this.projects = projects.map((project) => ({ 
          id: project.id, 
          name: project.name 
        }));
      },
      error: () => {
        this.showError('No se pudieron cargar tus proyectos propios.');
      },
    });
  }

  onSubmit(): void {
    if (this.issueForm.invalid) {
      this.issueForm.markAllAsTouched();
      this.showError('Completa los campos requeridos para crear el issue.');
      return;
    }

    this.submitting = true;

    const formValue = this.issueForm.getRawValue();
    
    this.issueService.createIssue(formValue).subscribe({
      next: () => {
        this.showSuccess('Issue creado correctamente.');
        this.router.navigate(['/issues']);
      },
      error: () => {
        this.submitting = false;
        this.showError('Error al crear el issue.');
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
