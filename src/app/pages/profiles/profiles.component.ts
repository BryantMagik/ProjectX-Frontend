import { Component, OnInit, inject } from '@angular/core';
import { User } from '../../model/user.interface';
import { UserService } from '../../service/user/user.service';
import { first, tap } from 'rxjs';
import { CloudinaryService } from '../../core/services/cloudinary.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
    selector: 'app-profiles',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './profiles.component.html',
    styleUrl: './profiles.component.css',
    standalone:true
})

export class ProfilesComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private cloudinaryService = inject(CloudinaryService);


  profileForm!: FormGroup
  user: User | null = null
  loading = true;
  error: string | null = null
  isUploading = false

  constructor() { }

  ngOnInit(): void {
    this.loadUserProfile()
    this.profileForm = this.fb.group({
      first_name: [''],
      last_name: [''],
      email: [''],
    })
  }

  private loadUserProfile(): void {
    this.userService.loadUserProfile().pipe(
      tap({
        next: (user: User | null) => {
          this.user = user;
          if (user) {
            this.profileForm.patchValue({
              first_name: user.first_name,
              last_name: user.last_name,
              email: user.email
            });
          } else {
            this.error = 'Failed to load user profile';
          }
        },
        error: () => this.error = 'Failed to load user profile',
        complete: () => this.loading = false,
      })
    ).subscribe();
  }

  updateProfile(): void {
    if (this.profileForm.valid) {
      console.log('Profile updated:', this.profileForm.value);
      // Aquí iría la lógica para actualizar el perfil
    }
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
          // this.workspaceForm.patchValue({ image: imageUrl })
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
}
