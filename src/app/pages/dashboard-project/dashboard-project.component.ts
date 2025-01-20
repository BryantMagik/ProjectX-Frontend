import { Component, OnInit } from '@angular/core';
import { ProjectCardComponent } from "../../components/project-card/project-card.component";
import { ProjectService } from '../../service/project/project.service';
import { Subscription, tap } from 'rxjs';
import { Project } from '../../model/project.interface';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard-project',
  standalone: true,
  imports: [ProjectCardComponent],
  templateUrl: './dashboard-project.component.html',
  styleUrl: './dashboard-project.component.css'
})
export class DashboardProjectComponent implements OnInit {

  routeSub: Subscription | null = null
  projectId: string | null = null
  project: Project | null = null
  loading: boolean = true
  error: string | null = null

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,

  ) {

  }

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe(params => {
      this.projectId = params.get('projectId');
      if (this.projectId) {
        console.log("Fetching", this.projectId)
        this.getProjectById(this.projectId);
      }
    })
  }
  

  private getProjectById(projectId: string): void {
    this.projectService.getProjectById(projectId).pipe(
      tap({
        next: (project: Project | null) => {
          console.log(project)
          this.project = project;
          this.loading = false;
        },
        error: () => this.error = 'Failed to load projects',
        complete: () => this.loading = false
      })
    ).subscribe()
  }

}
