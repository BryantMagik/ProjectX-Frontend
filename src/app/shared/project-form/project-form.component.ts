import { Component,OnInit } from '@angular/core';
import {FormBuilder,FormGroup,Validators} from '@angular/forms';
import { LayoutComponent } from '../../pages/layout/layout.component';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [LayoutComponent],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.css'
})
export class ProjectFormComponent implements OnInit {
  projectForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.projectForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      description: [''],
      code: ['', [Validators.required, Validators.maxLength(10)]],
      type: ['', Validators.required],
      status: ['', Validators.required],
      userId: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      console.log('Formulario válido', this.projectForm.value);
      // Aquí puedes agregar la lógica para enviar el formulario a la API
    } else {
      console.log('Formulario inválido');
    }
  }

}
