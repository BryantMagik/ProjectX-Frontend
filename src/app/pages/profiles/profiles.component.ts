import { Component, OnInit } from '@angular/core';
import { User } from '../../model/user.interface';
import { UserService } from '../../service/user/user.service';
import { CommonModule } from '@angular/common';
import { tap } from 'rxjs';


@Component({
  selector: 'app-profiles',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profiles.component.html',
  styleUrl: './profiles.component.css'
})

export class ProfilesComponent implements OnInit {
  user: User | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.loadUserProfile();
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
}