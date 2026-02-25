export interface TaskAssignmentNotification {
  id: string;
  entityType: 'TASK' | 'ISSUE';
  taskId: string;
  taskCode: string;
  taskSummary: string;
  projectId: string;
  projectName: string;
  assignedBy: string;
  updatedAt: string;
  unread: boolean;
}
