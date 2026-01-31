import { Component, OnInit, Input, inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../service/project/project.service';
import { CloudinaryService } from '../../core/services/cloudinary.service';
import { Project } from '../../model/project.interface';
import { Location } from '@angular/common';
import { PROYECTOTYPE, PROYECTOSTATUS } from '../../types/models';
import { ModalDeleteProjectComponent } from "../../shared/modal-delete-project/modal-delete-project.component";

@Component({
  selector: 'app-edit-project',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalDeleteProjectComponent],
  templateUrl: './edit-project.component.html',
  styleUrl: './edit-project.component.css'
})
export class EditProjectComponent implements OnInit {
  private fb = inject(FormBuilder);
  private projectService = inject(ProjectService);
  private cloudinaryService = inject(CloudinaryService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @Input() workspace: string | null = null

  projectForm: FormGroup
  projectId: string | null = null
  projectImage: string | ArrayBuffer | null = ''
  project: Project | null = null
  showModal: boolean = false
  uploading: boolean = false
  projectTypes = PROYECTOTYPE
  projectStatuses = PROYECTOSTATUS

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
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

  async onFileSelected(event: Event): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) {
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      alert('Please select a valid image file (JPG, PNG, or SVG)');
      this.resetFileInput();
      return;
    }

    // Validate file size (1MB max)
    const maxSize = 1 * 1024 * 1024; // 1MB in bytes
    if (file.size > maxSize) {
      alert('File size must be less than 1MB');
      this.resetFileInput();
      return;
    }

    this.uploading = true;

    // Upload to Cloudinary
    try {
      const imageUrl = await this.cloudinaryService.uploadImage(file);
      console.log('Image uploaded successfully:', imageUrl);
      this.projectImage = imageUrl;
      this.projectForm.patchValue({ image: imageUrl });
      this.projectForm.markAsDirty();
      this.uploading = false;
      alert('Image uploaded successfully!');
    } catch (error: any) {
      console.error('Error uploading image:', error);
      this.uploading = false;
      alert('Failed to upload image. Please try again.');
      this.resetFileInput();
    }
  }

  resetFileInput(): void {
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  removeImage(): void {
    this.projectImage = '';
    this.projectForm.patchValue({ image: '' });
    this.projectForm.markAsDirty();
    this.resetFileInput();
  }

  onSubmit(): void {
    if (this.projectForm.valid && this.projectId) {
      this.uploading = true;

      const updatedProject: Partial<Project> = {
        ...this.projectForm.value,
        id: this.projectId,
        image: typeof this.projectImage === 'string' ? this.projectImage : ''
      };

      this.projectService.updateProject(updatedProject as Project, this.projectId).subscribe({
        next: () => {
          console.log('Project updated successfully');
          this.uploading = false;
          alert('Project updated successfully!');
          this.location.back();
        },
        error: (error) => {
          console.error('Error updating project:', error);
          this.uploading = false;
          alert('Failed to update project. Please try again.');
        }
      });
    }
  }

  toggleModal() {
    this.showModal = !this.showModal

  }

  handleDelete(): void {
    console.log("Workspace Eliminado " + this.projectId)
    if (this.projectId) {
      this.deleteProject(this.projectId)
    }
    this.toggleModal()
  }

  private deleteProject(project: string): void {
    //todoo
  }
}
