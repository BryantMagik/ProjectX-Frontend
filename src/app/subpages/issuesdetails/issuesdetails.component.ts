import { Component,OnInit } from '@angular/core';
import { CommonModule, NgFor, NgClass } from '@angular/common';
import { FormGroup,Validators,FormBuilder,FormsModule,ReactiveFormsModule } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { IssueService } from '../../service/issue/issue.service';
import { Issue,IssueStatus,IssueType,TaskPriority } from '../../model/issue.interface';
import { tap } from 'rxjs';


interface Issuedetail {
  id: string;
  code: string;
  type: string;
  summary: string;
  description: string;
  priority: string;
  project_id: string;
  reporterUserId: string;
  status: string;
  creation_date: string;
  update_date: string;
  asigned:string;
}

@Component({
  selector: 'app-issuesdetails',
  standalone: true,
  imports: [NgFor,CommonModule,NgClass,ReactiveFormsModule],
  templateUrl: './issuesdetails.component.html',
  styleUrl: './issuesdetails.component.css'
})
export class IssuesdetailsComponent implements OnInit{
  issues: Issuedetail[] = [
    {
      id:'112233374',
      code: 'ISSUE-001',
      type: 'Bug',
      summary: 'Error en la página de login',
      description: 'Hay un error que impide que los usuarios puedan iniciar sesión en la página de login. El error ocurre cuando se ingresan credenciales incorrectas.',
      priority:'medium',
      project_id:'1224e4a55a',
      reporterUserId: '7854477474',
      status: 'pending',
      creation_date:'16/07/2024',
      update_date:'21/09/2024',
      asigned:'María Juana',
    }
  ];

  issue: Issue | null = null;
  issueId: string | null = null;
  loading = true;
  error: string | null = null;

  isEditing = false;
  issuesFormular: FormGroup;

  issueTypes = Object.values(IssueType);
  taskPriorities = Object.values(TaskPriority);
  issueStatuses = Object.values(IssueStatus);

  constructor(
    private fb: FormBuilder,
    private router:Router,
    private route: ActivatedRoute,
    private issueService:IssueService

  ) {
    this.issuesFormular = this.fb.group({
      code: [{ value: '', disabled: true },[Validators.required, Validators.maxLength(255)]],
      type: [{value:''}, Validators.required],
      summary: [{value:''}, [Validators.required, Validators.maxLength(10024)]],
      description: [{value:''}, [Validators.required, Validators.maxLength(10024)]],
      priority: [{value:''}, Validators.required],
      status: [{value:''}, Validators.required],
    });

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.issueId = params.get('id');
      if (this.issueId) {
        this.getIssueById(this.issueId);
      }
    });
  }

  navigateToIssues(){
    this.router.navigate(['/pages/issues']);
  }

  toggleEdit() {
    if (this.isEditing) {
      this.isEditing = false;
      this.issuesFormular .disable();  // Deshabilitar los campos
    } else {
      this.isEditing = true;
      this.issuesFormular .enable();   // Habilitar los campos
    }
  }

  private getIssueById(id: string): void {
    this.issueService.getIssueById(id).pipe(
      tap({
        next: (issue: Issue | null) => {
          this.issue = issue;
          console.log('Recibiendo issue:', this.issue);
          if (issue) {
            this.issuesFormular.patchValue({
              id: issue.id,
              code: issue.code,
              type: issue.type,
              summary: issue.summary,
              description: issue.description,
              priority: issue.priority,
              projectId: issue.projectId,
              reporterId: issue.reporterId,
              status: issue.status
            });
          }
        },
        error: () => {
          this.error = 'Failed to load issue';
          this.loading = false;
        },
        complete: () => (this.loading = false)
      })
    ).subscribe();
  }

  

  onSubmit() {
    if (this.issuesFormular .valid) {
      console.log('Formulario enviado:', this.issuesFormular .value);
      const updateIssue: Issue = this.issuesFormular.getRawValue();

      if (this.issueId) {
        this.issueService.updateIssue(this.issueId, updateIssue).subscribe({
          next: () => {
            this.router.navigate(['/pages/issues']);
          },
          error: () => {
            this.error = 'Error al actualizar el issue';
          }
        });
      }
    } else {
      console.log('Formulario inválido, por favor revisa los campos.');
    }
    this.isEditing = false; 
    this.issuesFormular .disable(); 
  }


}
