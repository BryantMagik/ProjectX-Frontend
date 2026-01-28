import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core'
import { Workspace } from '../../model/workspace.interface'
import { WorkspaceService } from '../../service/workspace/workspace.service'
import { tap } from 'rxjs'
import { FormsModule } from '@angular/forms'

import { ActivatedRoute, Router } from '@angular/router'

@Component({
    selector: 'app-workspace-switcher',
    imports: [FormsModule],
    standalone: true,
    templateUrl: './workspace-switcher.component.html',
    styleUrl: './workspace-switcher.component.css'
})
export class WorkspaceSwitcherComponent implements OnInit {
  private workspaceService = inject(WorkspaceService);

  @Output() workspaceSelected = new EventEmitter<string>()

  workspaces: Workspace[] = []
  error: string | null = null
  loading: boolean = true
  selectedWorkspaceId: string | null = null
  selectedWorkspace: Workspace | null = null
  dropdownOpen: boolean = false

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() { }


  selectWorkspace(workspace: Workspace): void {
    this.selectedWorkspace = workspace
    this.selectedWorkspaceId = workspace.id
    this.dropdownOpen = false
    this.workspaceSelected.emit(this.selectedWorkspaceId!)
  }

  ngOnInit(): void {
    this.getWorkspaces()
  }

  private getWorkspaces(): void {
    this.workspaceService.getAllWorkspace().pipe(
      tap({
        next: (workspace: Workspace[] | null) => {
          if (workspace) {
            this.workspaces = workspace
          }
        },
        error: () => this.error = 'Failed to load workspaces',
        complete: () => this.loading = false
      })
    ).subscribe()
  }
}
