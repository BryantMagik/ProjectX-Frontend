import { NgIf,NgClass, NgFor} from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup } from '@angular/forms';

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
  imports: [NgIf,NgClass,NgFor],
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

  isEditing = false;  // Controla si se puede editar

  commentFormular: FormGroup;

  constructor(private fb: FormBuilder) {
    this.commentFormular = this.fb.group({
      id: [{ value: '', disabled: true }],
      content: [{ value: '', disabled: true }],
      date: [{ value: '', disabled: true }],
      issueId: [{ value: '', disabled: true }],
      authorId: [{ value: '', disabled: true }]
    });
  }

  ngOnInit(): void {
  }


  // habilitar o deshabilitar la edición
  toggleEdit() {
    if (this.isEditing) {
      this.isEditing = false;
      this.commentFormular.disable();  // Deshabilitar los campos
    } else {
      this.isEditing = true;
      this.commentFormular.enable();   // Habilitar los campos
    }
  }

  // aplicar los cambios y enviar el formulario
  onSubmit() {
    if (this.commentFormular.valid) {
      console.log('Formulario enviado:', this.commentFormular.value);
    } else {
      console.log('Formulario inválido, por favor revisa los campos.');
    }
    this.isEditing = false;  // Deshabilitar edición tras enviar
    this.commentFormular.disable();  // Volver a deshabilitar los campos
  }
}
