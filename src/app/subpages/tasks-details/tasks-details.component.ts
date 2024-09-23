import { Component,OnInit } from '@angular/core';
import { CommonModule, NgFor, NgClass } from '@angular/common';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';

export interface Taskdetail{
  id:number;
  code:string;
  summary:string;
  description:string;
  priority:string;
  type:string;
  status:string;
  projectid:number;
  asigneruserid:number;
  estimation:string;
  duedate:string;
}

@Component({
  selector: 'app-tasks-details',
  standalone: true,
  imports: [CommonModule,NgFor,NgClass],
  templateUrl: './tasks-details.component.html',
  styleUrl: './tasks-details.component.css'
})
export class TasksDetailsComponent implements OnInit{
  taskdetails: Taskdetail[] =[
    {
      id: 1,
      code: 'PRJ001',
      summary: 'Project Summary',
      description: 'Description of the project',
      priority: 'High',
      type: 'Bug',
      status: 'Ongoing',
      projectid: 10,
      asigneruserid: 1001,
      estimation: '5 days',
      duedate: '2024-12-31'
    }
  ]

  isEditing = false;
  tasksFormular: FormGroup;
  constructor(private fb: FormBuilder) {
    this.tasksFormular = this.fb.group({
      id: [{ value: '', disabled: true }],
      code: ['', [Validators.required, Validators.maxLength(10)]],
      summary: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['',[Validators.required, Validators.maxLength(10024)]],
      priority: ['', Validators.required],
      task_type: ['', Validators.required],
      status: ['', Validators.required],
      project_id: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      assigned_user_id: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      estimation: ['', Validators.pattern('^[0-9]*$')],
      due_date: ['']
    });

  }

  ngOnInit(): void {
  }

  toggleEdit() {
    if (this.isEditing) {
      this.isEditing = false;
      this.tasksFormular.disable();  // Deshabilitar los campos
    } else {
      this.isEditing = true;
      this.tasksFormular.enable();   // Habilitar los campos
    }
  }

  onSubmit() {
    if (this.tasksFormular.valid) {
      console.log('Formulario enviado:', this.tasksFormular.value);
    } else {
      console.log('Formulario inválido, por favor revisa los campos.');
    }
    this.isEditing = false;  // Deshabilitar edición tras enviar
    this.tasksFormular.disable();  // Volver a deshabilitar los campos
  }

}
