import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../service/auth/auth.service';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroLockClosed, heroUsers } from '@ng-icons/heroicons/outline';
import { featherAirplay } from '@ng-icons/feather-icons';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    CalendarModule,
    NgIconComponent,
    InputGroupModule,
    InputGroupAddonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  viewProviders: [provideIcons({ featherAirplay, heroUsers, heroLockClosed })]

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
      setTimeout(() => {
        this.isLoading = false;
        this.authService.login(emailValidator!, passwordValidator!).subscribe({
          next: (response) => {
            this.router.navigate(['pages/dashboard']);
          },
          error: (err) => {

            this.errorMessage = 'Credenciales inválidas. Por favor, inténtalo de nuevo.';
          }
        });
      }, 2000)
    } else {
      this.errorMessage = 'Por favor, completa todos los campos.';
    }
  }

  get emailControl() {
    return this.validatorForm.get('emailValidator');
  }

  get passwordControl() {
    return this.validatorForm.get('passwordValidator');
  }
}
