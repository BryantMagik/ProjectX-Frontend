import { Component, EventEmitter, HostListener, OnInit, Output, inject, computed, effect } from '@angular/core'
import { WorkspaceService } from '../../../../service/workspace/workspace.service'
import { Workspace } from '../../../../core/models/workspace.interface'
import { FormsModule } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { injectQuery } from '@tanstack/angular-query-experimental'
import { firstValueFrom } from 'rxjs'
import { WorkspaceStore } from '../../../../core/services/workspace.store'

@Component({
    selector: 'app-workspace-switcher',
    imports: [FormsModule],
    standalone: true,
    templateUrl: './workspace-switcher.component.html',
    styleUrl: './workspace-switcher.component.css'
})
export class WorkspaceSwitcherComponent implements OnInit {
  private workspaceService = inject(WorkspaceService);
  private workspaceStore = inject(WorkspaceStore);
  private route = inject(ActivatedRoute);

  @Output() workspaceSelected = new EventEmitter<string>();

  dropdownOpen = false;

  workspacesQuery = injectQuery(() => ({
    queryKey: ['workspaces'],
    queryFn: () => firstValueFrom(this.workspaceService.getAllWorkspace()),
  }));

  workspaces = computed(() => this.workspacesQuery.data() ?? []);
  selectedWorkspace = computed<Workspace | null>(() => {
    const id = this.workspaceStore.selectedId();
    return this.workspaces().find(w => w.id === id) ?? null;
  });
  loading = this.workspacesQuery.isPending;
  error = computed(() => this.workspacesQuery.isError() ? 'Failed to load workspaces' : null);

  constructor() {
    // Auto-select first workspace once list loads if nothing is selected
    effect(() => {
      const list = this.workspacesQuery.data();
      if (list && list.length > 0 && !this.workspaceStore.selectedId()) {
        this.selectWorkspace(list[0]);
      }
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const workspaceIdFromUrl = params.get('workspaceId');
      if (workspaceIdFromUrl) {
        this.workspaceStore.select(workspaceIdFromUrl);
        this.workspaceSelected.emit(workspaceIdFromUrl);
      } else {
        const savedId = this.workspaceStore.selectedId();
        if (savedId) {
          this.workspaceSelected.emit(savedId);
        }
      }
    });
  }

  selectWorkspace(workspace: Workspace): void {
    this.workspaceStore.select(workspace.id);
    this.dropdownOpen = false;
    this.workspaceSelected.emit(workspace.id);
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent): void {
    const clickedInside = event.target instanceof HTMLElement && event.target.closest('.workspace-switcher');
    if (!clickedInside) {
      this.dropdownOpen = false;
    }
  }
}
