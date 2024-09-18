import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-subtasks-form',
  standalone: true,
  imports: [],
  templateUrl: './subtasks-form.component.html',
  styleUrl: './subtasks-form.component.css'
})
export class SubtasksFormComponent implements OnInit {

  subtaskForm: FormGroup;
  currentDate = new Date().toISOString();  // Para las fechas de creación y actualización

  constructor(private fb: FormBuilder) {
    this.subtaskForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: [''],
      status: ['', Validators.required],
      task_id: ['', [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.subtaskForm.valid) {
      console.log('Formulario válido:', this.subtaskForm.value);
      // Aquí puedes realizar la acción para enviar los datos al backend.
    } else {
      console.log('Formulario no válido');
    }
  }

}
