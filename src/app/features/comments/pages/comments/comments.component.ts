import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommentsService } from '../../data-access/comments.service';
import { Comment } from '../../../../core/models/comment.interface';


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


  constructor(){}

  navigateToCommentsForm() {
    this.router.navigate(['/comments/new']);
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
