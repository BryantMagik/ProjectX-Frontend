import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface SubtaskDetail {
  subtask_id: number;
  name: string;
  description: string;
  status: string;
  task_id: number;
  creation_date: string;
  update_date: string;
}

@Component({
  selector: 'app-subtasks-details',
  standalone: true,
  imports: [CommonModule,],
  templateUrl: './subtasks-details.component.html',
  styleUrl: './subtasks-details.component.css'
})

export class SubtasksDetailsComponent implements OnInit {
  subtaskdetails: SubtaskDetail[] = [
    {
      subtask_id: 1,
      name: 'Subtask 1',
      description: 'Description of subtask 1',
      status: 'Pending',
      task_id: 1,
      creation_date: '2024-07-01',
      update_date: '2024-07-15'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
