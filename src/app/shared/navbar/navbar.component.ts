import { Component, Input, OnInit, signal } from '@angular/core'
import { CommonModule, NgIf } from '@angular/common'
import { User } from '../../model/user.interface'
import { BreadcrumbModule } from 'primeng/breadcrumb'
import { RouterModule } from '@angular/router'
import { AvatarModule } from 'primeng/avatar';
import { FormsModule } from '@angular/forms'
import { AvatarDropdownComponent } from "../avatar-dropdown/avatar-dropdown.component";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [AvatarModule, CommonModule, RouterModule, BreadcrumbModule, FormsModule, AvatarDropdownComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  loading = true
  error: string | null = null
  
  @Input() user: User | null = null
  
  constructor(
  ) {
  }

  ngOnInit(): void {

  }


}