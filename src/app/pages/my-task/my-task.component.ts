import { Component,EventEmitter,OnInit,Output } from '@angular/core';
import { Workspace } from '../../model/workspace.interface';
import { WorkspaceService } from '../../service/workspace/workspace.service';
import { tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-my-task',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-task.component.html',
  styleUrl: './my-task.component.css'
})
export class MyTaskComponent implements OnInit {
  workspaceId: string | null = null;
  selectedWorkspace: Workspace | null = null;

  constructor(
    private route: ActivatedRoute,
    private workspaceService: WorkspaceService
  ) {}

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe(params => {
      this.workspaceId = params.get('workspaceId');
      if (this.workspaceId) {
        this.loadWorkspace();
      }
    });
    
  }

  private loadWorkspace(): void {
    if (!this.workspaceId) return;

    this.workspaceService.getWorkspaceById(this.workspaceId).subscribe({
      next: (workspace) => {
        this.selectedWorkspace = workspace;
      },
      error: () => {
        console.error('Error loading workspace');
      }
    });
  }

}
