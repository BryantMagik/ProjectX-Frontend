import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TaskAssignmentNotification } from '../../../core/models/notification.interface';

@Component({
    selector: 'app-notifications',
    imports: [CommonModule],
    templateUrl: './notifications.component.html',
    styleUrl: './notifications.component.css',
    standalone: true
})
export class NotificationsComponent {
  @Input() notifications: TaskAssignmentNotification[] = [];
  @Input() loading = false;
  @Input() error: string | null = null;
  @Input() unreadCount = 0;

  @Output() openNotification = new EventEmitter<TaskAssignmentNotification>();
  @Output() markAllRead = new EventEmitter<void>();

  onOpen(notification: TaskAssignmentNotification): void {
    this.openNotification.emit(notification);
  }

  onMarkAllRead(): void {
    this.markAllRead.emit();
  }
}
