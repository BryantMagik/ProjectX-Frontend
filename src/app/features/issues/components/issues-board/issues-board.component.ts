import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IssueService } from '../../data-access/issue.service';
import { Issue,IssueStatus } from '../../../../core/models/issue.interface';
import { tap } from 'rxjs';
import { Router } from '@angular/router';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

interface KanbanColumn {
  id: string;
  title: string;
  status: IssueStatus;
  issues: Issue[];
  color: string;
}

@Component({
  selector: 'app-issues-board',
  imports: [CommonModule, DragDropModule],
  templateUrl: './issues-board.component.html',
  styleUrl: './issues-board.component.css',
  standalone: true

})
export class IssuesBoardComponent implements OnInit {
  private issueService = inject(IssueService);
  private router = inject(Router);

  issues: Issue[] = [];
  loading: boolean = true;
  error: string | null = null;

  columns: KanbanColumn[] = [
    { id: 'pending', title: 'Pending', status: IssueStatus.PENDING, issues: [], color: '#8b5cf6' },
    { id: 'ongoing', title: 'Ongoing', status: IssueStatus.ONGOING, issues: [], color: '#3b82f6' },
    { id: 'completed', title: 'Completed', status: IssueStatus.COMPLETED, issues: [], color: '#10b981' }
  ];

  ngOnInit(): void {
    this.getIssues();
  }

  private getIssues(): void {
    this.issueService.getAllIssues().pipe(
      tap({
        next: (issues: Issue[] | null) => {
          if (issues) {
            this.issues = issues;
            this.distributeIssuesToColumns(issues);
          }
        },
        error: (err) => {
          console.error('Error loading issues:', err);
          this.error = 'Failed to load issues';
          this.loading = false;
        },
        complete: () => this.loading = false
      })
    ).subscribe();
  }

  private distributeIssuesToColumns(issues: Issue[]): void {
    this.columns.forEach(col => col.issues = []);

    issues.forEach(issue => {
      const issueStatus = issue.status?.trim() || '';
      const column = this.columns.find(col =>
        col.status.toLowerCase() === issueStatus.toLowerCase()
      );

      if (column) {
        column.issues.push(issue);
      } else {
        console.warn(`Issue ${issue.id} has unknown status: ${issueStatus}, adding to first column`);
        this.columns[0].issues.push(issue);
      }
    });
  }

  drop(event: CdkDragDrop<Issue[]>, targetColumn: KanbanColumn): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const issue = event.previousContainer.data[event.previousIndex];
      const previousStatus = issue.status;

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      issue.status = targetColumn.status;

      this.updateIssueStatus(issue, targetColumn.status, previousStatus);
    }
  }

  private updateIssueStatus(issue: Issue, newStatus: Issue['status'], previousStatus: Issue['status']): void {
    if (!issue.id) {
      issue.status = previousStatus;
      this.distributeIssuesToColumns(this.issues);
      return;
    }

    const updatePayload:Partial<Issue> = { status: newStatus };

    this.issueService.updateIssue(issue.id, updatePayload).subscribe({
      next: () => {
        // optimistic UI already applied
      },
      error: (err) => {
        console.error('Error updating issue status:', err);
        issue.status = previousStatus;
        this.distributeIssuesToColumns(this.issues);
      }
    });
  }

  getPriorityColor(priority: string): string {
    const priorityMap: { [key: string]: string } = {
      'LOW': 'priority-low',
      'MEDIUM': 'priority-medium',
      'HIGH': 'priority-high'
    };
    return priorityMap[priority.toUpperCase()] || 'priority-medium';
  }

  getConnectedLists(currentColumnId: string): string[] {
    return this.columns
      .filter(col => col.id !== currentColumnId)
      .map(col => col.id);
  }

  navigateToIssue(issueId?: string): void {
    if (!issueId) {
      return;
    }
    this.router.navigate(['/issues', issueId]);
  }
}
