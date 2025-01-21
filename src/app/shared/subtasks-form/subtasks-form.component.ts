import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { Router } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { TASKSSTATUS } from '../../types/models';
import { Subtask } from '../../model/subtask.interface';
import { SubtaskService } from '../../service/subtask/subtask.service';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-subtasks-form',
    imports: [CommonModule, DropdownModule, InputTextModule, ToastModule, ReactiveFormsModule],
    templateUrl: './subtasks-form.component.html',
    styleUrl: './subtasks-form.component.css',
    providers: [MessageService]
})
export class SubtasksFormComponent implements OnInit {

  subtaskForm!: FormGroup;
  taskStatuses = TASKSSTATUS;

  constructor(
    private fb: FormBuilder,
    private router:Router,
    private subtaskService: SubtaskService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.subtaskForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: [''],
      status: ['', Validators.required],
      taskId: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  navigateToSubTasks() {
    this.router.navigate(['/pages/subtasks']);
  }

  onSubmit():void{
    if (this.subtaskForm.valid) {
      const subtaskData: Partial<Subtask> = {
        ...this.subtaskForm.value,
      };

      this.subtaskService.createSubtask(subtaskData).subscribe({
        next: () => {
          this.showSuccess();
          this.navigateToSubTasks();
        },
        error: (err) => {
          console.error('Error al crear la subtarea:', err);
        }
      });
    } else {
      console.warn('Formulario no válido:', this.subtaskForm.value);
    }

  }

  showSuccess(): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: 'La subtarea se creó correctamente'
    });
  }

}
