import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommentsService } from '../../features/comments/services/comments.service';
import { Comment } from '../../model/comment.interface';


@Component({
    selector: 'app-comments',
    imports: [],
    templateUrl: './comments.component.html',
    styleUrl: './comments.component.css',
    standalone: true
})
export class CommentsComponent implements OnInit {
  private router = inject(Router);
  private commentsService = inject(CommentsService);

  comments: Comment[] = [];

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor(){}

  navigateToCommentsForm() {
    this.router.navigate(['/pages/comments/shared/comments-form']);
  }

  ngOnInit(): void {
    this.getComments();
  }

  getComments(): void {
    this.commentsService.findAll().subscribe(
      (data) => {
        this.comments = data;
      },
      (error) => {
        console.error('Error fetching comments:', error);
      }
    );
  }

}
