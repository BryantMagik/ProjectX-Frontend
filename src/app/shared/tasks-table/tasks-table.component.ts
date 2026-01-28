
import { Component, Input } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Task } from '../../model/task.interface';
import { TaskDropdownOptionsComponent } from '../task-dropdown-options/task-dropdown-options.component';
import { SeverityTagComponent } from "../../service/severity/severity-tag.component";

@Component({
  selector: 'app-tasks-table',
  standalone: true,
  imports: [TableModule, TaskDropdownOptionsComponent, SeverityTagComponent],
  templateUrl: './tasks-table.component.html',
  styleUrl: './tasks-table.component.css'
})
export class TasksTableComponent {
  @Input() task: Task[] = []
  @Input() loading: boolean = true
  @Input() error: string | null = null

}
