import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IssuesBoardComponent } from '../../components/issues-board/issues-board.component';

@Component({
  selector: 'app-issues',
  standalone: true,
  imports: [RouterLink, IssuesBoardComponent],
  templateUrl: './issues.component.html',
  styleUrl: './issues.component.css',
})
export class IssuesComponent {}
