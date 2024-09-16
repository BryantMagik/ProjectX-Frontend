import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';

@Component({
  selector: 'app-comments-form',
  standalone: true,
  imports: [],
  templateUrl: './comments-form.component.html',
  styleUrl: './comments-form.component.css'
})
export class CommentsFormComponent implements OnInit{
  commentForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.commentForm = this.fb.group({
      body: ['', [Validators.required]],
      issue_id: [null, [Validators.required]],
      author_user_id: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.commentForm.valid) {
      const commentData = this.commentForm.value;
      console.log('Formulario enviado:', commentData);
      // Aquí puedes implementar la lógica para enviar el comentario al servidor
    } else {
      console.log('Formulario no válido');
    }
  }

}
