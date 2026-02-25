import { Injectable, OnDestroy, inject } from '@angular/core';
import { BehaviorSubject, Subscription, interval } from 'rxjs';
import { TaskAssignmentNotification } from '../models/notification.interface';
import { TaskService } from '../../service/task/task.service';
import { Task } from '../models/task.interface';
import { AuthService } from './auth.service';
import { IssueService } from '../../features/issues/data-access/issue.service';
import { Issue } from '../models/issue.interface';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService implements OnDestroy {
  private taskService = inject(TaskService);
  private issueService = inject(IssueService);
  private authService = inject(AuthService);

  private readonly pollIntervalMs = 30000;
  private pollSub: Subscription | null = null;

  private notificationsSubject = new BehaviorSubject<TaskAssignmentNotification[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  readonly notifications$ = this.notificationsSubject.asObservable();
  readonly loading$ = this.loadingSubject.asObservable();
  readonly error$ = this.errorSubject.asObservable();

  start(): void {
    if (this.pollSub) {
      return;
    }

    this.refresh();
    this.pollSub = interval(this.pollIntervalMs).subscribe(() => this.refresh());
  }

  stop(): void {
    this.pollSub?.unsubscribe();
    this.pollSub = null;
  }

  ngOnDestroy(): void {
    this.stop();
  }

  refresh(): void {
    const userId = this.authService.getId();
    if (!userId) {
      this.notificationsSubject.next([]);
      this.loadingSubject.next(false);
      return;
    }

    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    forkJoin({
      tasks: this.taskService.getTasksRequest(),
      issues: this.issueService.getAllIssues()
    }).subscribe({
      next: ({ tasks, issues }: { tasks: Task[] | null; issues: Issue[] | null }) => {
        const assignedTasks = (tasks || []).filter((task) =>
          (task.users || []).some((user) => user.id === userId)
        );
        const assignedIssues = (issues || []).filter((issue) =>
          !!issue.id && (issue.assignedTo || []).some((assigned) => assigned.id === userId)
        );

        const snapshot = this.getAssignmentSnapshot(userId);
        const hasSnapshot = this.hasAssignmentSnapshot(userId);
        const readIds = this.getReadNotificationIds(userId);
        const nextSnapshot: Record<string, true> = {};

        if (!hasSnapshot) {
          assignedTasks.forEach((task) => readIds.add(this.getNotificationId('TASK', task.id)));
          assignedIssues.forEach((issue) => readIds.add(this.getNotificationId('ISSUE', issue.id as string)));
        }

        const taskNotifications = assignedTasks.map((task) => {
          const entityKey = this.getSnapshotEntityKey('TASK', task.id);
          const notificationId = this.getNotificationId('TASK', task.id);
          const isNewAssignment = !snapshot[entityKey];

          if (isNewAssignment && hasSnapshot) {
            readIds.delete(notificationId);
          }

          nextSnapshot[entityKey] = true;

          return {
            id: notificationId,
            entityType: 'TASK',
            taskId: task.id,
            taskCode: task.code || task.name || 'TASK',
            taskSummary: task.summary || task.description || 'Nueva tarea asignada',
            projectId: task.projectId,
            projectName: task.project?.name || 'Proyecto',
            assignedBy: task.creator?.first_name || 'Sistema',
            updatedAt: task.updatedAt || task.createdAt || new Date().toISOString(),
            unread: !readIds.has(notificationId)
          } as TaskAssignmentNotification;
        });

        const issueNotifications = assignedIssues.map((issue) => {
          const issueId = issue.id as string;
          const entityKey = this.getSnapshotEntityKey('ISSUE', issueId);
          const notificationId = this.getNotificationId('ISSUE', issueId);
          const isNewAssignment = !snapshot[entityKey];

          if (isNewAssignment && hasSnapshot) {
            readIds.delete(notificationId);
          }

          nextSnapshot[entityKey] = true;

          return {
            id: notificationId,
            entityType: 'ISSUE',
            taskId: issueId,
            taskCode: issue.code || 'ISSUE',
            taskSummary: issue.summary || issue.description || 'Nuevo issue asignado',
            projectId: issue.projectId,
            projectName: 'Proyecto',
            assignedBy: issue.reporter?.first_name || 'Sistema',
            updatedAt: issue.updatedAt ? new Date(issue.updatedAt).toISOString() : new Date().toISOString(),
            unread: !readIds.has(notificationId)
          } as TaskAssignmentNotification;
        });

        const notifications = [...taskNotifications, ...issueNotifications].sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );

        this.saveAssignmentSnapshot(userId, nextSnapshot);
        this.saveReadNotificationIds(userId, readIds);
        this.notificationsSubject.next(notifications);
        this.loadingSubject.next(false);
      },
      error: () => {
        this.errorSubject.next('No se pudieron cargar las notificaciones.');
        this.loadingSubject.next(false);
      }
    });
  }

  markAsRead(notificationId: string): void {
    const userId = this.authService.getId();
    if (!userId) {
      return;
    }

    const readIds = this.getReadNotificationIds(userId);
    readIds.add(notificationId);
    this.saveReadNotificationIds(userId, readIds);

    const updated = this.notificationsSubject.value.map((notification) =>
      notification.id === notificationId ? { ...notification, unread: false } : notification
    );
    this.notificationsSubject.next(updated);
  }

  markAllAsRead(): void {
    const userId = this.authService.getId();
    if (!userId) {
      return;
    }

    const readIds = this.getReadNotificationIds(userId);
    this.notificationsSubject.value.forEach((notification) => readIds.add(notification.id));
    this.saveReadNotificationIds(userId, readIds);

    const updated = this.notificationsSubject.value.map((notification) => ({
      ...notification,
      unread: false
    }));
    this.notificationsSubject.next(updated);
  }

  private getNotificationId(entityType: 'TASK' | 'ISSUE', entityId: string): string {
    return `${entityType.toLowerCase()}-assigned-${entityId}`;
  }

  private getSnapshotEntityKey(entityType: 'TASK' | 'ISSUE', entityId: string): string {
    return `${entityType}:${entityId}`;
  }

  private getReadStorageKey(userId: string): string {
    return `read_notifications_${userId}`;
  }

  private getSnapshotStorageKey(userId: string): string {
    return `task_assignment_snapshot_${userId}`;
  }

  private getReadNotificationIds(userId: string): Set<string> {
    if (!this.canUseStorage()) {
      return new Set<string>();
    }
    try {
      const raw = localStorage.getItem(this.getReadStorageKey(userId));
      const parsed = raw ? JSON.parse(raw) : [];
      return new Set<string>(Array.isArray(parsed) ? parsed : []);
    } catch {
      return new Set<string>();
    }
  }

  private saveReadNotificationIds(userId: string, readIds: Set<string>): void {
    if (!this.canUseStorage()) {
      return;
    }
    localStorage.setItem(this.getReadStorageKey(userId), JSON.stringify(Array.from(readIds)));
  }

  private getAssignmentSnapshot(userId: string): Record<string, true> {
    if (!this.canUseStorage()) {
      return {};
    }
    try {
      const raw = localStorage.getItem(this.getSnapshotStorageKey(userId));
      const parsed = raw ? JSON.parse(raw) : {};
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
      return {};
    }
  }

  private saveAssignmentSnapshot(userId: string, snapshot: Record<string, true>): void {
    if (!this.canUseStorage()) {
      return;
    }
    localStorage.setItem(this.getSnapshotStorageKey(userId), JSON.stringify(snapshot));
  }

  private hasAssignmentSnapshot(userId: string): boolean {
    if (!this.canUseStorage()) {
      return false;
    }
    return localStorage.getItem(this.getSnapshotStorageKey(userId)) !== null;
  }

  private canUseStorage(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }
}
