import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { Trip } from '../../models/tripmodel';
import { Vehicle } from '../../models/vehiclemodel';
import { Driver } from '../../models/drivermodels';



@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './dashboard.comp.html',
  styleUrls: ['./dashboard.comp.css']
})
export class DashboardComponent implements OnInit {

  activeTrips = 0;
  completedTrips = 0;
  totalVehicles = 0;
  availableVehicles = 0;
  totalDrivers = 0;
  availableDrivers = 0;

  private tripUrl = 'http://localhost:5106/api/trip';
  private vehicleUrl = 'http://localhost:5106/api/vehicle';
  private driverUrl = 'http://localhost:5106/api/driver';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    // Trips
    this.http.get<Trip[]>(this.tripUrl).subscribe({
      next: (trips) => {
        this.activeTrips = trips.filter(t => !t.enddate).length;
        this.completedTrips = trips.filter(t => !!t.enddate).length;
      },
      error: (err) => console.error('Error loading trips', err)
    });

    // Vehicles
    this.http.get<Vehicle[]>(this.vehicleUrl).subscribe({
      next: (vehicles) => {
        this.totalVehicles = vehicles.length;
        this.availableVehicles = vehicles.filter(v => v.isAvailable).length;
      },
      error: (err) => console.error('Error loading vehicles', err)
    });

    // Drivers
    this.http.get<Driver[]>(this.driverUrl).subscribe({
      next: (drivers) => {
        this.totalDrivers = drivers.length;
        this.availableDrivers = drivers.filter(d => d.driverAvailable).length;
      },
      error: (err) => console.error('Error loading drivers', err)
    });
  }

  // Navigate with optional filter
    navigateTo(page: string, filter?: string): void {
    this.router.navigate([`/${page}`], { queryParams: { filter } });
  }
}
