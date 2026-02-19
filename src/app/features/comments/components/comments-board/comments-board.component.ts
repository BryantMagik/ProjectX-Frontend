import { Component, inject } from '@angular/core';
import { LayoutComponent } from '../../../../layouts/app-layout/layout.component';

@Component({
    selector: 'app-comments-board',
    imports: [LayoutComponent],
    templateUrl: './comments-board.component.html',
    styleUrl: './comments-board.component.css',
    standalone:true

})
export class CommentsBoardComponent {
  private LayoutComponent = inject(LayoutComponent);



  constructor() {}

  // setMostrar(value: number) {
  //   this.LayoutComponent.setMostrar(value);
  // }

  // setMirando(value: number) {
  //   this.LayoutComponent.setMirando(value);
  // }

}
