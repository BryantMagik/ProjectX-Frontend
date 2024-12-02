import { Component } from '@angular/core';
import { ModalCreateProjectComponent } from "../modal-create-project/modal-create-project.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-switcher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-switcher.component.html',
  styleUrl: './project-switcher.component.css'
})
export class ProjectSwitcherComponent {
}
