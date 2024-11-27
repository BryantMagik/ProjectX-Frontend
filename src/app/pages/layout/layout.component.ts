import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { CustomSidebarComponent } from '../../shared/custom-sidebar/custom-sidebar.component';
import { UserService } from '../../service/user/user.service';
import { User } from '../../model/user.interface';
import { tap } from 'rxjs';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CustomSidebarComponent,],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit {

  @ViewChild(NavbarComponent) navbarComponent!: NavbarComponent;

  loading = true;
  error: string | null = null;
  user: User | null = null;

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
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