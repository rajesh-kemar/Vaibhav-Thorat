import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Trip } from '../../models/tripmodel';
import { Vehicle } from '../../models/vehiclemodel';
import { TripService } from '../../services/tripservice';
import { DriverService } from '../../services/driverservice';
import { VehicleService } from '../../services/vehicleservice';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Driver } from '../../models/drivermodels';

@Component({
  selector: 'app-trip',
  imports: [CommonModule, ReactiveFormsModule,RouterModule],
  templateUrl: './trip.comp.html',
  styleUrls: ['./trip.comp.css'],
})
export class TripComponent implements OnInit {
  trips: Trip[] = [];
  drivers: Driver[] = [];
  vehicles: Vehicle[] = [];
  availableDrivers: Driver[] = [];
  availableVehicles: Vehicle[] = [];

  tripForm: FormGroup;
  editingTripId: number | null = null;

  constructor(
    private tripService: TripService,
    private driverService: DriverService,
    private vehicleService: VehicleService,
    private fb: FormBuilder,
    public route: ActivatedRoute
  ) {
    this.tripForm = this.fb.group({
      driverId: [null, Validators.required],
      vehicleId: [null, Validators.required],
      vehicleNumber: [''],
      source: ['', Validators.required],
      destination: ['', Validators.required],
      startdate: ['', Validators.required],
      enddate: [''],
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const filter = params['filter']; // 'active' or 'completed'
      this.loadTrips(filter);
    });

    this.loadDrivers();
    this.loadVehicles();

    this.tripForm.get('vehicleId')?.valueChanges.subscribe(vehicleId => {
      const vehicle = this.vehicles.find(v => v.vehicleId === vehicleId);
      this.tripForm.patchValue({ vehicleNumber: vehicle?.vehicleNumber || '' });
    });
  }

  loadTrips(filter?: string) {
    this.tripService.getAllTrips().subscribe(data => {
      if (filter === 'active') this.trips = data.filter(t => !t.enddate);
      else if (filter === 'completed') this.trips = data.filter(t => !!t.enddate);
      else this.trips = data;
    });
  }

  loadDrivers() {
    this.driverService.getAllDrivers().subscribe(data => {
      this.drivers = data;
      this.updateAvailableDrivers();
    });
  }

  loadVehicles() {
    this.vehicleService.getAllVehicles().subscribe(data => {
      this.vehicles = data;
      this.updateAvailableVehicles();
    });
  }

  updateAvailableDrivers() {
    this.availableDrivers = this.drivers.filter(d => d.driverAvailable);
  }

  updateAvailableVehicles() {
    this.availableVehicles = this.vehicles.filter(v => v.isAvailable);
  }

  onSubmit() {
    if (this.tripForm.invalid) return;

    const trip: Trip = this.tripForm.value;

    if (this.editingTripId) {
      this.tripService.updateTrip(this.editingTripId, trip).subscribe(() => {
        this.loadTrips();
        this.cancelEdit();
      });
    } else {
      this.tripService.addTrip(trip).subscribe(() => {
        this.loadTrips();
        this.tripForm.reset();
      });
    }
  }

  editTrip(trip: Trip) {
    if (trip.status === 'completed') {
    alert('Completed trips cannot be edited.');
    return;
    }

    this.editingTripId = trip.tripId!;
    this.tripForm.patchValue(trip);

    this.updateAvailableDrivers();
    if (trip.driver) this.availableDrivers = [...this.availableDrivers, trip.driver];

    this.updateAvailableVehicles();
    if (trip.vehicle) this.availableVehicles = [...this.availableVehicles, trip.vehicle];
  }

  completeTrip(trip: Trip) {
    this.tripService.completeTrip(trip.tripId!).subscribe(() => this.loadTrips());
  }

  deleteTrip(id: number) {
    if (confirm('Are you sure to delete this trip?')) {
      this.tripService.deleteTrip(id).subscribe(() => this.loadTrips());
    }
  }

  cancelEdit() {
    this.editingTripId = null;
    this.tripForm.reset();
    this.updateAvailableDrivers();
    this.updateAvailableVehicles();
  }
}
