import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SubtaskService } from '../../service/subtask/subtask.service';
import { Subtask } from '../../model/subtask.interface';
import { tap } from 'rxjs';
import { TASKSSTATUS } from '../../types/models';



@Component({
  selector: 'app-subtasks-details',
  imports: [CommonModule, NgClass, ReactiveFormsModule],
  templateUrl: './subtasks-details.component.html',
  styleUrl: './subtasks-details.component.css',
  standalone: true
})

export class SubtasksDetailsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private subtaskService = inject(SubtaskService);

  subtask: Subtask | null = null;
  taskStatuses = TASKSSTATUS;

  isEditing = false;
  subtasksFormular: FormGroup;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);
  constructor() {
    this.subtasksFormular = this.fb.group({
      name: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(50)]],
      description: [{ value: '', disabled: true }],
      status: [{ value: '', disabled: true }, Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadSubtask();
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
    if (this.subtasksFormular.invalid || !this.subtask) {
      return;
    }

    const updatedSubtask: Partial<Subtask> = {
      name: this.subtasksFormular.get('name')?.value,
      description: this.subtasksFormular.get('description')?.value,
      status: this.subtasksFormular.get('status')?.value,
    };

    this.subtaskService.updateSubtask(this.subtask.id!, updatedSubtask).subscribe({
      next: (updated) => {
        console.log('Subtask updated:', updated);
        this.subtask = { ...this.subtask, ...updated };
        this.isEditing = false;
        this.subtasksFormular.disable();
      },
      error: (err) => {
        console.error('Error updating subtask:', err);
      },
    });

  }

  private loadSubtask(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.subtaskService.getSubtaskById(id).subscribe({
        next: (data) => {
          if (data) {
            this.subtask = data;
            this.subtasksFormular.patchValue({
              name: data.name,
              description: data.description,
              status: data.status,
            });
            console.log('Subtask loaded:', this.subtask);
          } else {
            console.warn('Subtask not found');
          }
        },
        error: (err) => {
          console.error('Error loading subtask:', err);
        }
      });
    }
  }

}
