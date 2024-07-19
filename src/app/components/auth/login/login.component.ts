import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../service/auth/auth.service';
import { Router } from '@angular/router';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FloatLabelModule,
    InputTextModule,
    ButtonModule,
    CalendarModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export default class LoginComponent {

  constructor(private authService: AuthService, private router: Router) { }

  email: string = '';
  password: string = '';
  errorMessage: string | undefined = '';

  validatorForm = new FormGroup({
    emailValidator: new FormControl('', [Validators.required]),
    passwordValidator: new FormControl('', [Validators.required])
  })

  login(): void {
    if (this.validatorForm.valid) {
      const { emailValidator, passwordValidator } = this.validatorForm.value;
      this.authService.login(emailValidator!, passwordValidator!).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: () => {
          this.errorMessage = 'Credenciales inválidas. Por favor, inténtalo de nuevo.';
        }
      });
    } else {
      this.errorMessage = 'Por favor, completa todos los campos.';
    }
  }
}
