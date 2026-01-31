import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = signal(false);
  showPassword = signal(false);
  errorMessage = signal<string | undefined>(undefined);

  validatorForm = new FormGroup({
    emailValidator: new FormControl('', [Validators.required, Validators.email]),
    passwordValidator: new FormControl('', [Validators.required])
  });

  login(): void {
    if (this.validatorForm.valid) {
      this.isLoading.set(true);
      const { emailValidator, passwordValidator } = this.validatorForm.value;

      this.authService.login(emailValidator!, passwordValidator!).subscribe({
        next: (_response) => {
          this.isLoading.set(false);
          this.router.navigate(['pages/dashboard']);
        },
        error: (_err) => {
          this.isLoading.set(false);
          this.errorMessage.set('Invalid credentials. Please try again.');
        }
      });
    } else {
      this.errorMessage.set('Please fill in all required fields!');
    }
  }

  get emailControl() {
    return this.validatorForm.get('emailValidator');
  }

  get passwordControl() {
    return this.validatorForm.get('passwordValidator');
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(value => !value);
  }
}
