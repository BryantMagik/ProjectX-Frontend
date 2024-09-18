import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BoardComponent } from "../../shared/board/board.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BoardComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {

}
