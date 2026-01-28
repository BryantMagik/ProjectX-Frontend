import { CommonModule, NgClass } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SubtaskService } from '../../features/subtasks/services/subtask.service';
import { Subtask } from '../../models/subtask.interface';
import { TASKSSTATUS } from '../../types/models';


@Component({
    selector: 'app-subtasks',
    imports: [NgClass],
    templateUrl: './subtasks.component.html',
    styleUrl: './subtasks.component.css',
    standalone:true
})
export class SubtasksComponent implements OnInit {
  private router = inject(Router);
  private subtaskService = inject(SubtaskService);


  subTasks: Subtask[] = [];
  filteredSubTasks: Subtask[] = [];
  searchTerm: string = '';
  selectedStatus: string = '';
  taskStatuses = TASKSSTATUS;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor(){}

  navigateToSubTaskForm() {
    this.router.navigate(['/pages/subtasks/shared/subtasks-form']);
  }

  ngOnInit(): void {
    this.loadSubTasks();
  }

  loadSubTasks(): void {
    this.subtaskService.getAllSubtasks().subscribe((data: Subtask[]) => {
      this.subTasks = data;
      this.applyFilters();
    });
  }

  applyFilters(): void {
    this.filteredSubTasks = this.subTasks.filter(subTask => {
      const matchesSearch = this.searchTerm ? 
        subTask.name.toLowerCase().includes(this.searchTerm.toLowerCase()) : true;
      const matchesStatus = this.selectedStatus ? subTask.status === this.selectedStatus : true;
      return matchesSearch && matchesStatus;
    });
  }


}
