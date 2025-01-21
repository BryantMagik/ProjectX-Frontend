import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { Workspace } from '../../model/workspace.interface'
import { WorkspaceService } from '../../service/workspace/workspace.service'
import { tap } from 'rxjs'
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { ActivatedRoute, Router } from '@angular/router'

@Component({
    selector: 'app-workspace-switcher',
    imports: [FormsModule, CommonModule],
    templateUrl: './workspace-switcher.component.html',
    styleUrl: './workspace-switcher.component.css'
})
export class WorkspaceSwitcherComponent implements OnInit {
  @Output() workspaceSelected = new EventEmitter<string>()

  workspaces: Workspace[] = []
  error: string | null = null
  loading: boolean = true
  selectedWorkspaceId: string | null = null
  selectedWorkspace: Workspace | null = null
  dropdownOpen: boolean = false

  constructor(
    private workspaceService: WorkspaceService,
  ) { }


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
