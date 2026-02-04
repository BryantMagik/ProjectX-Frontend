import { Component, OnInit, inject, ViewChild, ElementRef } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { ProjectService } from '../../service/project/project.service'
import { CloudinaryService } from '../../core/services/cloudinary.service'
import { CommonModule } from '@angular/common'
import { ActivatedRoute, Router } from '@angular/router'
import { Select } from 'primeng/select'
import { ProyectDropdown, PROYECTOTYPE, PROYECTOSTATUS, PROYECTOVISIBILITY } from '../../types/models'
import { WorkspaceService } from '../../service/workspace/workspace.service'
import { User } from '../../model/user.interface'

@Component({
    selector: 'app-project-form',
    imports: [ReactiveFormsModule, CommonModule, Select],
    templateUrl: './project-form.component.html',
    styleUrl: './project-form.component.css',
    standalone: true
})
export class ProjectFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private projectService = inject(ProjectService);
  private workspaceService = inject(WorkspaceService);
  private cloudinaryService = inject(CloudinaryService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  projectForm!: FormGroup
  workspaceId: string | null = null
  isUploading = false
  workspaceMembers: User[] = []

  projectTypes: ProyectDropdown[] = PROYECTOTYPE
  projectStatuses: ProyectDropdown[] = PROYECTOSTATUS
  projectVisibilities: ProyectDropdown[] = PROYECTOVISIBILITY
  private projectCount = 1

  get canSubmit(): boolean {
    const code = this.projectForm?.get('code')?.value
    return this.projectForm?.valid && !!code && code.trim().length > 0 && !this.isUploading
  }

  constructor() { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.workspaceId = params['workspaceId'] || sessionStorage.getItem(this.getWorkspaceStorageKey())
      if (this.workspaceId) {
        this.loadWorkspaceMembers()
        this.loadProjectCount()
      }
    })

    this.projectForm = this.fb.group({
      code: [{ value: '', disabled: true }, [Validators.maxLength(10)]],
      name: ['', [Validators.required, Validators.maxLength(50)]],
      description: [''],
      type: ['', Validators.required],
      status: ['ONGOING'],
      visibility: ['PRIVATE'],
      startDate: [''],
      endDate: [''],
      leadId: [''],
      image: [''],
    })

    // Generar código cuando cambia el nombre
    this.projectForm.get('name')?.valueChanges.subscribe(name => {
      this.generateProjectCode(name)
    })
  }

  private loadProjectCount(): void {
    if (this.workspaceId) {
      this.projectService.getProjectByWorkspaceId(this.workspaceId).subscribe({
        next: (projects) => {
          this.projectCount = (projects?.length || 0) + 1
        },
        error: () => {
          this.projectCount = 1
        }
      })
    }
  }

  private generateProjectCode(name: string): void {
    if (!name || name.trim().length === 0) {
      this.projectForm.patchValue({ code: '' })
      return
    }

    // Generar prefijo basado en el nombre
    const words = name.trim().toUpperCase().split(/\s+/)
    let prefix: string

    if (words.length >= 2) {
      // Si hay múltiples palabras, usar las iniciales (máx 3)
      prefix = words.slice(0, 3).map(w => w[0]).join('')
    } else {
      // Si es una sola palabra, usar las primeras 3 letras
      prefix = words[0].substring(0, 3)
    }

    const code = `${prefix}-${this.projectCount.toString().padStart(3, '0')}`
    this.projectForm.patchValue({ code })
  }

  private getWorkspaceStorageKey(): string {
    const userId = sessionStorage.getItem('userId')
    return userId ? `workspace_${userId}` : 'selectedWorkspaceId'
  }

  private loadWorkspaceMembers(): void {
    if (this.workspaceId) {
      this.workspaceService.getWorkspaceMembers(this.workspaceId).subscribe({
        next: (response) => {
          this.workspaceMembers = response?.members?.map((m: any) => m.user) || []
        },
        error: (err) => {
          console.error('Error loading workspace members:', err)
        }
      })
    }
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (file) {
      this.isUploading = true

      const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml']
      if (!allowedTypes.includes(file.type)) {
        alert('Invalid file type. Please upload JPG, PNG, or SVG.')
        this.isUploading = false
        this.resetFileInput()
        return
      }
      const maxSize = 1 * 1024 * 1024
      if (file.size > maxSize) {
        alert('File size exceeds 1MB. Please upload a smaller image.')
        this.isUploading = false
        this.resetFileInput()
        return
      }

      this.cloudinaryService.uploadImage(file)
        .then((imageUrl) => {
          this.projectForm.patchValue({ image: imageUrl })
          this.projectForm.get('image')?.markAsDirty()
          console.log('Image uploaded successfully:', imageUrl)
          this.resetFileInput()
        })
        .catch((error) => {
          console.error('Error uploading image:', error)
          const errorMsg = error?.error?.error?.message || error?.message || 'Unknown error occurred'
          alert(`Error uploading image: ${errorMsg}. Please check console for details.`)
          this.resetFileInput()
        }).finally(() => {
          this.isUploading = false
        })
    }
  }

  resetFileInput() {
    if (this.fileInput) {
      this.fileInput.nativeElement.value = ''
    }
  }

  removeImage() {
    this.projectForm.patchValue({ image: '' })
    this.projectForm.get('image')?.markAsDirty()
    this.resetFileInput()
  }

  onCancel(): void {
    this.router.navigate(['/pages', this.workspaceId, 'dashboard'])
  }

  onSubmit(): void {
    const rawValue = this.projectForm.getRawValue()
    const code = rawValue.code

    if (!code || code.trim().length === 0) {
      console.log('El código del proyecto es requerido')
      return
    }

    if (this.projectForm.valid && this.workspaceId) {
      // Limpiar datos - solo enviar campos con valor
      const projectData: any = {
        code: rawValue.code,
        name: rawValue.name,
        type: rawValue.type,
        status: rawValue.status || 'ONGOING',
        visibility: rawValue.visibility || 'PRIVATE',
      }

      // Solo agregar campos opcionales si tienen valor
      if (rawValue.description) projectData.description = rawValue.description
      if (rawValue.image) projectData.image = rawValue.image
      if (rawValue.startDate) projectData.startDate = rawValue.startDate
      if (rawValue.endDate) projectData.endDate = rawValue.endDate
      if (rawValue.leadId) projectData.leadId = rawValue.leadId

      console.log('Datos a enviar:', projectData)
      this.projectService.postProject(this.workspaceId, projectData)
        .subscribe({
          next: (response) => {
            console.log('Project creado con éxito', response)
            if (response && response.length > 0) {
              this.projectForm.reset()
              this.router.navigate(['/pages', this.workspaceId, 'dashboard'])
            }
          },
          error: (err) => {
            console.error('Error al crear el project', err)
          }
        })
    } else {
      console.log('Formulario inválido o workspaceId no disponible')
      console.log('Form valid:', this.projectForm.valid)
      console.log('WorkspaceId:', this.workspaceId)
      Object.keys(this.projectForm.controls).forEach(key => {
        const control = this.projectForm.get(key)
        if (control?.invalid) {
          console.log(`Campo inválido: ${key}`, control.errors)
        }
      })
    }
  }
}
