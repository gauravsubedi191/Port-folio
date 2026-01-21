import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-container">
      <div class="login-box">
        <h1 class="login-title">Admin Login</h1>
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="username">Username</label>
            <input type="text" id="username" formControlName="username" class="form-control"
              [class.error]="isFieldInvalid('username')">
            @if (isFieldInvalid('username')) {
              <span class="error-msg">Username is required</span>
            }
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" formControlName="password" class="form-control"
              [class.error]="isFieldInvalid('password')">
            @if (isFieldInvalid('password')) {
              <span class="error-msg">Password is required</span>
            }
          </div>

          @if (loginError) {
            <div class="alert alert-error">
              {{ loginError }}
            </div>
          }

          <button type="submit" class="btn-submit" [disabled]="isLoading">
            @if (!isLoading) {
              <span>Login</span>
            } @else {
              <span>Loading...</span>
            }
          </button>
            <button class="btn-submit" (click)="homepage()" style="margin-top:8px;">
              <span>Back To HomePage</span>
            </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg-primary);
      padding: 1.5rem;
    }
    .login-box {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      padding: 2.5rem;
      border-radius: 16px;
      max-width: 400px;
      width: 100%;
    }
    .login-title {
      text-align: center;
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 2rem;
      background: var(--accent-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .form-group {
      margin-bottom: 1.25rem;
    }
    label {
      display: block;
      margin-bottom: 0.4rem;
      font-weight: 500;
      color: var(--text-secondary);
      font-size: 0.9rem;
    }
    .form-control {
      width: 100%;
      padding: 0.7rem 0.9rem;
      border: 1px solid var(--border-color);
      background: var(--bg-tertiary);
      color: var(--text-primary);
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.3s ease;
      box-sizing: border-box;
    }
    .form-control:focus {
      outline: none;
      border-color: var(--accent-primary);
      box-shadow: 0 0 0 3px var(--accent-glow);
    }
    .form-control.error {
      border-color: var(--error);
    }
    .error-msg {
      display: block;
      color: var(--error);
      font-size: 0.8rem;
      margin-top: 0.3rem;
    }
    .alert-error {
      background: rgba(239, 68, 68, 0.15);
      color: var(--error);
      border: 1px solid var(--error);
      padding: 0.75rem;
      border-radius: 8px;
      margin-bottom: 1rem;
      text-align: center;
      font-size: 0.9rem;
    }
    .btn-submit {
      width: 100%;
      padding: 0.85rem;
      background: var(--accent-gradient);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .btn-submit:hover:not(:disabled) {
      opacity: 0.9;
      transform: translateY(-1px);
    }
    .btn-submit:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Mobile */
    @media (max-width: 480px) {
      .login-box {
        padding: 2rem 1.5rem;
      }
      .login-title {
        font-size: 1.5rem;
        margin-bottom: 1.5rem;
      }
    }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup;
  isLoading = false;
  loginError = '';

  constructor() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control && control.invalid && control.touched);
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.loginError = '';

      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/admin/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          this.loginError = error.error?.message || 'Invalid credentials. Please try again.';
        }
      });
    } else {
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
    }
  }

  homepage(){
    this.router.navigate(['/']);
  }
}