import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Trip } from '../../models/tripmodel';
import { Vehicle } from '../../models/vehiclemodel';
import { Driver } from '../../models/drivermodels';
import { TripService } from '../../services/tripservice';
import { DriverService } from '../../services/driverservice';
import { VehicleService } from '../../services/vehicleservice';
import { Authservice } from '../../services/authservice';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-trip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './trip.comp.html',
  styleUrls: ['./trip.comp.css'],
})
export class TripComponent implements OnInit {
  trips: Trip[] = [];
  filteredTrips: Trip[] = [];
  drivers: Driver[] = [];
  vehicles: Vehicle[] = [];
  availableDrivers: Driver[] = [];
  availableVehicles: Vehicle[] = [];

  tripForm: FormGroup;
  editingTripId: number | null = null;
  role: string | null = null;
  driverId: number | null = null;

  constructor(
    private tripService: TripService,
    private driverService: DriverService,
    private vehicleService: VehicleService,
    private fb: FormBuilder,
    private auth: Authservice,
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
    this.role = this.auth.role();

    if (this.role === 'Driver') {
      const storedId = localStorage.getItem('driverId');
      this.driverId = storedId ? Number(storedId) : null;
    }

    this.route.queryParams.subscribe(params => {
      const filter = params['filter'];
      this.loadTrips(filter);
    });

    if (this.role === 'Dispatcher') {
      this.loadDrivers();
      this.loadVehicles();
    }
  }

  loadTrips(filter?: string) {
    if (this.role === 'Driver' && this.driverId) {
      this.tripService.getTripsByDriver(this.driverId).subscribe({
        next: data => {
          this.trips = data;
          this.applyFilter(filter);
        },
        error: err => console.error('Error loading driver trips', err)
      });
    } else {
      this.tripService.getAllTrips().subscribe({
        next: data => {
          this.trips = data;
          this.applyFilter(filter);
        },
        error: err => console.error('Error loading trips', err)
      });
    }
  }

  applyFilter(filter?: string) {
    if (filter === 'active') this.filteredTrips = this.trips.filter(t => t.status === 'InProgress');
    else if (filter === 'completed') this.filteredTrips = this.trips.filter(t => t.status === 'completed');
    else this.filteredTrips = [...this.trips];
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

  // ✅ Triggered when vehicle selection changes
  onVehicleChange(event: Event): void {
    const selectedVehicleId = Number((event.target as HTMLSelectElement).value);
    const selectedVehicle = this.availableVehicles.find(v => v.vehicleId === selectedVehicleId);
    if (selectedVehicle) {
      this.tripForm.patchValue({
        vehicleNumber: selectedVehicle.vehicleNumber
      });
    } else {
      this.tripForm.patchValue({ vehicleNumber: '' });
    }
  }

  onSubmit() {
    if (this.role === 'Driver') return;
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
    if (this.role === 'Driver') return;
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
    if (trip.status === 'completed') {
      alert('Trip is already completed.');
      return;
    }

    if (this.role === 'Driver' && trip.driverId !== this.driverId) {
      alert('You can only complete your own trip.');
      return;
    }

    if (confirm('Mark this trip as completed?')) {
      this.tripService.completeTrip(trip.tripId!).subscribe({
        next: () => this.loadTrips(),
        error: err => console.error('Error completing trip', err)
      });
    }
  }

  deleteTrip(id: number) {
    if (this.role === 'Driver') return;
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
  showForm = false; // controls modal visibility

openAddTripForm() {
  this.editingTripId = null;
  this.tripForm.reset();
  this.showForm = true;
}

openEditForm(trip: Trip) {
  if (trip.status === 'completed') {
    alert('Completed trips cannot be edited.');
    return;
  }
  this.editingTripId = trip.tripId!;
  this.tripForm.patchValue(trip);
  this.showForm = true;
}

closeForm(event?: Event) {
  if (event) event.stopPropagation();
  this.showForm = false;
  this.tripForm.reset();
  this.editingTripId = null;
}

}
