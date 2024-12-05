import { NgIf,NgClass, NgFor} from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup,Validators,AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { CommentsService } from '../../service/comment/comments.service';
import { Comment } from '../../model/comment.interface';
import { tap } from 'rxjs';

export interface commentsDetail{
  id:string;
  content:string;
  date: string,
  issueId: string;
  authorId: string;
}

@Component({
  selector: 'app-comments-details',
  standalone: true,
  imports: [NgIf,NgClass,NgFor,ReactiveFormsModule],
  templateUrl: './comments-details.component.html',
  styleUrl: './comments-details.component.css'
})
export class CommentsDetailsComponent implements OnInit{

  comentDetails: commentsDetail[] = [
    {
      id: 'COMMENT-001',
      content: 'Este es un comentario de prueba 1.',
      date: '2023-07-22',
      issueId: 'ISSUE-001',
      authorId: 'USER-001'
    }
  ];

  comment: Comment | null = null;
  commentId: string | null = null;
  loading = true;
  error: string | null = null;

  isEditing = false;

  commentFormular: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private commentsService: CommentsService,
    private fb: FormBuilder,
    private router:Router
  ) {
    this.commentFormular = this.fb.group({
      id: [{ value: '', disabled: true }],
      content: [{ value: '', disabled: true, Validators: [Validators.required, Validators.maxLength(200)] }],
      date: [{ value: '', disabled: true }],
      issueId: [
        { value: '', disabled: true },
        [
          Validators.pattern(/^[a-zA-Z0-9-]+$/),
          this.oneOfTwoRequiredValidator('taskId')
        ]
      ],
      taskId: [
        { value: '', disabled: true },
        [
          Validators.pattern(/^[a-zA-Z0-9-]+$/),
          this.oneOfTwoRequiredValidator('issueId')
        ]
      ],
      authorId: [{ value: '', disabled: true }]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.commentId = params.get('id');
      if (this.commentId) {
        this.getCommentById(this.commentId);
      }
    });
  }
  
  navigateToComments(){
    this.router.navigate(['/pages/comments']);
  }

  private getCommentById(id: string) {
    this.commentsService.findOne(id).pipe(
      tap({
        next: (comment: Comment | null) => {
          this.comment = comment;
          if (comment) {
            this.commentFormular.patchValue({
              content: comment.body,
              issueId: comment.issueId || '',
              taskId: comment.taskId || '',
            });
          }
        },
        error: () => {
          this.error = 'Failed to load comment';
          this.loading = false;
        },
        complete: () => (this.loading = false)
      })
    ).subscribe();
  }


  // habilitar o deshabilitar la edición
  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.commentFormular.enable();
      this.commentFormular.controls['id'].disable();
      this.commentFormular.controls['date'].disable();
      this.commentFormular.controls['authorId'].disable();

      if (this.commentFormular.get('issueId')?.value) {
        this.commentFormular.controls['taskId'].disable();
      } else {
        this.commentFormular.controls['issueId'].disable();
      }
    } else {
      this.commentFormular.disable();
    }
  }

  // aplicar los cambios y enviar el formulario
  onSubmit() {
    const issueId = this.commentFormular.get('issueId')?.value;
    const taskId = this.commentFormular.get('taskId')?.value;

    if (this.commentFormular.valid && this.commentId) {
      if ((issueId && taskId) || (!issueId && !taskId)) {
        this.error = 'Debe existir solo uno de los dos: issueId o taskId.';
        return;
      }

      const updatedComment: Partial<Comment> = {
        body: this.commentFormular.value.content,
        issueId: issueId || null,
        taskId: taskId || null
      };

      this.commentsService.update(this.commentId, updatedComment).subscribe({
        next: () => {
          this.isEditing = false;
          this.navigateToComments();
        },
        error: () => {
          this.error = 'Error updating comment';
        }
      });
    } else {
      console.log('Formulario inválido, por favor revisa los campos.');
    }
  }

  private oneOfTwoRequiredValidator(otherControlName: string) {
    return (control: AbstractControl) => {
      const otherControl = this.commentFormular?.get(otherControlName);
      if (control.value || (otherControl && otherControl.value)) {
        return null;
      }
      return { oneOfTwoRequired: true };
    };
  }
}
