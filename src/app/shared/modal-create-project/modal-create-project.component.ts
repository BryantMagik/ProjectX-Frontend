import { CommonModule } from '@angular/common'
import { Component, Output, EventEmitter } from '@angular/core'

@Component({
  selector: 'app-modal-create-project',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-create-project.component.html',
  styleUrl: './modal-create-project.component.css'
})
export class ModalCreateProjectComponent {
  @Output() close = new EventEmitter<void>()

  onClose(): void {
    this.close.emit()
  }

}
