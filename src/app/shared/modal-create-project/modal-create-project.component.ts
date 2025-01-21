import { CommonModule } from '@angular/common'
import { Component, Output, EventEmitter, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { ProjectService } from '../../service/project/project.service'
import { ProyectDropdown, PROYECTOTYPE } from '../../types/models'
import { DropdownModule } from 'primeng/dropdown'

@Component({
    selector: 'app-modal-create-project',
    imports: [CommonModule, ReactiveFormsModule, DropdownModule],
    templateUrl: './modal-create-project.component.html',
    styleUrl: './modal-create-project.component.css',
    standalone:true

})
export class ModalCreateProjectComponent implements OnInit {
  @Output() close = new EventEmitter<void>()

  projectForm!: FormGroup
  proyectoType: ProyectDropdown[] = []
  workspaceId: string | null = null

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService

  ) { }


  ngOnInit(): void {
    this.proyectoType = PROYECTOTYPE

    this.projectForm = this.fb.group({
      code: ['', [Validators.required, Validators.maxLength(10)]],
      name: ['', [Validators.required, Validators.maxLength(10)]],
      description: [''],
      type: ['', Validators.required],
      status: ['', Validators.required],
    })
  }

  onSubmit(): void {

    if (this.workspaceId) {
      const projectData = {
        ...this.projectForm.value,
        workspaceId: this.workspaceId
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
