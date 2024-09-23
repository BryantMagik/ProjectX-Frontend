import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { MatListModule } from '@angular/material/list'
import { MatIconModule } from '@angular/material/icon'
import { RouterLink, RouterModule } from '@angular/router';

export type MenuItem = {
  icon: string,
  label: string,
  route?: string,
  subItems?: MenuItem[]
}

@Component({
  selector: 'app-custom-sidebar',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule, RouterLink, RouterModule],
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
      icon: 'folder_open',
      label: 'Projects',
      route: 'pages/projects',
    },
    {
      icon: 'assignment',
      label: 'Task',
      route: 'pages/tasks',
    },
    {
      icon: 'subdirectory_arrow_right',
      label: 'SubTasks',
      route: 'pages/subtasks',
    },
    {
      icon: 'bug_report',
      label: 'Issues',
      route: 'pages/issues',
    },
    {
      icon: 'comment',
      label: 'Comments',
      route: 'pages/comments',
    }
  ])

}
