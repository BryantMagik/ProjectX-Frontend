import { CommonModule } from '@angular/common';
import { Component,EventEmitter,OnInit,Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { ActivatedRoute, RouterModule, RouterLink } from '@angular/router';
import { WorkspaceSwitcherComponent } from '../workspace-switcher/workspace-switcher.component';
import { ProjectListComponent } from '../project-list/project-list.component';
import { createMenuItems } from '../../constants/menu-items';
import{BehaviorSubject}from 'rxjs';
import { MenuItem } from '../../model/menu.interface';

@Component({
    selector: 'app-mobil-dropdown',
    imports: [MatListModule, MatIconModule, RouterModule, CommonModule, WorkspaceSwitcherComponent, ProjectListComponent],
    templateUrl: './mobil-dropdown.component.html',
    styleUrl: './mobil-dropdown.component.css',
    standalone:true

})
export class MobilDropdownComponent implements OnInit {
  @Output() openModalEvent = new EventEmitter<void>();

  isDropdownOpen: boolean = false;
  menuItems: MenuItem[] = [];
  selectedWorkspaceId: string | null = null;

  private selectedWorkspaceSubject = new BehaviorSubject<string | null>(null);
  selectedWorkspaceId$ = this.selectedWorkspaceSubject.asObservable();

  ngOnInit(): void {
    this.selectedWorkspaceId$.subscribe((workspaceId) => {
      if (workspaceId) {
        this.menuItems = createMenuItems(workspaceId);
      }
    });
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }

  onWorkspaceSelected(workspaceId: string): void {
    this.selectedWorkspaceId = workspaceId;
    this.selectedWorkspaceSubject.next(workspaceId);
  }

  openModal(): void {
    this.openModalEvent.emit();
  }


}
