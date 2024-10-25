import { Component,OnInit } from '@angular/core';
import { CommonModule, NgClass, NgFor } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

export interface SubtaskDetail {
  subtask_id: number;
  name: string;
  description: string;
  status: string;
  task_id: number;
  creation_date: string;
  update_date: string;
}

@Component({
  selector: 'app-subtasks-details',
  standalone: true,
  imports: [CommonModule,NgFor,NgClass],
  templateUrl: './subtasks-details.component.html',
  styleUrl: './subtasks-details.component.css'
})

export class SubtasksDetailsComponent implements OnInit {
  subtaskdetails: SubtaskDetail[] = [
    {
      subtask_id: 1,
      name: 'Subtask 1',
      description: 'Description of subtask 1',
      status: 'Pending',
      task_id: 1,
      creation_date: '2024-07-01',
      update_date: '2024-07-15'
    }
  ];

  isEditing = false;
  subtasksFormular: FormGroup;
  constructor(private fb: FormBuilder,private router:Router) { 
    this.subtasksFormular = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: [''],
      status: ['', Validators.required],
      task_id: ['', [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
  }

  navigateToSubTasks() {
    this.router.navigate(['/pages/subtasks']);
  }

  toggleEdit() {
    if (this.isEditing) {
      this.isEditing = false;
      this.subtasksFormular.disable();  // Deshabilitar los campos
    } else {
      this.isEditing = true;
      this.subtasksFormular.enable();   // Habilitar los campos
    }
  }

  onSubmit() {
    if (this.subtasksFormular.valid) {
      console.log('Formulario enviado:', this.subtasksFormular.value);
    } else {
      console.log('Formulario inválido, por favor revisa los campos.');
    }
    this.isEditing = false;  // Deshabilitar edición tras enviar
    this.subtasksFormular.disable();  // Volver a deshabilitar los campos
  }

}
