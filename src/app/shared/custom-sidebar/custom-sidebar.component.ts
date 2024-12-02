import { CommonModule } from '@angular/common'
import { Component, EventEmitter, Output, signal } from '@angular/core';
import { MatListModule } from '@angular/material/list'
import { MatIconModule } from '@angular/material/icon'
import { RouterLink, RouterModule } from '@angular/router'
import { MENU_ITEMS } from '../../constants/menu-items'
import { MenuItem } from '../../model/menu.interface'
import { ProjectSwitcherComponent } from "../project-switcher/project-switcher.component";

@Component({
  selector: 'app-custom-sidebar',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule, RouterLink, RouterModule, ProjectSwitcherComponent],
  templateUrl: './custom-sidebar.component.html',
  styleUrl: './custom-sidebar.component.css'
})
export class CustomSidebarComponent {
  @Output() openModalEvent = new EventEmitter<void>();

  constructor() { }

  menuItems = signal<MenuItem[]>(MENU_ITEMS)
  openModal() {
    this.openModalEvent.emit()
  }
}
