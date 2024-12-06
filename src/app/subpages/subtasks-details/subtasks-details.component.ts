import { Component,OnInit } from '@angular/core';
import { CommonModule, NgClass, NgFor } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { SubtaskService } from '../../service/subtask/subtask.service';
import { Subtask } from '../../model/subtask.interface';
import { tap } from 'rxjs';

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
  imports: [CommonModule,NgFor,NgClass,ReactiveFormsModule],
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

  subtask: Subtask | null = null;
  subtaskId: string | null = null;
  loading = true;
  error: string | null = null;

  isEditing = false;
  subtasksFormular: FormGroup;
  constructor(
    private fb: FormBuilder,
    private router:Router,
    private route: ActivatedRoute,
    private subtaskService: SubtaskService
  ) { 
    this.subtasksFormular = this.fb.group({
      name: [{value:'', disabled: true}, [Validators.required, Validators.maxLength(50)]],
      description: [{value:'', disabled: true}],
      status: [{value:'', disabled: true}, Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.subtaskId = params.get('id');
      if (this.subtaskId) {
        this.getSubtaskById(this.subtaskId);
      }
    });
  }

  private getSubtaskById(id: string) {
    this.subtaskService.getSubtaskById(id).pipe(
      tap({
        next: (subtask: Subtask | null) => {
          this.subtask = subtask;
          console.log("Recibiendo subtarea", this.subtask);
          if (subtask) {
            this.subtasksFormular.patchValue({
              name: subtask.name,
              description: subtask.description,
              status: subtask.status,
              taskId: subtask.taskId,
              authorId: subtask.authorId
            });
          }
        },
        error: () => {
          this.error = 'Error al cargar la subtarea';
          this.loading = false;
        },
        complete: () => this.loading = false
      })
    ).subscribe();
  }

  navigateToSubTasks() {
    this.router.navigate(['/pages/subtasks']);
  }

  toggleEdit() {
    if (this.isEditing) {
      this.isEditing = false;
      this.subtasksFormular.disable(); 
    } else {
      this.isEditing = true;
      this.subtasksFormular.enable();
    }
  }

  onSubmit() {
    if (this.subtasksFormular.valid && this.subtaskId) {
      console.log('Formulario enviado:', this.subtasksFormular.value);
      const updateSubtask: Partial<Subtask> = this.subtasksFormular.value;
      this.subtaskService.updateSubtask(this.subtaskId, updateSubtask).subscribe({
        next: () => {
          console.log('Subtarea actualizada con éxito');
          this.navigateToSubTasks();
        },
        error: () => {
          this.error = 'Error al actualizar la subtarea';
        }
      });
    } else {
      console.log('Formulario inválido, por favor revisa los campos.');
    }
    this.isEditing = false;
    this.subtasksFormular.disable();
  }

}
