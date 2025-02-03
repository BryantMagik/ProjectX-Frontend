import { Component, OnInit,Input } from '@angular/core';
import { FormBuilder,FormGroup,Validators,ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute,Router } from '@angular/router';
import { ProjectService } from '../../service/project/project.service';
import { Project } from '../../model/project.interface';
import { Location, NgFor, NgIf } from '@angular/common';
import { PROYECTOTYPE, PROYECTOSTATUS } from '../../types/models';
import { from } from 'rxjs';

@Component({
  selector: 'app-edit-project',
  standalone: true,
  imports: [ReactiveFormsModule,NgIf,NgFor],
  templateUrl: './edit-project.component.html',
  styleUrl: './edit-project.component.css'
})
export class EditProjectComponent implements OnInit {

  @Input() workspace: string | null = null

  projectForm: FormGroup;
  projectId: string | null = null;
  projectImage: string | ArrayBuffer | null = '';
  project: Project | null = null;

  projectTypes = PROYECTOTYPE;
  projectStatuses = PROYECTOSTATUS;

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {
    this.projectForm = this.fb.group({
      name: [{ value: '' }, [Validators.required, Validators.minLength(3)]],
      description: [{ value: '' }, Validators.required],
      status: [{ value: '' }, Validators.required],
      type: [{ value: '' }, Validators.required],
      image: ['']
    });
  }

  onCancel(): void {
    this.location.back();
  }

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('projectId') || '';
    if (this.projectId) {
      this.projectService.getProjectById(this.projectId).subscribe((project) => {
        if (project) {
          this.projectForm.patchValue({
            name: project.name,
            description: project.description,
            status: project.status,
            type: project.type,
            image: project.image || ''
          });
          this.projectImage = project.image || '';
        }
      });
    }
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.projectImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.projectForm.valid && this.projectId) {
      const updatedProject: Partial<Project> = {
        ...this.projectForm.value,  // Tomamos los valores del formulario
        id: this.projectId, // Aseguramos que tenga el ID
        image: typeof this.projectImage === 'string' ? this.projectImage : '' // Solo enviamos la imagen si es una URL/base64
      };
  
      this.projectService.updateProject(updatedProject as Project, this.projectId).subscribe({
        next: () => {
          console.log('Proyecto actualizado correctamente');
        },
        error: (error) => {
          console.error('Error al actualizar el proyecto:', error);
        }
      });
    }
  }


}
