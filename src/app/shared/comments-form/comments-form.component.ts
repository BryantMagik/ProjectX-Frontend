import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastCloseEvent, ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CommentsService } from '../../service/comment/comments.service';
@Component({
    selector: 'app-comments-form',
    imports: [ReactiveFormsModule, CommonModule, ToastModule],
    templateUrl: './comments-form.component.html',
    styleUrl: './comments-form.component.css',
    standalone:true
})
export class CommentsFormComponent implements OnInit{
  commentForm!: FormGroup;
  isEditing = false;
  commentId: string | null = null;

  constructor(
    private fb: FormBuilder, 
    private router:Router,
    private commentsService: CommentsService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    if (this.commentId) {
      this.isEditing = true;
      this.loadCommentDetails(this.commentId);
    }

  }

  private initializeForm(): void {
    this.commentForm = this.fb.group({
      body: ['', [Validators.required, Validators.maxLength(500)]],
      issueId: [null, [Validators.required]], // Opcional
      taskId: [null, [Validators.required]],  // Opcional
    }, {
      validators: [this.oneFieldRequiredValidator('issueId', 'taskId')]
    });
  }

  private loadCommentDetails(commentId: string): void {
    this.commentsService.findOne(commentId).subscribe({
      next: (comment) => {
        if (comment) {
          this.commentForm.patchValue(comment);
        }
      },
      error: (err) => {
        console.error('Error al cargar el comentario:', err);
        this.showError('Error al cargar el comentario.');
      }
    });
  }

  navigateToComments(){
    this.router.navigate(['/pages/comments']);
  }

  onSubmit(): void {
    if (this.commentForm.valid) {
      const commentData = this.commentForm.value;

      if (this.isEditing && this.commentId) {
        this.commentsService.update(this.commentId,commentData).subscribe({
          next: () => {
            this.showSuccess('Comentario actualizado exitosamente.');
            this.navigateToComments();
          },
          error: (err) => {
            console.error('Error al actualizar el comentario:', err);
            this.showError('Error al actualizar el comentario.');
          }
        });
      } else {
        this.commentsService.create(commentData).subscribe({
          next: () => {
            this.showSuccess('Comentario creado exitosamente.');
            this.navigateToComments();
          },
          error: (err) => {
            console.error('Error al crear el comentario:', err);
            this.showError('Error al crear el comentario.');
          }
        });
      }
    } else {
      console.warn('Formulario inválido:', this.commentForm.errors);
    }
  }

  showSuccess(message: string): void {
    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: message });
  }

  showError(message: string): void {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
  }

  private oneFieldRequiredValidator(field1: string, field2: string) {
    return (formGroup: FormGroup) => {
      const value1 = formGroup.get(field1)?.value;
      const value2 = formGroup.get(field2)?.value;

      if (!value1 && !value2) {
        return { oneFieldRequired: true };
      }
      return null;
    };
  }

}
