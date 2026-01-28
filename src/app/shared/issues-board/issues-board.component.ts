import { Component, inject } from '@angular/core';
import { LayoutComponent } from '../../pages/layout/layout.component';

@Component({
  selector: 'app-issues-board',
  imports: [LayoutComponent],
  templateUrl: './issues-board.component.html',
  styleUrl: './issues-board.component.css',
  standalone: true

})
export class IssuesBoardComponent {
  private LayoutComponent = inject(LayoutComponent);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);


  constructor() { }

  // setMostrar(value: number) {
  //   this.LayoutComponent.setMostrar(value);
  // }

  // setMirando(value: number) {
  //   this.LayoutComponent.setMirando(value);
  // }

}