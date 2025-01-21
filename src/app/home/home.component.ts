import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LoginComponent } from "../components/auth/login/login.component";

@Component({
    selector: 'app-home',
    imports: [CommonModule, LoginComponent],
    templateUrl: './home.component.html'
})
export class HomeComponent {



}
