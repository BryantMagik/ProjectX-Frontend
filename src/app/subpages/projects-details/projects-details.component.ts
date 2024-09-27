import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project } from '../../model/project.interface';
import { ProjectService } from '../../service/project/project.service';
import { tap } from 'rxjs';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { NgClass,NgFor,CommonModule } from '@angular/common';
import { Router } from '@angular/router';

enum ProjectType {
  Internal = 'Internal',
  External = 'External',
  Research = 'Research',
  Software = 'Software'
}

enum ProjectStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  Ongoing = 'Ongoing',
  Completed = 'Completed'
}

@Component({
  selector: 'app-projects-details',
  standalone: true,
  imports: [NgClass,NgFor,CommonModule],
  templateUrl: './projects-details.component.html',
  styleUrls: ['./projects-details.component.css']
})
export class ProjectsDetailsComponent implements OnInit {
  project: Project | null = null;
  projectId: string | null = null;
  loading = true;
  error: string | null = null;

  isEditing = false;
  projectsFormular: FormGroup;

  projectTypes = Object.values(ProjectType);
  projectStatuses = Object.values(ProjectStatus);


  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private fb: FormBuilder,
    private router: Router
  ) { 
    this.projectsFormular = this.fb.group({
      id: [{ value: '', disabled: true }],
      name: ['', [Validators.required, Validators.maxLength(50)]],
      description: [''],
      code: ['', [Validators.required, Validators.maxLength(10)]],
      type: ['', Validators.required],
      status: ['', Validators.required],
      userId: ['', Validators.required],
    });
  }

  ngOnInit() {
    console.log('ProjectsDetailsComponent initialized');
    this.route.paramMap.subscribe(params => {
      this.projectId = params.get('id');
      console.log('Project ID:', this.projectId);

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
          console.log('Project:', this.project);
          this.projectsFormular.patchValue({
            id: project?.id,
            name: project?.name,
            description: project?.description,
            code: project?.code,
            type: project?.type,
            status: project?.status,
            userId: project?.author?.first_name,
          });
        },
        error: () => this.error = 'Failed to load project',
        complete: () => this.loading = false
      })
    ).subscribe()
  }

  toggleEdit() {
    if (this.isEditing) {
      this.isEditing = false;
      this.projectsFormular.disable();  // Deshabilitar los campos
    } else {
      this.isEditing = true;
      this.projectsFormular.enable();   // Habilitar los campos
    }
  }

  onSubmit() {
    if (this.projectsFormular.valid) {
      console.log('Formulario enviado:', this.projectsFormular.value);
    } else {
      console.log('Formulario inválido, por favor revisa los campos.');
    }
    this.isEditing = false;  // Deshabilitar edición tras enviar
    this.projectsFormular.disable();  // Volver a deshabilitar los campos
  }

}
