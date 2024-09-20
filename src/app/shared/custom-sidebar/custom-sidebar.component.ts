import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { MatListModule } from '@angular/material/list'
import { MatIconModule } from '@angular/material/icon'
import { RouterLink } from '@angular/router';

export type MenuItem = {
  icon: string,
  label: string,
  route?: string,
  subItems?: MenuItem[]
}

@Component({
  selector: 'app-custom-sidebar',
  standalone: true,
  imports: [CommonModule,MatListModule,MatIconModule, RouterLink],
  templateUrl: './custom-sidebar.component.html',
  styleUrl: './custom-sidebar.component.css'
})
export class CustomSidebarComponent {

  menuItems = signal<MenuItem[]>([
    {
      icon: 'dashboard',
      label: 'Dashboard',
      route: 'pages/dashboard',
    },
    {
      icon: 'projects',
      label: 'projects',
      route: 'pages/projects',
    },
    {
      icon: 'task',
      label: 'Task',
      route: 'pages/tasks',
    },
    {
      icon: 'subTasks',
      label: 'SubTasks',
      route: 'pages/subtasks',
    },
    {
      icon: 'issues',
      label: 'Issues',
      route: 'pages/issues',
    },
    {
      icon: 'comments',
      label: 'Comments',
      route: 'pages/comments',
    }
  ])

}
