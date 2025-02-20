import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, signal, SimpleChanges } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { MenuItem } from '../../model/menu.interface';
import { WorkspaceSwitcherComponent } from '../workspace-switcher/workspace-switcher.component';
import { createMenuItems } from '../../constants/menu-items';
import { BehaviorSubject } from 'rxjs';
import { ProjectListComponent } from "../project-list/project-list.component";

@Component({
  selector: 'app-custom-sidebar',
  imports: [CommonModule, MatListModule, MatIconModule, RouterLink, RouterModule, WorkspaceSwitcherComponent, ProjectListComponent],
  templateUrl: './custom-sidebar.component.html',
  styleUrl: './custom-sidebar.component.css',
  standalone: true

})
export class CustomSidebarComponent implements OnInit {

  @Output() workspaceSelected = new EventEmitter<string>()
  @Output() openModalEvent = new EventEmitter<void>()
  selectedWorkspaceId: string | null = null

  private selectedWorkspaceSubject = new BehaviorSubject<string | null>(null)
  selectedWorkspaceId$ = this.selectedWorkspaceSubject.asObservable()
  menuItems: MenuItem[] = [];

  constructor(
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.selectedWorkspaceId$.subscribe(workspaceId => {
      if (workspaceId) {
        this.menuItems = createMenuItems(workspaceId);
      }
    })
  }


  openModal() {
    this.openModalEvent.emit()
  }
  
  onWorkspaceSelected(workspaceId: string): void {
    this.selectedWorkspaceId = workspaceId
    this.selectedWorkspaceSubject.next(workspaceId)
    this.router.navigate([`/pages/${workspaceId}/dashboard`])
    this.workspaceSelected.emit(workspaceId)

    console.log('Workspace ID en Sidebar:', workspaceId);

  }
}
