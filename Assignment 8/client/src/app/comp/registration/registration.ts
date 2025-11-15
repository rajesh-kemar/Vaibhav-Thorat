import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-registration',
  imports: [CommonModule, ReactiveFormsModule, FormsModule,RouterModule],
  templateUrl: './registration.html',
  styleUrls: ['./registration.css']
})
export class RegistrationComponent implements OnInit {
  registrationForm!: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required],
      licenseNumber: [''],
      experienceYears: ['']
    });

    // Dynamically validate driver fields
    this.registrationForm.get('role')?.valueChanges.subscribe(role => {
      if (role === 'Driver') {
        this.registrationForm.get('licenseNumber')?.setValidators([Validators.required, Validators.pattern(/^[A-Z0-9-]+$/)]);
        this.registrationForm.get('experienceYears')?.setValidators([Validators.required, Validators.min(1), Validators.max(50)]);
      } else {
        this.registrationForm.get('licenseNumber')?.clearValidators();
        this.registrationForm.get('experienceYears')?.clearValidators();
      }

      this.registrationForm.get('licenseNumber')?.updateValueAndValidity();
      this.registrationForm.get('experienceYears')?.updateValueAndValidity();
    });
  }

  get f() {
    return this.registrationForm.controls;
  }

  get isDriver(): boolean {
    return this.registrationForm.get('role')?.value === 'Driver';
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.registrationForm.invalid) {
      return;
    }

    const formData = { ...this.registrationForm.value };

    if (!this.isDriver) {
      delete formData.licenseNumber;
      delete formData.experienceYears;
    }

    console.log('Registration Data:', formData);
    alert('✅ Registration Successful!');
    this.registrationForm.reset();
    this.submitted = false;
  }
}
