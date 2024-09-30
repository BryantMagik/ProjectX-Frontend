import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LayoutComponent } from '../../pages/layout/layout.component';
import { ProjectService } from '../../service/project/project.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [LayoutComponent, ReactiveFormsModule],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.css'
})
export class ProjectFormComponent implements OnInit {
  projectForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private router:Router

  ) { }

  navigateToProjects() {
    this.router.navigate(['/pages/projects']);
  }

  ngOnInit(): void {
    this.projectForm = this.fb.group({
      code: ['', [Validators.required, Validators.maxLength(10)]],
      name: ['', [Validators.required, Validators.maxLength(50)]],
      description: [''],
      type: ['', Validators.required],
      status: ['', Validators.required],
    });
  }

  onSubmit(): void {
    console.log('Itentando enviar formulario...');

    if (this.projectForm.valid) {
      console.log('Formulario válido', this.projectForm.value);
      this.projectService.postProject(this.projectForm.value)
        .subscribe({
          next: (response) => {
            console.log('proyecto creado con exito', response)
          },
          error: (err) => {
            console.error('Error al crear el proyecto', err);
          }
        })
    } else {
      console.log('Formulario inválido');
    }
  }

}
