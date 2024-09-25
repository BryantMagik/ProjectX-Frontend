import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-issues',
  standalone: true,
  imports: [],
  templateUrl: './issues.component.html',
  styleUrl: './issues.component.css'
})
export class IssuesComponent {

  constructor(private router:Router){}

  navigateToIssuesForm() {
    this.router.navigate(['/pages/issues/shared/issues-form']);
  }

}
