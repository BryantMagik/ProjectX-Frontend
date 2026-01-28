import { Component, Input, OnInit, signal } from '@angular/core'

import { User } from '../../model/user.interface'
import { BreadcrumbModule } from 'primeng/breadcrumb'
import { RouterModule } from '@angular/router'
import { AvatarModule } from 'primeng/avatar';
import { FormsModule } from '@angular/forms'
import { AvatarDropdownComponent } from "../avatar-dropdown/avatar-dropdown.component";
import { MobilDropdownComponent } from '../mobil-dropdown/mobil-dropdown.component'

@Component({
    selector: 'app-navbar',
    imports: [AvatarModule, RouterModule, BreadcrumbModule, FormsModule, AvatarDropdownComponent, MobilDropdownComponent],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css',
    standalone:true

})
export class NavbarComponent {
  loading = true
  error: string | null = null

  @Input() user: User | null = null

}