import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TaskService } from '../../data-access/task.service';
import { UserService } from '../../../profile/data-access/user.service';
import { Task } from '../../../../core/models/task.interface';
import { tap } from 'rxjs';
import { User } from '../../../../core/models/user.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TasksBoardComponent } from '../../components/tasks-board/tasks-board.component';
import { ProjectService } from '../../../projects/data-access/project.service';
import { Project } from '../../../../core/models/project.interface';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-tasks',
    imports: [
        CommonModule,
        FormsModule,
        TasksBoardComponent
    ],
    templateUrl: './tasks.component.html',
    styleUrl: './tasks.component.css',
    standalone:true
})
export class TasksComponent implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private taskService = inject(TaskService);
  private projectService = inject(ProjectService);

  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  authors: User[] = [];
  projects: Project[] = [];
  error: string | null = null;
  loading: boolean = true;
  showKanban: boolean = false;
  searchTerm: string = '';
  selectedStatus: string = 'all';
  selectedPriority: string = 'all';
  selectedProjectId: string | null = null;
  projectId: string | null = null
  project: Project | null = null
  routeSub: Subscription | null = null
  showProjectModal: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.getTask();
    this.getUsers();
    this.getProjects();
    this.routeSub = this.route.paramMap.subscribe(params => {
      this.projectId = params.get('projectId')
      console.log('Route params - projectId:', this.projectId)
      if (this.projectId) {
        this.selectedProjectId = this.projectId;
        this.getProjectById(this.projectId)
      }
    })

  }


  navigateToTaskDetails(taskId: string) {
    this.router.navigate(['/tasks', taskId]);
  }

  private getTask(): void {
    this.taskService.getTasksByIdWhereId().pipe(
      tap({
        next: (task: Task[] | null) => {
          if (task) {
            this.tasks = task;
            this.filteredTasks = task;
            console.log(this.tasks);
          }
        },
        error: () => this.error = 'Failed to load tasks',
        complete: () => this.loading = false
      })
    ).subscribe();
  }

  private getUsers(): void {
    this.userService.getAllUsers().pipe(
      tap({
        next: (authors: User[] | null) => {
          if(authors){
            this.authors = authors;
            console.log("Authors", authors);
          }
        },
        error: (err) => {
          console.warn('Could not load users:', err);
          // No mostrar error si solo fallan los usuarios
          // this.error = 'Failed to load users';
        }
      })
    ).subscribe();
  }

  filterTasks(): void {
    const search = this.searchTerm.toLowerCase();

    this.filteredTasks = this.tasks.filter(task => {
      const matchesSearch = !this.searchTerm ||
        task.code?.toLowerCase().includes(search) ||
        task.summary?.toLowerCase().includes(search);

      const matchesStatus = this.selectedStatus === 'all' || task.status === this.selectedStatus;
      const matchesPriority = this.selectedPriority === 'all' || task.priority === this.selectedPriority;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }

  onSearchChange(): void {
    this.filterTasks();
  }

  onStatusChange(): void {
    this.filterTasks();
  }

  onPriorityChange(): void {
    this.filterTasks();
  }

  getPriorityClass(priority: string): string {
    const priorityMap: { [key: string]: string } = {
      'high': 'priority-high',
      'medium': 'priority-medium',
      'low': 'priority-low'
    };
    return priorityMap[priority?.toLowerCase()] || 'priority-low';
  }

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'completed': 'status-completed',
      'active': 'status-active',
      'ongoing': 'status-ongoing',
      'inactive': 'status-inactive'
    };
    return statusMap[status?.toLowerCase()] || 'status-inactive';
  }

  getActiveTasksCount(): number {
    return this.tasks.filter(t => t.status === 'Active' || t.status === 'Ongoing').length;
  }

  getCompletedTasksCount(): number {
    return this.tasks.filter(t => t.status === 'Completed').length;
  }

  getHighPriorityTasksCount(): number {
    return this.tasks.filter(t => t.priority?.toLowerCase() === 'high').length;
  }

  toggleKanban(): void {
    this.showKanban = !this.showKanban;
  }

  
  openCreateTaskModal(): void {
    if (!this.selectedProjectId && this.projectId) {
      this.selectedProjectId = this.projectId;
    }
    this.showProjectModal = true;
  }

  closeCreateTaskModal(): void {
    this.showProjectModal = false;
  }

  confirmCreateTask(): void {
    const projectId = this.selectedProjectId || this.projectId;
    console.log('navigateToNewTask called, projectId:', projectId);
    if (projectId) {
      this.showProjectModal = false;
      this.router.navigate(['/tasks/new'], {
        queryParams: { projectId }
      });
    } else {
      console.warn('No projectId available');
    }
  }

  private getProjects(): void {
    this.projectService.getProjectByIdWhereId().pipe(
      tap({
        next: (projects: Project[] | null) => {
          if (projects) {
            this.projects = projects;
          }
        },
        error: () => {
          console.warn('Failed to load projects');
        }
      })
    ).subscribe();
  }

   private getProjectById(projectId: string): void {
      this.projectService.getProjectById(projectId).pipe(
        tap({
          next: (project: Project | null) => {
            console.log(project)
            this.project = project
            this.loading = false
          },
          error: () => this.error = 'Failed to load projects',
          complete: () => this.loading = false
        })
      ).subscribe()
    }
}
