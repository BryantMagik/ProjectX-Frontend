import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IssueService } from '../../service/issue/issue.service';
import { Issue } from '../../model/issue.interface';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-issues',
  standalone: true,
  imports: [NgFor,NgIf],
  templateUrl: './issues.component.html',
  styleUrl: './issues.component.css'
})
export class IssuesComponent implements OnInit {

  issues: Issue[] = [];

  constructor(private router:Router,private issueService: IssueService){}

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
