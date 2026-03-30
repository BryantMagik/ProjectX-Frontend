import { Component, OnInit, inject, ViewChild, ElementRef } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { User } from '../../../../core/models/user.interface'
import { WorkspaceService } from '../../../../service/workspace/workspace.service'
import { Router } from '@angular/router'
import { CloudinaryService } from '../../../../core/services/cloudinary.service'
import { CommonModule } from '@angular/common'
import { injectMutation, injectQueryClient } from '@tanstack/angular-query-experimental'
import { firstValueFrom } from 'rxjs'
import { WorkspaceStore } from '../../../../core/services/workspace.store'

@Component({
    selector: 'app-workspace-form',
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './workspace-form.component.html',
    styleUrl: './workspace-form.component.css',
    standalone:true

})
export class WorkspaceFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private workspaceService = inject(WorkspaceService);
  private cloudinaryService = inject(CloudinaryService);
  private router = inject(Router);
  private queryClient = injectQueryClient();
  private workspaceStore = inject(WorkspaceStore);

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  workspaceForm!: FormGroup
  users: User[] = []
  authorId: string | null = null
  isUploading = false

  createWorkspaceMutation = injectMutation(() => ({
    mutationFn: (workspaceData: any) => firstValueFrom(this.workspaceService.postWorkspace(workspaceData)),
    onSuccess: (response: any) => {
      const newWorkspaceId = response?.workspace?.id as string | undefined;
      this.queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      this.workspaceForm.reset();
      if (newWorkspaceId) {
        this.workspaceStore.select(newWorkspaceId);
        this.router.navigate(['/workspaces', newWorkspaceId, 'dashboard']);
      }
    },
  }));

  constructor() { }


  ngOnInit(): void {
    this.authorId = sessionStorage.getItem('userId');
    this.workspaceForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: [''],
      image: [''],
    })
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (file) {
      this.isUploading = true

      const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
      if (!allowedTypes.includes(file.type)) {
        alert('Invalid file type. Please upload JPG, PNG, or SVG.');
        this.isUploading = false;
        this.resetFileInput();
        return;
      }
      const maxSize = 1 * 1024 * 1024
      if (file.size > maxSize) {
        alert('File size exceeds 1MB. Please upload a smaller image.');
        this.isUploading = false;
        this.resetFileInput();
        return;
      }

      this.cloudinaryService.uploadImage(file)
        .then((imageUrl) => {
          this.workspaceForm.patchValue({ image: imageUrl })
          this.workspaceForm.get('image')?.markAsDirty();
          console.log('Image uploaded successfully:', imageUrl);
          this.resetFileInput();
        })
        .catch((error) => {
            console.error('Error uploading image:', error);
            const errorMsg = error?.error?.error?.message || error?.message || 'Unknown error occurred';
            alert(`Error uploading image: ${errorMsg}. Please check console for details.`);
            this.resetFileInput();
          }
        ).finally(() => {
          this.isUploading = false;
        })
    }
  }

  resetFileInput() {
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  removeImage() {
    this.workspaceForm.patchValue({ image: '' });
    this.workspaceForm.get('image')?.markAsDirty();
    this.resetFileInput();
  }

  onSubmit(): void {
    if (this.workspaceForm.valid) {
      const imageValue = this.workspaceForm.get('image')?.value;
      const workspaceData = {
        ...this.workspaceForm.value,
        image: imageValue || undefined
      };
      this.createWorkspaceMutation.mutate(workspaceData);
    }
  }
}
