import { CommonModule, NgClass, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

export interface subTasksData{
  id:number;
  name:string;
  description:string;
  status:string;
  task_id:string;
  creation_date:string;
  update_date:string;
}

@Component({
  selector: 'app-subtasks',
  standalone: true,
  imports: [NgFor,NgClass,CommonModule],
  templateUrl: './subtasks.component.html',
  styleUrl: './subtasks.component.css'
})
export class SubtasksComponent {
  subTasks: subTasksData[] =[
    {
      id:1,
      name:'Subtarea A',
      description:'Descripción de la subtarea A',
      status:'Ongoing',
      task_id:'TAREA-001',
      creation_date:'2024-07-20',
      update_date:'2024-07-21',
    }
  ]
  constructor(private router:Router){}

  navigateToSubTaskForm() {
    this.router.navigate(['/pages/subtasks/shared/subtasks-form']);
  }


}
