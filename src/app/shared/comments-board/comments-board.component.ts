import { Component } from '@angular/core';
import { LayoutComponent } from '../../pages/layout/layout.component';

@Component({
  selector: 'app-comments-board',
  standalone: true,
  imports: [LayoutComponent],
  templateUrl: './comments-board.component.html',
  styleUrl: './comments-board.component.css'
})
export class CommentsBoardComponent {

  constructor(private LayoutComponent:LayoutComponent) {}

  setMostrar(value: number) {
    this.LayoutComponent.setMostrar(value);
  }

  setMirando(value: number) {
    this.LayoutComponent.setMirando(value);
  }

}