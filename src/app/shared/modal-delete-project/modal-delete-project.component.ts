import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-modal-delete-project',
  standalone: true,
  imports: [],
  templateUrl: './modal-delete-project.component.html',
  styleUrl: './modal-delete-project.component.css'
})
export class ModalDeleteProjectComponent {
  @Output() close = new EventEmitter<void>()
  @Output() deleteConfirmed = new EventEmitter<void>()

  closeModal() {
    this.close.emit();
  }

  confirmDelete() {
    this.deleteConfirmed.emit();
  }
}
