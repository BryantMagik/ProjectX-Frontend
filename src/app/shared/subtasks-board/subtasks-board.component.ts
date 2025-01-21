import { CommonModule, NgClass, NgFor } from '@angular/common';
import { Component } from '@angular/core';

export interface subTasksDataBoard{
  id:number;
  name:string;
  description:string;
  status:string;
  task_id:string;
  creation_date:string;
  update_date:string;
}

@Component({
    selector: 'app-subtasks-board',
    imports: [NgFor, CommonModule],
    templateUrl: './subtasks-board.component.html',
    styleUrl: './subtasks-board.component.css',
    standalone:true

})
export class SubtasksBoardComponent {
  subTasks: subTasksDataBoard[] =[
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

}
