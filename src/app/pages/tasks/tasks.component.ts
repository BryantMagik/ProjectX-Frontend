import { CommonModule, NgClass, NgFor } from '@angular/common';
import { Component } from '@angular/core';

export interface tasksData{
  id:number;
  code:string;
  summary:string;
  description:string;
  priority:string;
  type:string;
  status:string;
  project_id:number;
  assigned_user_id:number;
  estimation:string;
  duedate:string;
}

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [NgFor,CommonModule,NgClass],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent {
  tasks: tasksData[] =[
    {
      id: 1,
      code: 'PRJ001',
      summary: 'Project Summary',
      description: 'Description of the project 1',
      priority: 'high',
      type: 'Bug',
      status: 'Ongoing',
      project_id: 10,
      assigned_user_id: 1001,
      estimation: '5 days',
      duedate: '2024-12-31'
    }
  ]

  constructor() { 

  }


}
