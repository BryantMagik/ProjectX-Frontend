import { Component } from '@angular/core';
import { LayoutComponent } from '../../pages/layout/layout.component';

@Component({
    selector: 'app-issues-board',
    imports: [LayoutComponent],
    templateUrl: './issues-board.component.html',
    styleUrl: './issues-board.component.css'
})
export class IssuesBoardComponent {

  constructor(private LayoutComponent:LayoutComponent) {}

  // setMostrar(value: number) {
  //   this.LayoutComponent.setMostrar(value);
  // }

  // setMirando(value: number) {
  //   this.LayoutComponent.setMirando(value);
  // }

}