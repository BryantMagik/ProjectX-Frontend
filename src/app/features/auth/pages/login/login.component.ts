import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { injectMutation } from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';

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
export class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  showPassword = signal(false);
  private returnUrl: string = '/projects';

  validatorForm = new FormGroup({
    emailValidator: new FormControl('', [Validators.required, Validators.email]),
    passwordValidator: new FormControl('', [Validators.required])
  });

  loginMutation = injectMutation(() => ({
    mutationFn: (credentials: { email: string; password: string }) =>
      firstValueFrom(this.authService.login(credentials.email, credentials.password)),
    onSuccess: () => this.router.navigateByUrl(this.returnUrl),
  }));

  isLoading = this.loginMutation.isPending;
  errorMessage = computed(() =>
    this.loginMutation.isError() ? 'Invalid credentials. Please try again.' : undefined
  );

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['returnUrl']) {
        this.returnUrl = params['returnUrl'];
      }
    });
  }

  login(): void {
    if (this.validatorForm.valid) {
      const { emailValidator, passwordValidator } = this.validatorForm.value;
      this.loginMutation.mutate({ email: emailValidator!, password: passwordValidator! });
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
