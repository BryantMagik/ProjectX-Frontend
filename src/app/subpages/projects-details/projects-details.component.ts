import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project } from '../../model/project.interface';
import { ProjectService } from '../../service/project/project.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-projects-details',
  standalone: true,
  imports: [],
  templateUrl: './projects-details.component.html',
  styleUrl: './projects-details.component.css'
})
export class ProjectsDetailsComponent implements OnInit {
  project: Project | null = null;
  projectId: string | null = null;
  loading = true;
  error: string | null = null;


  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.projectId = params.get('id');

      if (this.projectId) {
        this.getProjectById(this.projectId)
      }
    });
  }

  private getProjectById(id: string) {
    this.projectService.getProjectById(id).pipe(
      tap({
        next: (project: Project | null) => {
          this.project = project
        },
        error: () => this.error = 'Failed to load project',
        complete: () => this.loading = false
      })
    ).subscribe()
  }

}
