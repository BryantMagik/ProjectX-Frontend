import { Component, HostListener, Input, OnDestroy, OnInit, inject } from '@angular/core'

import { User } from '../../../../core/models/user.interface'
import { BreadcrumbModule } from 'primeng/breadcrumb'
import { Router, RouterModule } from '@angular/router'
import { AvatarModule } from 'primeng/avatar';
import { FormsModule } from '@angular/forms'
import { AvatarDropdownComponent } from '../../../../shared/ui/avatar-dropdown/avatar-dropdown.component';
import { MobilDropdownComponent } from '../../../../shared/ui/mobil-dropdown/mobil-dropdown.component'
import { NotificationsComponent } from '../../../../shared/ui/notifications/notifications.component';
import { NotificationService } from '../../../../core/services/notification.service';
import { Subscription } from 'rxjs';
import { TaskAssignmentNotification } from '../../../../core/models/notification.interface';

@Component({
    selector: 'app-navbar',
    imports: [AvatarModule, RouterModule, BreadcrumbModule, FormsModule, AvatarDropdownComponent, MobilDropdownComponent, NotificationsComponent],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css',
    standalone:true

})
export class NavbarComponent implements OnInit, OnDestroy {
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  private subscriptions = new Subscription();

  loading = true
  error: string | null = null

  @Input() user: User | null = null

  notifications: TaskAssignmentNotification[] = [];
  notificationsLoading = false;
  notificationsError: string | null = null;
  isNotificationsOpen = false;

  ngOnInit(): void {
    this.notificationService.start();
    this.subscriptions.add(
      this.notificationService.notifications$.subscribe((items) => {
        this.notifications = items;
      })
    );
    this.subscriptions.add(
      this.notificationService.loading$.subscribe((isLoading) => {
        this.notificationsLoading = isLoading;
      })
    );
    this.subscriptions.add(
      this.notificationService.error$.subscribe((error) => {
        this.notificationsError = error;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.notificationService.stop();
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.isNotificationsOpen = false;
  }

  toggleNotifications(event: MouseEvent): void {
    event.stopPropagation();
    this.isNotificationsOpen = !this.isNotificationsOpen;
  }

  onOpenNotification(notification: TaskAssignmentNotification): void {
    this.notificationService.markAsRead(notification.id);
    this.isNotificationsOpen = false;
    const targetRoute = notification.entityType === 'ISSUE' ? '/issues' : '/tasks';
    this.router.navigate([targetRoute, notification.taskId]);
  }

  onMarkAllAsRead(): void {
    this.notificationService.markAllAsRead();
  }

  get unreadCount(): number {
    return this.notifications.filter((notification) => notification.unread).length;
  }
}
