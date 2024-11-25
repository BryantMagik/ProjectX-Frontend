import { Component, OnInit, signal } from '@angular/core'
import { CommonModule, NgIf } from '@angular/common'
import { User } from '../../model/user.interface'
import { BreadcrumbModule } from 'primeng/breadcrumb'
import { RouterModule } from '@angular/router'
import { MenuItem } from 'primeng/api'
import { MENU_ITEMS } from '../../constants/menu-items'
import { AvatarModule } from 'primeng/avatar';
import { FormsModule } from '@angular/forms'
import { AvatarDropdownComponent } from "../avatar-dropdown/avatar-dropdown.component";
import { UserService } from '../../service/user/user.service'
import { tap } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [AvatarModule, CommonModule, RouterModule, BreadcrumbModule, FormsModule, AvatarDropdownComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  loading = true;
  error: string | null = null;
  user: User | null = null;

  constructor(
    private userService: UserService
  ) {
  }
  menuItems = signal<MenuItem[]>(MENU_ITEMS)

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