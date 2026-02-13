import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IssuesBoardComponent } from '../../components/issues-board/issues-board.component';
import { IssueService } from '../../data-access/issue.service';
import { Issue } from '../../../../core/models/issue.interface';
import { tap } from 'rxjs';

@Component({
  selector: 'app-issues',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, IssuesBoardComponent],
  templateUrl: './issues.component.html',
  styleUrl: './issues.component.css',
})
export class IssuesComponent implements OnInit {
  private issueService = inject(IssueService);
  private router = inject(Router);

  issues: Issue[] = [];
  filteredIssues: Issue[] = [];
  error: string | null = null;
  loading: boolean = true;
  showKanban: boolean = false;
  searchTerm: string = '';
  selectedStatus: string = 'all';
  selectedPriority: string = 'all';

  ngOnInit(): void {
    this.getIssues();
  }

  private getIssues(): void {
    this.issueService.getAllIssues().pipe(
      tap({
        next: (issues: Issue[] | null) => {
          if (issues) {
            this.issues = issues;
            this.filteredIssues = issues;
          }
        },
        error: () => this.error = 'Failed to load issues',
        complete: () => this.loading = false
      })
    ).subscribe();
  }

  navigateToIssueDetails(issueId?: string): void {
    if (!issueId) {
      return;
    }
    this.router.navigate(['/issues', issueId]);
  }

  filterIssues(): void {
    const search = this.searchTerm.toLowerCase();

    this.filteredIssues = this.issues.filter(issue => {
      const matchesSearch = !this.searchTerm ||
        issue.code?.toLowerCase().includes(search) ||
        issue.summary?.toLowerCase().includes(search) ||
        issue.description?.toLowerCase().includes(search);

      const matchesStatus = this.selectedStatus === 'all' || issue.status === this.selectedStatus;
      const matchesPriority = this.selectedPriority === 'all' || issue.priority === this.selectedPriority;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }

  onSearchChange(): void {
    this.filterIssues();
  }

  onStatusChange(): void {
    this.filterIssues();
  }

  onPriorityChange(): void {
    this.filterIssues();
  }

  getPriorityClass(priority: string): string {
    const priorityMap: { [key: string]: string } = {
      'high': 'priority-high',
      'medium': 'priority-medium',
      'low': 'priority-low'
    };
    return priorityMap[priority?.toLowerCase()] || 'priority-low';
  }

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'status-active',
      'ongoing': 'status-ongoing',
      'completed': 'status-completed'
    };
    return statusMap[status?.toLowerCase()] || 'status-active';
  }

  getActiveIssuesCount(): number {
    return this.issues.filter(issue => issue.status === 'PENDING' || issue.status === 'ONGOING').length;
  }

  getCompletedIssuesCount(): number {
    return this.issues.filter(issue => issue.status === 'COMPLETED').length;
  }

  getHighPriorityIssuesCount(): number {
    return this.issues.filter(issue => issue.priority?.toLowerCase() === 'high').length;
  }

  toggleKanban(): void {
    this.showKanban = !this.showKanban;
  }
}
