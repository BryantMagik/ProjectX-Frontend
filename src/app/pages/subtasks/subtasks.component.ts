import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SubtaskService } from '../../service/subtask/subtask.service';
import { Subtask } from '../../model/subtask.interface';


@Component({
  selector: 'app-subtasks',
  standalone: true,
  imports: [NgFor,NgIf,NgClass],
  templateUrl: './subtasks.component.html',
  styleUrl: './subtasks.component.css'
})
export class SubtasksComponent {

  subTasks: Subtask[] = [];
  filteredSubTasks: Subtask[] = [];
  searchTerm: string = '';
  selectedStatus: string = '';

  constructor(private router:Router,private subtaskService: SubtaskService){}

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
        subTask.id.includes(this.searchTerm) || subTask.name.toLowerCase().includes(this.searchTerm.toLowerCase()) : true;
      const matchesStatus = this.selectedStatus ? subTask.status === this.selectedStatus : true;
      return matchesSearch && matchesStatus;
    });
  }


}
