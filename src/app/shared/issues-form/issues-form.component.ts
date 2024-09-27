import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-issues-form',
  standalone: true,
  imports: [],
  templateUrl: './issues-form.component.html',
  styleUrl: './issues-form.component.css'
})
export class IssuesFormComponent implements OnInit {
  issueForm: FormGroup;

  constructor(private fb: FormBuilder,private router:Router) {
    this.issueForm = this.fb.group({
      id: ['', [Validators.required, Validators.maxLength(255)]],
      type: ['bug', Validators.required],
      summary: ['', [Validators.required, Validators.maxLength(1024)]],
      description: [''],
      projectId: ['', Validators.required],
      reporterUserId: ['', Validators.required],
      status: ['pending', Validators.required],
    });
  }

  ngOnInit(): void {}

  navigateToIssues(){
    this.router.navigate(['/pages/issues']);
  }

  onSubmit(): void {
    if (this.issueForm.valid) {
      const newIssue = this.issueForm.value;
      // Aquí se puede manejar la lógica para enviar los datos a la API
      console.log('Issue creado:', newIssue);
    }
  }

}
