import { Component } from '@angular/core';
import { LayoutComponent } from '../../pages/layout/layout.component';

@Component({
  selector: 'app-tasks-board',
  standalone: true,
  imports: [LayoutComponent],
  templateUrl: './tasks-board.component.html',
  styleUrl: './tasks-board.component.css'
})
export class TasksBoardComponent {

  constructor(private LayoutComponent:LayoutComponent) {}

  // setMostrar(value: number) {
  //   this.LayoutComponent.setMostrar(value);
  // }

  // setMirando(value: number) {
  //   this.LayoutComponent.setMirando(value);
  // }

}
