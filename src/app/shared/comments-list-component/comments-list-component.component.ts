import { Component, OnInit,Input } from '@angular/core';
import { CommentsService } from '../../service/comment/comments.service';
import { Comment } from '../../model/comment.interface';
import { Router } from '@angular/router';
import { DatePipe, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-comments-list-component',
  standalone: true,
  imports: [NgIf,NgFor,DatePipe],
  templateUrl: './comments-list-component.component.html',
  styleUrl: './comments-list-component.component.css'
})
export class CommentsListComponentComponent implements OnInit{
  @Input() taskId?: string;
  @Input() issueId?: string;
  comments: Comment[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  constructor(
    private commentsService: CommentsService,
    private router: Router
  ) {}

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
