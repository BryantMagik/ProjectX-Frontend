import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommentsService } from '../../service/comment/comments.service';
import { Comment } from '../../model/comment.interface';
import { NgFor, NgIf } from '@angular/common';

@Component({
    selector: 'app-comments',
    imports: [NgFor, NgIf],
    templateUrl: './comments.component.html',
    styleUrl: './comments.component.css',
    standalone: true
})
export class CommentsComponent implements OnInit {
  comments: Comment[] = [];

  constructor(private router:Router,private commentsService: CommentsService){}

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
