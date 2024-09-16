import { Component,OnInit } from '@angular/core';
import { CommonModule, NgFor, NgClass } from '@angular/common';

export interface Taskdetail{
  id:number;
  code:string;
  summary:string;
  description:string;
  priority:string;
  type:string;
  status:string;
  projectid:number;
  asigneruserid:number;
  estimation:string;
  duedate:string;
}

@Component({
  selector: 'app-tasks-details',
  standalone: true,
  imports: [CommonModule,NgFor,NgClass],
  templateUrl: './tasks-details.component.html',
  styleUrl: './tasks-details.component.css'
})
export class TasksDetailsComponent implements OnInit{
  taskdetails: Taskdetail[] =[
    {
      id: 1,
      code: 'PRJ001',
      summary: 'Project Summary',
      description: 'Description of the project',
      priority: 'High',
      type: 'Bug',
      status: 'Ongoing',
      projectid: 10,
      asigneruserid: 1001,
      estimation: '5 days',
      duedate: '2024-12-31'
    }
  ]
  constructor() { }

  ngOnInit(): void {
  }

}
