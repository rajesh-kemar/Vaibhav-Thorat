import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DriverService } from '../../services/driverservice';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Driver } from '../../models/drivermodels';
import { Authservice, UserRole } from '../../services/authservice';

@Component({
  selector: 'app-driver',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './driver.comp.html',
  styleUrls: ['./driver.comp.css'],
})
export class DriverComponent implements OnInit {
  drivers: Driver[] = [];
  driverForm: FormGroup;
  editingDriverId: number | null = null;
  role: UserRole | null = null;
  driverId: number | null = null;

  constructor(
    private driverService: DriverService,
    private fb: FormBuilder,
    public route: ActivatedRoute,
    private authService: Authservice
  ) {
    this.driverForm = this.fb.group({
      driverName: ['', Validators.required],
      licenceNumber: ['', Validators.required],
      experienceYears: [0, [Validators.required, Validators.min(0)]],
      driverAvailable: [true],
    });
  }

  ngOnInit(): void {
    this.role = this.authService.role();
    const driverIdStr = localStorage.getItem('driverId');
    this.driverId = driverIdStr ? +driverIdStr : null;

    this.route.queryParams.subscribe((params) => {
      const filter = params['filter'];
      this.loadDrivers(filter);
    });
  }

  loadDrivers(filter?: string) {
    if (this.role === 'Dispatcher') {
      this.driverService.getAllDrivers().subscribe({
        next: (data) => {
          if (filter === 'available') {
            this.drivers = data.filter((d) => d.driverAvailable);
          } else if (filter === 'busy') {
            this.drivers = data.filter((d) => !d.driverAvailable);
          } else {
            this.drivers = data;
          }
        },
        error: (err) => console.error('Error loading drivers', err),
      });
    } else if (this.role === 'Driver' && this.driverId != null) {
      this.driverService.getDriverById(this.driverId).subscribe({
        next: (data) => (this.drivers = [data]),
        error: (err) => console.error('Error loading driver', err),
      });
    }
  }

  onSubmit() {
    if (this.driverForm.invalid) return;

    const driver: Driver = this.driverForm.value;

    if (this.editingDriverId) {
      this.driverService.updateDriver(this.editingDriverId, driver).subscribe(() => {
        alert('✅ Driver updated successfully!');
        this.loadDrivers(this.route.snapshot.queryParams['filter']);
        this.driverForm.reset({ driverAvailable: true });
        this.editingDriverId = null;
      });
    } else {
      this.driverService.addDriver(driver).subscribe(() => {
        alert('✅ Driver added successfully!');
        this.loadDrivers(this.route.snapshot.queryParams['filter']);
        this.driverForm.reset({ driverAvailable: true });
      });
    }
  }

  editDriver(driver: Driver) {
    if (!driver.driverAvailable) {
      alert('❌ This driver is currently busy on a trip and cannot be edited.');
      return;
    }

    this.editingDriverId = driver.driverId!;
    this.driverForm.patchValue(driver);
  }

  deleteDriver(driver: Driver) {
    if (!driver.driverAvailable) {
      alert('❌ This driver is currently busy on a trip and cannot be deleted.');
      return;
    }

    if (confirm('Are you sure you want to delete this driver?')) {
      this.driverService.deleteDriver(driver.driverId!).subscribe(() => {
        alert('🗑️ Driver deleted successfully!');
        this.loadDrivers(this.route.snapshot.queryParams['filter']);
      });
    }
  }

  cancelEdit() {
    this.editingDriverId = null;
    this.driverForm.reset({ driverAvailable: true });
  }
}
