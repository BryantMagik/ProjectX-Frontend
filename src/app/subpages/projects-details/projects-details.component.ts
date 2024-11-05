import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project } from '../../model/project.interface';
import { ProjectService } from '../../service/project/project.service';
import { tap } from 'rxjs';
import { FormBuilder,FormGroup,FormsModule,ReactiveFormsModule,Validators } from '@angular/forms';
import { NgClass,NgFor,CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PROYECTOSTATUS, PROYECTOTYPE } from '../../types/models';


@Component({
  selector: 'app-projects-details',
  standalone: true,
  imports: [NgClass,NgFor,CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './projects-details.component.html',
  styleUrls: ['./projects-details.component.css']
})
export class ProjectsDetailsComponent implements OnInit {
  project: Project | null = null;
  projectId: string | null = null;
  loading = true;
  error: string | null = null;

  projectsFormular: FormGroup;

  projectTypes = Object.values(PROYECTOTYPE)
  projectStatuses = Object.values(PROYECTOSTATUS)
  availableParticipants: string[] = []

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private fb: FormBuilder,
    private router: Router
  ) { 
    this.projectsFormular = this.fb.group({
      id: [{ value: '', disabled: true }],
      name: [{value: ''}, [Validators.required, Validators.maxLength(50)]],
      description: [{value: ''}],
      code: [{value: ''}, [Validators.required, Validators.maxLength(10)]],
      type: [{value: ''}, Validators.required],
      status: [{value: ''}, Validators.required],
      userId: [{value: ''}, Validators.required],
      participants: [[]]
    });
  }


  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.projectId = params.get('id');
      if (this.projectId) {
        this.getProjectById(this.projectId)
      }
    })
  }

  navigateToProjects() {
    this.router.navigate(['/pages/projects']);
  }

  private getProjectById(id: string) {
    this.projectService.getProjectById(id).pipe(
      tap({
        next: (project: Project | null) => {
          this.project = project;
          console.log("Subiendo",this.project)
          if (project) {
            this.projectsFormular.patchValue({
              id: project.id,
              name: project.name,
              description: project.description,
              code: project.code,
              type: project.type,
              status: project.status,
              userId: project.author?.first_name,
              participants: project.participants || []
            });
          }
        },
        error: () => {
          this.error = 'Failed to load project';
          this.loading = false
        },
        complete: () => this.loading = false
      })
    ).subscribe()
  }


  onSubmit() {
    if (this.projectsFormular.valid) {
      console.log('Formulario enviado:', this.projectsFormular.value);
      console.log("correcto!")
    } else {
      console.log('Formulario inválido, por favor revisa los campos.');
    }
  }

}
