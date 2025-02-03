import { CommonModule } from '@angular/common'
import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { ProjectService } from '../../service/project/project.service'
import { ProyectDropdown, PROYECTOTYPE } from '../../types/models'
import { Subscription } from 'rxjs'
import { ActivatedRoute, Router, RouterModule } from '@angular/router'
import { Select } from 'primeng/select'

@Component({
  selector: 'app-modal-create-project',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, Select],
  templateUrl: './modal-create-project.component.html',
  styleUrl: './modal-create-project.component.css',
  standalone: true

})
export class ModalCreateProjectComponent implements OnInit {

  @Input() workspaceId: string | null = null
  @Output() close = new EventEmitter<void>()

  routeSub: Subscription | null = null
  projectForm!: FormGroup
  proyectoType: ProyectDropdown[] = []

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private router: Router

  ) { }

  ngOnInit(): void {

    console.log('Workspace ID en el modal:', this.workspaceId);

    this.proyectoType = PROYECTOTYPE

    this.projectForm = this.fb.group({
      code: ['', [Validators.required, Validators.maxLength(10)]],
      name: ['', [Validators.required, Validators.maxLength(10)]],
      description: [''],
      type: ['', Validators.required],
      status: ['ONGOING', Validators.required],
    })


  }

  onSubmit(): void {
    if (this.workspaceId) {
      const projectData = {
        ...this.projectForm.value,
      }

      this.projectService.postProject(this.workspaceId, projectData).subscribe({
        next: (response) => {
          console.log('Project created:', response)
            this.close.emit()

        },
        error: (err) => {
          console.error('Error creating project:', err)
        }
      })
    }
  }
  onClose(): void {
    this.close.emit()
  }

}
