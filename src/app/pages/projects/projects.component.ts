import {
  Component, OnInit
} from '@angular/core';
import { CommonModule, NgFor, NgClass } from '@angular/common';
import { ProjectService } from '../../service/project/project.service';
import { tap } from 'rxjs';
import { Project } from '../../model/project.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [NgFor, CommonModule, NgClass],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})

export class ProjectsComponent implements OnInit {
  project: Project[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private projectsService: ProjectService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getProject()
  }

  navigateToProject(projectId: string) {
    console.log(`Navigating to project with ID: ${projectId}`);
    this.router.navigate(['/pages/projects', projectId]);
    }

  private getProject(): void {
    this.projectsService.getProjectsRequest().pipe(
      tap({
        next: (project: Project[] | null) => {
          if (project) {
            this.project = project
          }
        },
        error: () => this.error = 'Failed to load projects',
        complete: () => this.loading = false
      })
    ).subscribe()
  }

}
