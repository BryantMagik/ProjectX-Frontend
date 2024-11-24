import { Component, OnInit, signal } from '@angular/core'
import { CommonModule, NgIf } from '@angular/common'
import { User } from '../../model/user.interface'
import { BreadcrumbModule } from 'primeng/breadcrumb'
import { Router, RouterLink, RouterModule } from '@angular/router'
import { MenuItem } from 'primeng/api'
import { MENU_ITEMS } from '../menu-items/menu-items'
import { AvatarModule } from 'primeng/avatar';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [AvatarModule, CommonModule,  RouterModule, BreadcrumbModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  isNotificationOpen = false;

  isUsernameDropdownOpen = false;

  isDropdownOpen: boolean = false;
  user: User | null = null;

  breadcrumbs: Array<{ label: string; url: string }> = [];
  constructor(
    private router: Router,
  ) {
  }

  menuItems = signal<MenuItem[]>(MENU_ITEMS)


  toggleNotificationDropdown() {
    this.isNotificationOpen = !this.isNotificationOpen;
  }
  navigateToProfile() {
    this.router.navigate(['/pages/profile']);
  }
  toggleUsernameDropdown() {
    this.isUsernameDropdownOpen = !this.isUsernameDropdownOpen;
  }
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  ngOnInit(): void {
  }
}