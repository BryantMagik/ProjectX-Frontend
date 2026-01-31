import { Component, EventEmitter, HostListener, OnInit, Output, inject } from '@angular/core'
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
  private router = inject(Router);
  private route = inject(ActivatedRoute);

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

  private getWorkspaceStorageKey(): string {
    const userId = sessionStorage.getItem('userId')
    return userId ? `workspace_${userId}` : 'selectedWorkspaceId'
  }

  selectWorkspace(workspace: Workspace): void {
    this.selectedWorkspace = workspace
    this.selectedWorkspaceId = workspace.id
    this.dropdownOpen = false

    // Guardar en sessionStorage vinculado al usuario
    sessionStorage.setItem(this.getWorkspaceStorageKey(), workspace.id)

    this.workspaceSelected.emit(this.selectedWorkspaceId!)
  }

  ngOnInit(): void {
    this.getWorkspaces()
    this.loadSelectedWorkspace()
  }

  private loadSelectedWorkspace(): void {
    // Intentar obtener el workspace de la URL primero
    this.route.paramMap.subscribe(params => {
      const workspaceIdFromUrl = params.get('workspaceId')
      if (workspaceIdFromUrl) {
        this.selectedWorkspaceId = workspaceIdFromUrl
        sessionStorage.setItem(this.getWorkspaceStorageKey(), workspaceIdFromUrl)
      } else {
        // Si no hay en la URL, intentar obtener de sessionStorage del usuario actual
        const savedWorkspaceId = sessionStorage.getItem(this.getWorkspaceStorageKey())
        if (savedWorkspaceId) {
          this.selectedWorkspaceId = savedWorkspaceId
        }
      }

      // Buscar el workspace completo si tenemos un ID
      if (this.selectedWorkspaceId && this.workspaces.length > 0) {
        this.selectedWorkspace = this.workspaces.find(w => w.id === this.selectedWorkspaceId) || null
        if (this.selectedWorkspace) {
          this.workspaceSelected.emit(this.selectedWorkspaceId)
        } else {
          // El workspace no existe en la lista del usuario, limpiar
          sessionStorage.removeItem(this.getWorkspaceStorageKey())
          this.selectedWorkspaceId = null
          this.router.navigate(['/pages/dashboard'])
        }
      }
    })
  }

  private getWorkspaces(): void {
    this.workspaceService.getAllWorkspace().pipe(
      tap({
        next: (workspace: Workspace[] | null) => {
          if (workspace) {
            this.workspaces = workspace
            // Después de cargar los workspaces, intentar seleccionar el guardado
            this.restoreSelectedWorkspace()
          }
        },
        error: () => this.error = 'Failed to load workspaces',
        complete: () => this.loading = false
      })
    ).subscribe()
  }

  private restoreSelectedWorkspace(): void {
    if (this.selectedWorkspaceId && this.workspaces.length > 0) {
      this.selectedWorkspace = this.workspaces.find(w => w.id === this.selectedWorkspaceId) || null
      if (this.selectedWorkspace) {
        this.workspaceSelected.emit(this.selectedWorkspaceId)
      } else {
        // El workspace guardado ya no existe, limpiar sessionStorage
        sessionStorage.removeItem(this.getWorkspaceStorageKey())
        this.selectedWorkspaceId = null
        // Redirigir al dashboard principal
        this.router.navigate(['/pages/dashboard'])
      }
    } else if (this.workspaces.length > 0 && !this.selectedWorkspaceId) {
      // Si no hay workspace seleccionado pero hay workspaces disponibles, seleccionar el primero
      this.selectWorkspace(this.workspaces[0])
    }
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const clickedInside = event.target instanceof HTMLElement && event.target.closest('.workspace-switcher');
    if (!clickedInside) {
      this.dropdownOpen = false;
    }
  }
}
