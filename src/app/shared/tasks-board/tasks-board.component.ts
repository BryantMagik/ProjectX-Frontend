import { Component } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';

export interface tasksDataBoard{
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
    selector: 'app-tasks-board',
    imports: [CommonModule, NgClass],
    templateUrl: './tasks-board.component.html',
    styleUrl: './tasks-board.component.css',
    standalone:true

})
export class TasksBoardComponent {
  tasks: tasksDataBoard[] =[
    {
      id: 1,
      code: 'PRJ001',
      summary: 'Project Summary',
      description: 'Description of the project 1',
      priority: 'high',
      type: 'Software',
      status: 'Ongoing',
      project_id: 10,
      assigned_user_id: 1001,
      estimation: '5 days',
      duedate: '2024-12-31'
    }
  ]

  constructor() {}



}
