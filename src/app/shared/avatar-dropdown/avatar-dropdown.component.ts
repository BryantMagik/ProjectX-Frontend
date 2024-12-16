import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AvatarModule } from 'primeng/avatar';
import { MenuItem } from '../../model/menu.interface';
import { MENU_PROFILE } from '../../constants/menu-items';
import { RouterLink, RouterModule } from '@angular/router'
import { User } from '../../model/user.interface';
import { userTypeMap } from '../../constants/user-type-items';
import { AuthService } from '../../service/auth/auth.service';

@Component({
  selector: 'app-avatar-dropdown',
  standalone: true,
  imports: [AvatarModule, FormsModule, CommonModule, MatIconModule, RouterLink, RouterModule],
  templateUrl: './avatar-dropdown.component.html',
  styleUrl: './avatar-dropdown.component.css'
})
export class AvatarDropdownComponent {
  @Input() user: User | null = null

  constructor(private authService: AuthService) { }

  onLogout(): void {
    this.authService.logout()
  }
  dropdownVisible = false
  selectedOption: string = ''
  menuItems = signal<MenuItem[]>(MENU_PROFILE)
  userTypeMap = userTypeMap

  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }
  selectOption(option: string): void {
    if (option === 'Sign Out') {
      this.onLogout();
    } else {
      this.selectedOption = option;
      this.dropdownVisible = false;
    }
  }
  closeDropdown() {
    this.dropdownVisible = false;
  }


  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const clickedInside = event.target instanceof HTMLElement && event.target.closest('.dropdown-container');
    if (!clickedInside) {
      this.closeDropdown();
    }
  }
}
