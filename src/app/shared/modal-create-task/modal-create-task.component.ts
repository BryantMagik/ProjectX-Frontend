import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Select } from 'primeng/select';

@Component({
  selector: 'app-modal-create-task',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './modal-create-task.component.html',
  styleUrl: './modal-create-task.component.css'
})
export class ModalCreateTaskComponent implements OnInit {

  @Output() close = new EventEmitter<void>()

  taskForm!: FormGroup


  constructor(
    private fb: FormBuilder,

  ) { }

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      code: ['', [Validators.required, Validators.maxLength(10)]],
    })
  }

  onSubmit(): void {

  }

  onClose(): void {
    this.close.emit()
  }
}
