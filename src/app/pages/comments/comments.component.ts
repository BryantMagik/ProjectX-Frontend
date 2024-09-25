import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css'
})
export class CommentsComponent {
  constructor(private router:Router){}

  navigateToCommentsForm() {
    this.router.navigate(['/pages/comments/shared/comments-form']);
  }
  

}
