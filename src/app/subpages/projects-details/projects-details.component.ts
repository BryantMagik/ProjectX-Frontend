import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project } from '../../model/project.interface';
import { ProjectService } from '../../service/project/project.service';
import { finalize, tap } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-projects-details',
  standalone: true,
  imports: [CommonModule],
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
    console.log('ProjectsDetailsComponent initialized');
    this.route.paramMap.subscribe(params => {
      this.projectId = params.get('id');
      console.log('Project ID:', this.projectId);

      if (this.projectId) {
        this.getProjectById(this.projectId)
      }
    })
  }

  private getProjectById(id: string) {
    this.projectService.getProjectById(id).pipe(
      tap({
        next: (project: Project | null) => {
          this.project = project;
          console.log('Project:', this.project);
        },
        error: (err) => {
          this.error = 'Failed to load project';
          console.error('Error fetching project:', err)
        }
      }),
      finalize(() => this.loading = false) 
    ).subscribe();
  }

}
