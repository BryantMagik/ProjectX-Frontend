import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { User } from '../../model/user.interface'
import { WorkspaceService } from '../../service/workspace/workspace.service'
import { CommonModule } from '@angular/common'
import { CloudinaryService } from '../../service/cloudinary/cloudinary.service'

@Component({
    selector: 'app-workspace-form',
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './workspace-form.component.html',
    styleUrl: './workspace-form.component.css'
})
export class WorkspaceFormComponent implements OnInit {

  workspaceForm!: FormGroup
  users: User[] = []
  authorId: string | null = null
  isUploading = false

  constructor(
    private fb: FormBuilder,
    private workspaceService: WorkspaceService,
    private cloudinaryService: CloudinaryService
  ) { }


  ngOnInit(): void {
    this.authorId = sessionStorage.getItem('userId');
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

      const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
      if (!allowedTypes.includes(file.type)) {
        alert('Invalid file type. Please upload JPG, PNG, or SVG.');
        return;
      }
      const maxSize = 1 * 1024 * 1024
      if (file.size > maxSize) {
        alert('File size exceeds 1MB. Please upload a smaller image.');
        return;
      }

      this.cloudinaryService.uploadImage(file)
        .then((imageUrl) => {
          this.workspaceForm.patchValue({ image: imageUrl })
          console.log('Image uploaded successfully:', imageUrl);
        },
          (error) => {
            console.error('Error uploading image:', error);
          }
        ).finally(() => {
          this.isUploading = false;
        })
    }
  }

  onSubmit(): void {
    if (this.workspaceForm.valid) {
      const workspaceData = {
        ...this.workspaceForm.value,
        image: this.workspaceForm.get('image')?.value || null
      }
      console.log('Datos a enviar:', workspaceData)
      this.workspaceService.postWorkspace(workspaceData)
        .subscribe({
          next: (response) => {
            console.log('Workspace creado con éxito', response);

          },
          error: (err) => {
            console.log('Error al crear el workspace', err)
          }
        })
    } else {
      console.log('formulario inválido')
    }
  }
}
