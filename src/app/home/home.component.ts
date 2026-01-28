
import { Component } from '@angular/core';
import { LoginComponent } from "../components/auth/login/login.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [LoginComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {



}