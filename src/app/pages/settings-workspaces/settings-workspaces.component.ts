import { Component, OnInit, OnDestroy, inject } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Subscription, tap } from 'rxjs'
import { Workspace } from '../../model/workspace.interface'
import { WorkspaceService } from '../../service/workspace/workspace.service'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { CloudinaryService } from '../../core/services/cloudinary.service'
import { ModalDeleteWorkspaceComponent } from "../../shared/modal-delete-workspace/modal-delete-workspace.component"

@Component({
    selector: 'app-settings',
    imports: [ReactiveFormsModule, CommonModule, ModalDeleteWorkspaceComponent],
    templateUrl: './settings-workspaces.component.html',
    styleUrl: './settings-workspaces.component.css',
    standalone:true
})
export class SettingsComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private workspaceService = inject(WorkspaceService);
  private cloudinaryService = inject(CloudinaryService);

  workspaceForm!: FormGroup
  workspaceId: string | null = null
  workspace: Workspace | null = null
  loading = true
  error: string | null = null
  routeSub: Subscription | null = null
  isUploading = false
  authorId: string | null = null
  showModal: boolean = false
  successMessage: string | null = null


  constructor() { }

  ngOnInit(): void {
    this.routeSub = this.route.parent?.paramMap.subscribe(params => {
      this.workspaceId = params.get('workspaceId')
      if (this.workspaceId) {
        this.getWorkspaceById(this.workspaceId)
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
      this.error = null

      const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml']
      if (!allowedTypes.includes(file.type)) {
        this.error = 'Invalid file type. Please upload JPG, PNG, or SVG.'
        this.isUploading = false
        return
      }
      const maxSize = 1 * 1024 * 1024
      if (file.size > maxSize) {
        this.error = 'File size exceeds 1MB. Please upload a smaller image.'
        this.isUploading = false
        return
      }

      this.cloudinaryService.uploadImage(file)
        .then((imageUrl) => {
          this.workspaceForm.patchValue({ image: imageUrl })
          this.successMessage = 'Image uploaded successfully!'
          setTimeout(() => this.successMessage = null, 3000)
        },
          (error) => {
            this.error = 'Failed to upload image. Please try again.'
            console.error('Upload error:', error)
          }
        ).finally(() => {
          this.isUploading = false;
        })
    }
  }

  removeImage(): void {
    this.workspaceForm.patchValue({ image: '' })
    this.successMessage = 'Image removed'
    setTimeout(() => this.successMessage = null, 2000)
  }

  toggleModal(): void {
    this.showModal = !this.showModal
  }

  handleDelete(): void {
    if (this.workspaceId) {
      this.loading = true
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
    if (this.workspaceForm.valid && !this.isUploading) {
      this.error = null
      this.successMessage = null

      const workspaceData: Workspace = this.workspaceForm.value
      if (this.workspaceId) {
        this.loading = true
        this.workspaceService.updateWorkspace(workspaceData, this.workspaceId).subscribe({
          next: (response) => {
            this.successMessage = 'Workspace updated successfully!'
            this.workspace = response
            this.loading = false

            // Clear success message after 3 seconds
            setTimeout(() => this.successMessage = null, 3000)
          },
          error: (error) => {
            console.error('Error updating workspace:', error)
            this.error = 'Failed to update workspace. Please try again.'
            this.loading = false
          }
        })
      }
    } else if (this.isUploading) {
      this.error = 'Please wait for the image to finish uploading.'
    } else {
      this.error = 'Please fill in all required fields correctly.'
    }
  }

  private getWorkspaceById(workspaceId: string): void {
    this.loading = true
    this.error = null

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
          } else {
            this.error = 'Workspace not found'
          }
        },
        error: (error) => {
          console.error('Error loading workspace:', error)
          this.error = 'Failed to load workspace. Please try again.'
        },
        complete: () => this.loading = false
      })
    ).subscribe()
  }

  private deleteWorkspace(workspaceId: string): void {
    this.workspaceService.deleteWorkspace(workspaceId).pipe(
      tap({
        next: () => {
          this.successMessage = 'Workspace deleted successfully. Redirecting...'
          // Redirect to workspaces list or home after 2 seconds
          setTimeout(() => {
            this.router.navigate(['/workspaces'])
          }, 2000)
        },
        error: (error) => {
          console.error('Error deleting workspace:', error)
          this.error = 'Failed to delete workspace. Please try again.'
          this.loading = false
        }
      })
    ).subscribe()
  }
}
