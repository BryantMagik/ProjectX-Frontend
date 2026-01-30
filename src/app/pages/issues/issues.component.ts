import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IssueService } from '../../features/issues/services/issue.service';
import { Issue } from '../../model/issue.interface';


@Component({
    selector: 'app-issues',
    imports: [],
    templateUrl: './issues.component.html',
    styleUrl: './issues.component.css',
    standalone: true

})
export class IssuesComponent implements OnInit {
  private router = inject(Router);
  private issueService = inject(IssueService);


  issues: Issue[] = [];

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor(){}

  navigateToIssuesForm() {
    this.router.navigate(['/pages/issues/shared/issues-form']);
  }

  ngOnInit(): void {
    this.loadIssues();
  }

  loadIssues(): void {
    this.issueService.getAllIssues().subscribe((data: Issue[]) => {
      this.issues = data;
    });
  }

}
