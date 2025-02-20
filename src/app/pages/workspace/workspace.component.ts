import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-workspace',
    imports: [RouterOutlet],
    templateUrl: './workspace.component.html',
    styleUrl: './workspace.component.css',
    standalone:true
})
export class WorkspaceComponent implements OnInit {
  workspaceId: string | null = null
  constructor(private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.workspaceId = params.get('id');
    });
  }

}
