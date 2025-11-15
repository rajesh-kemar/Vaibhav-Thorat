import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Authservice, LoginCredentials, UserRole } from '../../services/authservice';

@Component({
  selector: 'app-login.comp',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HttpClientModule],
  templateUrl: './login.comp.html',
  styleUrls: ['./login.comp.css']
})
export class LoginComp {
  errorMessage: string = '';

  loginForm: FormGroup<{
    role: FormControl<UserRole>;
    driverName: FormControl<string>;
    licenceNumber: FormControl<string>;
    password: FormControl<string>;
  }>;

  constructor(
    private fb: FormBuilder,
    private authService: Authservice,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      role: ['Dispatcher' as UserRole, Validators.required],
      driverName: ['', Validators.required],
      licenceNumber: ['', Validators.required],
      password: ['', Validators.required]
    }) as FormGroup<any>;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    const role = this.loginForm.value.role as UserRole;

    const credentials: LoginCredentials = {
      role,
      driverName: this.loginForm.value.driverName!,
      licenceNumber: this.loginForm.value.licenceNumber!,
      password: this.loginForm.value.password!
    };

    this.authService.login(credentials).subscribe({
      next: res => {
        // Store info in localStorage
        localStorage.setItem('driverName', res.driverName || '');
        localStorage.setItem('role', res.role);
        if (res.driverId) localStorage.setItem('driverId', res.driverId.toString());

        this.errorMessage = '';

        // Redirect based on role
        if (res.role === 'Dispatcher') {
          this.router.navigate(['/dashboard']);
        } else if (res.role === 'Driver') {
          this.router.navigate(['/dashboard']); // driver-specific dashboard
        } else {
          this.router.navigate(['/']); // fallback
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('Login error:', err);
        if (err.status === 401) this.errorMessage = 'Invalid credentials.';
        else if (err.status === 400) this.errorMessage = 'Invalid request.';
        else this.errorMessage = 'An unexpected error occurred.';
      }
    });
  }
}
