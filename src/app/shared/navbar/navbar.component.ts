import { Component, Input, OnInit, signal } from '@angular/core'
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
  @Input() user: User | null = null;

  constructor(
  ) {
  }
  menuItems = signal<MenuItem[]>(MENU_ITEMS)

  ngOnInit(): void {

  }


}