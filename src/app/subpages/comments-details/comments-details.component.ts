import { NgIf,NgClass, NgFor} from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup,Validators,AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { CommentsService } from '../../service/comment/comments.service';
import { Comment } from '../../model/comment.interface';
import { tap } from 'rxjs';

@Component({
    selector: 'app-comments-details',
    imports: [NgIf, NgClass, ReactiveFormsModule],
    templateUrl: './comments-details.component.html',
    styleUrl: './comments-details.component.css',
    standalone:true

})
export class CommentsDetailsComponent implements OnInit{

  isEditing = false;

  commentFormular: FormGroup;

  commentId: string | null = null;
  comment: Comment | null = null;

  constructor(
    private route: ActivatedRoute,
    private commentsService: CommentsService,
    private fb: FormBuilder,
    private router:Router
  ) {
    this.commentFormular = this.fb.group({
      body: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  ngOnInit(): void {
    this.commentId = this.route.snapshot.paramMap.get('id');

    if (this.commentId) {
      this.loadComment(this.commentId);
    } else {
      console.error('No se proporcionó un ID de comentario.');
    }
  }
  
  navigateToComments(){
    this.router.navigate(['/pages/comments']);
  }

  loadComment(id: string): void {
    this.commentsService.findOne(id).subscribe({
      next: (comment) => {
        if (comment) {
          this.comment = comment;
          this.commentFormular.patchValue({
            body: comment.body
          });
          this.commentFormular.disable();
        } else {
          console.warn('No se encontró el comentario.');
        }
      },
      error: (err) => {
        console.error('Error al cargar el comentario:', err);
      }
    });
  }


  // habilitar o deshabilitar la edición
  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.commentFormular.enable();
    } else {
      this.commentFormular.disable();
    }
  }

  onSubmit() {
    if (this.commentFormular.invalid || !this.commentId) {
      console.warn('El formulario es inválido o no hay un ID de comentario.');
      return;
    }

    const updatedBody = this.commentFormular.get('body')?.value;

    this.commentsService.update(this.commentId, { body: updatedBody }).subscribe({
      next: (updatedComment) => {
        if (updatedComment) {
          console.log('Comentario actualizado:', updatedComment);
          this.comment = updatedComment; // Actualizar los datos locales
          this.isEditing = false;
          this.commentFormular.disable();
        }
      },
      error: (err) => {
        console.error('Error al actualizar el comentario:', err);
      }
    });
    
  }

  
}
