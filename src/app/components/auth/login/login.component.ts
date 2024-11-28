import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../service/auth/auth.service';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CommonModule } from '@angular/common';
import { provideIcons } from '@ng-icons/core';
import { heroLockClosed, heroUsers } from '@ng-icons/heroicons/outline';
import { featherAirplay } from '@ng-icons/feather-icons';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    CalendarModule,
    InputGroupModule,
    InputGroupAddonModule,
    DividerModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  viewProviders: [provideIcons({ featherAirplay, heroUsers, heroLockClosed })],
})
export class LoginComponent {
  isLoading = false;
  validatorForm: FormGroup;
  errorMessage: string | undefined = '';

  constructor(private authService: AuthService, private router: Router) {
    this.validatorForm = new FormGroup({
      emailValidator: new FormControl('', [Validators.required, Validators.email]),
      passwordValidator: new FormControl('', [Validators.required])
    })
  }

  login(): void {
    if (this.validatorForm.valid) {
      this.isLoading = true
      const { emailValidator, passwordValidator } = this.validatorForm.value;

      this.authService.login(emailValidator!, passwordValidator!).subscribe({
        next: (response) => {
          this.isLoading = false
          this.router.navigate(['pages/dashboard']);
        },
        error: (err) => {
          this.isLoading = false
          this.errorMessage = 'Invalid credentials. Please try again.';
        }
      });
    } else {
      this.errorMessage = 'Please fill in all required fields!';
    }
  }

  get emailControl() {
    return this.validatorForm.get('emailValidator');
  }

  get passwordControl() {
    return this.validatorForm.get('passwordValidator');
  }
}
