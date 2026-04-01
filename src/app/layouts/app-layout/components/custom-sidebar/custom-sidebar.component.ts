
import { Component, EventEmitter, Input, Output, inject, computed} from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { WorkspaceSwitcherComponent } from '../../../../features/workspaces/components/workspace-switcher/workspace-switcher.component';
import { createMenuItems } from '../../../../shared/constants/menu-items';
import { ProjectListComponent } from '../../../../features/projects/components/project-list/project-list.component';
import { WorkspaceStore } from '../../../../core/services/workspace.store';

@Component({
  selector: 'app-custom-sidebar',
  imports: [MatListModule, MatIconModule, RouterLink, RouterModule, WorkspaceSwitcherComponent, ProjectListComponent],
  templateUrl: './custom-sidebar.component.html',
  styleUrl: './custom-sidebar.component.css',
  standalone: true
})
export class CustomSidebarComponent {
  private router = inject(Router);
  private workspaceStore = inject(WorkspaceStore);

  @Input() isMobileOpen = false;
  @Output() workspaceSelected = new EventEmitter<string>();
  @Output() openModalEvent = new EventEmitter<void>();
  @Output() closeSidebar = new EventEmitter<void>();

  selectedWorkspaceId = this.workspaceStore.selectedId;
  menuItems = computed(() => {
    const id = this.workspaceStore.selectedId();
    return id ? createMenuItems(id) : [];
  });

  openModal(): void {
    this.openModalEvent.emit();
    this.closeSidebar.emit();
  }

  onWorkspaceSelected(workspaceId: string): void {
    this.router.navigate([`/workspaces/${workspaceId}/dashboard`]);
    this.workspaceSelected.emit(workspaceId);
    this.closeSidebar.emit();
  }

  onSidebarAction(): void {
    this.closeSidebar.emit();
  }
}
