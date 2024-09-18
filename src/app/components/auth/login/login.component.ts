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
  validatorForm: FormGroup;
  errorMessage: string | undefined = '';

  constructor(private authService: AuthService, private router: Router) {
    this.validatorForm = new FormGroup({
      emailValidator: new FormControl('', [Validators.required, Validators.email]),
      passwordValidator: new FormControl('', [Validators.required])
    })
  }

  login(): void {
    console.log('Intentando iniciar sesión');
    if (this.validatorForm.valid) {
      const { emailValidator, passwordValidator } = this.validatorForm.value;
      this.authService.login(emailValidator!, passwordValidator!).subscribe({
        next: (response) => {
          console.log('Login exitoso', response);
          this.router.navigate(['pages/dashboard']);
        },
        error: (err) => {
          console.error('Error en el login', err);
          this.errorMessage = 'Credenciales inválidas. Por favor, inténtalo de nuevo.';
        }
      });
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
