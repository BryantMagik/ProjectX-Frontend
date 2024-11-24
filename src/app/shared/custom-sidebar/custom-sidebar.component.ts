import { CommonModule } from '@angular/common'
import { Component, signal } from '@angular/core'
import { MatListModule } from '@angular/material/list'
import { MatIconModule } from '@angular/material/icon'
import { RouterLink, RouterModule } from '@angular/router'
import { AuthService } from '../../service/auth/auth.service'
import { MENU_ITEMS } from '../menu-items/menu-items'
import { MenuItem } from '../../model/menu.interface'

@Component({
  selector: 'app-custom-sidebar',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule, RouterLink, RouterModule],
  templateUrl: './custom-sidebar.component.html',
  styleUrl: './custom-sidebar.component.css'
})
export class CustomSidebarComponent {

  constructor(private authService: AuthService) { }

  menuItems = signal<MenuItem[]>(MENU_ITEMS)

  onLogout(): void {
    this.authService.logout()
  }

}
