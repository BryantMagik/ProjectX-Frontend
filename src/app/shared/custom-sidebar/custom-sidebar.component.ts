import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, signal, SimpleChanges } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { MenuItem } from '../../model/menu.interface';
import { WorkspaceSwitcherComponent } from '../workspace-switcher/workspace-switcher.component';
import { createMenuItems } from '../../constants/menu-items';
import { BehaviorSubject } from 'rxjs';
import { ProjectListComponent } from "../project-list/project-list.component";

@Component({
  selector: 'app-custom-sidebar',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule, RouterLink, RouterModule, WorkspaceSwitcherComponent, ProjectListComponent],
  templateUrl: './custom-sidebar.component.html',
  styleUrl: './custom-sidebar.component.css'
})
export class CustomSidebarComponent implements OnInit {
  @Output() openModalEvent = new EventEmitter<void>()
  selectedWorkspaceId: string | null = null 

  private selectedWorkspaceSubject = new BehaviorSubject<string | null>(null)
  selectedWorkspaceId$ = this.selectedWorkspaceSubject.asObservable()
  menuItems: MenuItem[] = [];

  constructor(
    private route: ActivatedRoute,
  ) {
    
  }

  ngOnInit(): void {
    this.selectedWorkspaceId$.subscribe(workspaceId => {
      if (workspaceId) {
        this.menuItems = createMenuItems(workspaceId);
      }
    });
  }

  
  openModal() {
    this.openModalEvent.emit()
    const workspaceId = this.route.snapshot.paramMap.get('id')
    console.log('Workspace ID:', workspaceId)

  }
  onWorkspaceSelected(workspaceId: string): void {
    this.selectedWorkspaceId = workspaceId
    this.selectedWorkspaceSubject.next(workspaceId);

    console.log('Workspace ID en Sidebar:', workspaceId)
  }
}
