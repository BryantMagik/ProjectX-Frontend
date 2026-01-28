import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-workspace',
    imports: [RouterOutlet],
    templateUrl: './workspace.component.html',
    styleUrl: './workspace.component.css',
    standalone:true
})
export class WorkspaceComponent implements OnInit {
  private route = inject(ActivatedRoute);

  workspaceId: string | null = null

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);
  constructor() {

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.workspaceId = params.get('id');
    });
  }

}
