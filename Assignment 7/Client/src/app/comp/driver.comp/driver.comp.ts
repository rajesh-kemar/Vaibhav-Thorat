import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DriverService } from '../../services/driverservice';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Driver } from '../../models/drivermodels';

@Component({
  selector: 'app-driver',
  imports: [ReactiveFormsModule, CommonModule,RouterModule],
  templateUrl: './driver.comp.html',
  styleUrls: ['./driver.comp.css'],
})
export class DriverComponent implements OnInit {
  drivers: Driver[] = [];
  driverForm: FormGroup;
  editingDriverId: number | null = null;

  constructor(
    private driverService: DriverService,
    private fb: FormBuilder,
    public route: ActivatedRoute
  ) {
    this.driverForm = this.fb.group({
      driverName: ['', Validators.required],
      licenceNumber: ['', Validators.required],
      experienceYears: [0, [Validators.required, Validators.min(0)]],
      driverAvailable: [true]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const filter = params['filter']; // e.g., 'available'
      this.loadDrivers(filter);
    });
  }

  loadDrivers(filter?: string) {
    this.driverService.getAllDrivers().subscribe(data => {
      if (filter === 'available') this.drivers = data.filter(d => d.driverAvailable);
      else this.drivers = data;
    });
  }

  onSubmit() {
    if (this.driverForm.invalid) return;

    const driver: Driver = this.driverForm.value;

    if (this.editingDriverId) {
      this.driverService.updateDriver(this.editingDriverId, driver).subscribe(() => {
        this.loadDrivers();
        this.driverForm.reset({ driverAvailable: true });
        this.editingDriverId = null;
      });
    } else {
      this.driverService.addDriver(driver).subscribe(() => {
        this.loadDrivers();
        this.driverForm.reset({ driverAvailable: true });
      });
    }
  }

  editDriver(driver: Driver) {
    this.editingDriverId = driver.driverId!;
    this.driverForm.patchValue(driver);
  }

  deleteDriver(id: number) {
    if (confirm('Are you sure you want to delete this driver?')) {
      this.driverService.deleteDriver(id).subscribe(() => this.loadDrivers());
    }
  }

  cancelEdit() {
    this.editingDriverId = null;
    this.driverForm.reset({ driverAvailable: true });
  }
}
