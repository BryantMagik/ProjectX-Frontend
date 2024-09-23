import { Component,OnInit } from '@angular/core';
import { CommonModule, NgFor, NgClass } from '@angular/common';
import { FormGroup,Validators,FormBuilder } from '@angular/forms';

interface Issue {
  id: string;
  tipo: string;
  resumen: string;
  description: string;
  asignado: string;
  reportadoPor: string;
  estado: string;
}

@Component({
  selector: 'app-issuesdetails',
  standalone: true,
  imports: [NgFor,CommonModule,NgClass],
  templateUrl: './issuesdetails.component.html',
  styleUrl: './issuesdetails.component.css'
})
export class IssuesdetailsComponent implements OnInit{
  issues: Issue[] = [
    {
      id: 'ISSUE-001',
      tipo: 'Bug',
      resumen: 'Error en la página de login',
      description: 'Hay un error que impide que los usuarios puedan iniciar sesión en la página de login. El error ocurre cuando se ingresan credenciales incorrectas.',
      asignado: 'Juan Pérez',
      reportadoPor: 'María Juana',
      estado: 'pending'
    }
  ];

  isEditing = false;
  issuesFormular: FormGroup;
  constructor(private fb: FormBuilder) {
    this.issuesFormular = this.fb.group({
      code: ['', [Validators.required, Validators.maxLength(10)]],
      type: ['bug', Validators.required],
      summary: ['', [Validators.required, Validators.maxLength(255)]],
      description: [''],
      priority: ['medium', Validators.required],
      projectId: ['', Validators.required],
      reporterUserId: ['', Validators.required],
      status: ['pending', Validators.required],
    });

  }

  ngOnInit(): void {
  }

  toggleEdit() {
    if (this.isEditing) {
      this.isEditing = false;
      this.issuesFormular .disable();  // Deshabilitar los campos
    } else {
      this.isEditing = true;
      this.issuesFormular .enable();   // Habilitar los campos
    }
  }

  onSubmit() {
    if (this.issuesFormular .valid) {
      console.log('Formulario enviado:', this.issuesFormular .value);
    } else {
      console.log('Formulario inválido, por favor revisa los campos.');
    }
    this.isEditing = false;  // Deshabilitar edición tras enviar
    this.issuesFormular .disable();  // Volver a deshabilitar los campos
  }


}
