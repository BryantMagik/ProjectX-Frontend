import { Component,OnInit } from '@angular/core';
import { CommonModule, NgFor, NgClass } from '@angular/common';
import { FormGroup,Validators,FormBuilder } from '@angular/forms';

interface Issue {
  id: string;
  code: string;
  type: string;
  summary: string;
  description: string;
  priority: string;
  project_id: string;
  reporterUserId: string;
  status: string;
  creation_date: string;
  update_date: string;
  asigned:string;
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
      id:'112233374',
      code: 'ISSUE-001',
      type: 'Bug',
      summary: 'Error en la página de login',
      description: 'Hay un error que impide que los usuarios puedan iniciar sesión en la página de login. El error ocurre cuando se ingresan credenciales incorrectas.',
      priority:'medium',
      project_id:'1224e4a55a',
      reporterUserId: '7854477474',
      status: 'pending',
      creation_date:'16/07/2024',
      update_date:'21/09/2024',
      asigned:'María Juana',
    }
  ];

  isEditing = false;
  issuesFormular: FormGroup;
  constructor(private fb: FormBuilder) {
    this.issuesFormular = this.fb.group({
      id: ['', [Validators.required, Validators.maxLength(255)]],
      type: ['bug', Validators.required],
      summary: ['', [Validators.required, Validators.maxLength(1024)]],
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
