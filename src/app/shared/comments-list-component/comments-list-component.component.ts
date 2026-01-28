import { Component, OnInit, Input, inject } from '@angular/core';
import { CommentsService } from '../../service/comment/comments.service';
import { Comment } from '../../model/comment.interface';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-comments-list-component',
    imports: [DatePipe],
    templateUrl: './comments-list-component.component.html',
    styleUrl: './comments-list-component.component.css',
    standalone:true

})
export class CommentsListComponentComponent implements OnInit{
  private commentsService = inject(CommentsService);
  private router = inject(Router);

  @Input() taskId?: string;
  @Input() issueId?: string;
  comments: Comment[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  ngOnInit(): void {
    this.loadComments();
  }

  loadComments(): void {
    this.isLoading = true;
    if (this.taskId) {
      this.commentsService.getCommentsByTask(this.taskId).subscribe({
        next: (data) => {
          this.comments = data;
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = 'Error al cargar los comentarios.';
          this.isLoading = false;
          console.error(error);
        },
      });
    } else if (this.issueId) {
      this.commentsService.getCommentsByIssue(this.issueId).subscribe({
        next: (data) => {
          this.comments = data;
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = 'Error al cargar los comentarios.';
          this.isLoading = false;
          console.error(error);
        },
      });
    }
  }

  navigateToAddComment(): void {
    this.router.navigate(['/pages/comments/shared/comments-form']);
  }

  

}
