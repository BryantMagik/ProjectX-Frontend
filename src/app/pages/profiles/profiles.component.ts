import { Component, OnInit, inject } from '@angular/core';
import { User } from '../../model/user.interface';
import { UserService } from '../../service/user/user.service';

import { first, tap } from 'rxjs';
import { CloudinaryService } from '../../core/services/cloudinary.service';
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
    selector: 'app-profiles',
    imports: [],
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

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

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
          if (!user) {
            this.error = 'Failed to load user profile';
          }
        },
        error: () => this.error = 'Failed to load user profile',
        complete: () => this.loading = false,
      })
    ).subscribe();
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