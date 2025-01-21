import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'app-modal-delete-workspace',
    imports: [],
    templateUrl: './modal-delete-workspace.component.html',
    styleUrl: './modal-delete-workspace.component.css'
})
export class ModalDeleteWorkspaceComponent {
  @Output() close = new EventEmitter<void>()
  @Output() deleteConfirmed = new EventEmitter<void>()

  closeModal() {
    this.close.emit();
  }

  confirmDelete() {
    this.deleteConfirmed.emit();
  }
}
