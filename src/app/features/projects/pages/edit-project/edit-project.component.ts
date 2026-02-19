import { Component, OnInit, Input, inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../data-access/project.service';
import { CloudinaryService } from '../../../../core/services/cloudinary.service';
import { Project } from '../../../../core/models/project.interface';
import { Location } from '@angular/common';
import { PROYECTOTYPE, PROYECTOSTATUS, PROYECTOVISIBILITY } from '../../../../shared/constants/models';
import { ModalDeleteProjectComponent } from '../../components/modal-delete-project/modal-delete-project.component';
import { WorkspaceService } from '../../../../service/workspace/workspace.service';
import { User } from '../../../../core/models/user.interface';
import { Select } from 'primeng/select';

@Component({
  selector: 'app-edit-project',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalDeleteProjectComponent, Select],
  templateUrl: './edit-project.component.html',
  styleUrl: './edit-project.component.css'
})
export class EditProjectComponent implements OnInit {
  private fb = inject(FormBuilder);
  private projectService = inject(ProjectService);
  private cloudinaryService = inject(CloudinaryService);
  private workspaceService = inject(WorkspaceService);
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
  workspaceMembers: User[] = []

  projectTypes = PROYECTOTYPE
  projectStatuses = PROYECTOSTATUS
  projectVisibilities = PROYECTOVISIBILITY

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
    this.projectForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      status: ['', Validators.required],
      type: ['', Validators.required],
      visibility: ['PRIVATE'],
      startDate: [''],
      endDate: [''],
      leadId: [''],
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
          this.project = project;
          this.projectForm.patchValue({
            name: project.name,
            description: project.description,
            status: project.status,
            type: project.type,
            visibility: project.visibility || 'PRIVATE',
            startDate: project.startDate ? project.startDate.substring(0, 10) : '',
            endDate: project.endDate ? project.endDate.substring(0, 10) : '',
            leadId: project.leadId || '',
            image: project.image || ''
          });
          this.projectImage = project.image || '';

          if (project.workspaceId) {
            this.loadWorkspaceMembers(project.workspaceId);
          }
        }
      });
    }
  }

  private loadWorkspaceMembers(workspaceId: string): void {
    this.workspaceService.getWorkspaceMembers(workspaceId).subscribe({
      next: (response) => {
        this.workspaceMembers = response?.members?.map((m: any) => m.user).filter((u: any) => u != null) || [];
      },
      error: (err) => {
        console.error('Error loading workspace members:', err);
      }
    });
  }

  async onFileSelected(event: Event): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) {
      return;
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      alert('Please select a valid image file (JPG, PNG, or SVG)');
      this.resetFileInput();
      return;
    }

    const maxSize = 1 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('File size must be less than 1MB');
      this.resetFileInput();
      return;
    }

    this.uploading = true;

    try {
      const imageUrl = await this.cloudinaryService.uploadImage(file);
      this.projectImage = imageUrl;
      this.projectForm.patchValue({ image: imageUrl });
      this.projectForm.markAsDirty();
      this.uploading = false;
      this.resetFileInput();
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

      const raw = this.projectForm.value;
      const updatedProject: Partial<Project> = {
        name: raw.name,
        description: raw.description,
        status: raw.status,
        type: raw.type,
        visibility: raw.visibility,
      };

      // Solo enviar campos opcionales si tienen valor (evita fallos de validación en backend)
      if (this.projectImage && typeof this.projectImage === 'string') updatedProject.image = this.projectImage;
      if (raw.startDate) updatedProject.startDate = new Date(raw.startDate).toISOString();
      if (raw.endDate) updatedProject.endDate = new Date(raw.endDate).toISOString();
      if (raw.leadId) updatedProject.leadId = raw.leadId;

      this.projectService.updateProject(updatedProject as Project, this.projectId).subscribe({
        next: () => {
          this.uploading = false;
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
    this.showModal = !this.showModal;
  }

  handleDelete(): void {
    if (this.projectId) {
      this.deleteProject(this.projectId);
    }
    this.toggleModal();
  }

  private deleteProject(project: string): void {
    //todoo
  }
}
