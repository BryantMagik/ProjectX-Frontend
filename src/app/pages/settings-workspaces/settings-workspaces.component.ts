import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { finalize, Subscription, tap } from 'rxjs'
import { Workspace } from '../../model/workspace.interface'
import { WorkspaceService } from '../../service/workspace/workspace.service'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { CloudinaryService } from '../../service/cloudinary/cloudinary.service'
import { ModalDeleteWorkspaceComponent } from "../../shared/modal-delete-workspace/modal-delete-workspace.component";

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ModalDeleteWorkspaceComponent],
  templateUrl: './settings-workspaces.component.html',
  styleUrl: './settings-workspaces.component.css'
})
export class SettingsComponent implements OnInit {

  workspaceForm!: FormGroup
  workspaceId: string | null = null
  workspace: Workspace | null = null
  loading = true
  error: string | null = null
  routeSub: Subscription | null = null
  isUploading = false
  authorId: string | null = null
  showModal: boolean = false

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private workspaceService: WorkspaceService,
    private cloudinaryService: CloudinaryService
  ) { }

  ngOnInit(): void {
    this.routeSub = this.route.parent?.paramMap.subscribe(params => {
      this.workspaceId = params.get('workspaceId')
      if (this.workspaceId) {
        this.getWorkspaceById(this.workspaceId)
      } else {
      }
    }) || null

    this.workspaceForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(30)]],
      description: [''],
      image: [''],
    })
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (file) {
      this.isUploading = true

      const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml']
      if (!allowedTypes.includes(file.type)) {
        alert('Invalid file type. Please upload JPG, PNG, or SVG.')
        return
      }
      const maxSize = 1 * 1024 * 1024
      if (file.size > maxSize) {
        alert('File size exceeds 1MB. Please upload a smaller image.')
        return
      }

      this.cloudinaryService.uploadImage(file)
        .then((imageUrl) => {
          this.workspaceForm.patchValue({ image: imageUrl })
        },
          (error) => {
          }
        ).finally(() => {
          this.isUploading = false;
        })
    }
  }

  toggleModal(): void {
    this.showModal = !this.showModal
  }

  handleDelete(): void {
    console.log("Workspace Eliminado " + this.workspaceId)
    if (this.workspaceId) {
      this.deleteWorkspace(this.workspaceId)
    }
    this.toggleModal()
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe()
    }
  }

  onSubmit(): void {
    if (this.workspaceForm.valid) {
      console.log('Workspace form data:', this.workspaceForm.value)
      const workspaceData: Workspace = this.workspaceForm.value
      if (this.workspaceId) {
        this.workspaceService.updateWorkspace(workspaceData, this.workspaceId).subscribe({
          next: (response) => {

          }, error: (error) => {
            console.error('Error creating workspace:', error)
          }
        })
      }
    }
  }

  private getWorkspaceById(workspaceId: string): void {
    this.workspaceService.getWorkspaceById(workspaceId).pipe(
      tap({
        next: (workspace: Workspace | null) => {
          this.workspace = workspace
          if (workspace) {
            this.workspaceForm.patchValue({
              name: workspace.name,
              description: workspace.description,
              image: workspace.image
            })
          }
        },
        error: () => this.error = 'Failed to load workspace',
        complete: () => this.loading = false
      })
    ).subscribe()
  }

  private deleteWorkspace(workspaceId: string): void {
    this.workspaceService.deleteWorkspace(workspaceId).pipe(
      tap({
        next: (response) => { },
        error: (error) => { }
      },
      ),
    ).subscribe()
  }
}
