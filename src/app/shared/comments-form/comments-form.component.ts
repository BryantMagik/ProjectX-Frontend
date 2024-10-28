import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-comments-form',
  standalone: true,
  imports: [],
  templateUrl: './comments-form.component.html',
  styleUrl: './comments-form.component.css'
})
export class CommentsFormComponent implements OnInit{
  commentForm: FormGroup;

  constructor(private fb: FormBuilder, private router:Router) {
    this.commentForm = this.fb.group({
      body: ['', [Validators.required]],
      issue_id: [null, [Validators.required]],
      author_user_id: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {}

  navigateToComments(){
    this.router.navigate(['/pages/comments']);
  }

  onSubmit(): void {
    if (this.commentForm.valid) {
      const commentData = this.commentForm.value;
      console.log('Formulario enviado:', commentData);

      //TODO::
    } else {
      console.log('Formulario no válido');
    }
  }

}
