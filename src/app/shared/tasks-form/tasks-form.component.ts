import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'app-tasks-form',
    imports: [],
    templateUrl: './tasks-form.component.html',
    styleUrl: './tasks-form.component.css'
})
export class TasksFormComponent {
  taskForm: FormGroup;

  constructor(private fb: FormBuilder,private router:Router) {
    this.taskForm = this.fb.group({
      code: ['', [Validators.required, Validators.maxLength(10)]],
      summary: ['', [Validators.required, Validators.maxLength(255)]],
      description: [''],
      priority: ['', Validators.required],
      task_type: ['', Validators.required],
      status: ['', Validators.required],
      project_id: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      assigned_user_id: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      estimation: ['', Validators.pattern('^[0-9]*$')],
      due_date: ['']
    });
  }

  navigateToTasks() {
    this.router.navigate(['/pages/tasks']);
  }

  onSubmit() {
    if (this.taskForm.valid) {
      console.log('Formulario válido, tarea creada:', this.taskForm.value);
    } else {
      console.log('Formulario inválido, por favor revisa los campos.');
    }
  }

}
