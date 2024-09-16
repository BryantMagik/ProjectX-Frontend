import { Component } from '@angular/core';
import { LayoutComponent } from '../../pages/layout/layout.component';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [LayoutComponent],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent {

  constructor(private LayoutComponent: LayoutComponent) { 

  }
  
  setFormular(value: number) {
    this.LayoutComponent.setFormular(value);
  }

  setMostrar(value: number) {
    this.LayoutComponent.setMostrar(value);
  }

  setMirando(value: number) {
    this.LayoutComponent.setMirando(value);
  }


}
