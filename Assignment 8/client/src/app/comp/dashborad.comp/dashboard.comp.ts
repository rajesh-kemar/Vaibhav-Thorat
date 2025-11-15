import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { Trip } from '../../models/tripmodel';
import { Vehicle } from '../../models/vehiclemodel';
import { Driver } from '../../models/drivermodels';
import { Authservice, UserRole } from '../../services/authservice';
import { TripService } from '../../services/tripservice';
import { DriverTripSummary } from '../../models/DriverTripSummary';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './dashboard.comp.html',
  styleUrls: ['./dashboard.comp.css']
})
// export class DashboardComponent implements OnInit {
//   activeTrips = 0;
//   completedTrips = 0;
//   totalVehicles = 0;
//   availableVehicles = 0;
//   totalDrivers = 0;
//   availableDrivers = 0;

//   driverName: string = '';
//   role: UserRole | null = null;
//   driverId: number | null = null;

//   driverTotalTrips: number = 0; // new
//   driverTotalHours: number = 0; // new

//   private tripUrl = 'http://localhost:5106/api/trip';
//   private vehicleUrl = 'http://localhost:5106/api/vehicle';
//   private driverUrl = 'http://localhost:5106/api/driver';

//   constructor(
//     private http: HttpClient,
//     private router: Router,
//     private authService: Authservice,
//     private tripService: TripService // injected TripService
//   ) {}

//   ngOnInit(): void {
//     if (!this.authService.isLoggedIn()) {
//       this.router.navigate(['/login']);
//       return;
//     }

//     this.role = this.authService.role();
//     this.driverName = this.authService.driverName() || '';

//     const driverIdStr = localStorage.getItem('driverId');
//     this.driverId = driverIdStr ? +driverIdStr : null;

//     this.loadStats();
//   }

//   private getAuthHeaders(): { headers: HttpHeaders } {
//     const token = this.authService.getToken();
//     return {
//       headers: token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders()
//     };
//   }

//   loadStats(): void {
//     const headers = this.getAuthHeaders();

//     // Dispatcher: get all trips
//     if (this.role === 'Dispatcher') {
//       this.http.get<Trip[]>(this.tripUrl, headers).subscribe({
//         next: trips => {
//           this.activeTrips = trips.filter(t => !t.enddate).length;
//           this.completedTrips = trips.filter(t => !!t.enddate).length;
//         },
//         error: err => console.error('Error loading trips', err)
//       });

//       // Vehicles
//       this.http.get<Vehicle[]>(this.vehicleUrl, headers).subscribe({
//         next: vehicles => {
//           this.totalVehicles = vehicles.length;
//           this.availableVehicles = vehicles.filter(v => v.isAvailable).length;
//         },
//         error: err => console.error('Error loading vehicles', err)
//       });

//       // Drivers
//       this.http.get<Driver[]>(this.driverUrl, headers).subscribe({
//         next: drivers => {
//           this.totalDrivers = drivers.length;
//           this.availableDrivers = drivers.filter(d => d.driverAvailable).length;
//         },
//         error: err => console.error('Error loading drivers', err)
//       });

//     } else if (this.role === 'Driver' && this.driverId != null) {
//       // Driver: call driver-specific trips API
//       const driverTripsUrl = `${this.tripUrl}/driver/${this.driverId}`;
//       this.http.get<Trip[]>(driverTripsUrl, headers).subscribe({
//         next: trips => {
//           this.activeTrips = trips.filter(t => !t.enddate).length;
//           this.completedTrips = trips.filter(t => !!t.enddate).length;
//         },
//         error: err => console.error('Error loading driver trips', err)
//       });

//       // Get driver trip summary
//       this.tripService.getDriverTripSummary(this.driverId).subscribe({
//         next: (summary: DriverTripSummary) => {
//           if (summary) {
//             this.driverTotalTrips = summary.totalTrips;
//             this.driverTotalHours = summary.totalHoursDriven;
//           }
//         },
//         error: err => console.error('Error loading driver summary', err)
//       });
//     }
//   }

//   navigateTo(page: string, filter?: string): void {
//     this.router.navigate([`/${page}`], { queryParams: { filter } });
//   }

//   logout(): void {
//     this.authService.logout();
//     this.router.navigate(['/login']);
//   }
// }
export class DashboardComponent implements OnInit {
  activeTrips = 0;
  completedTrips = 0;
  totalTrips = 0; 
  totalVehicles = 0;
  availableVehicles = 0;
  vehiclesBusyInTrips = 0; 
  totalDrivers = 0;
  availableDrivers = 0;
  driversBusyInTrips = 0; 

  driverName: string = '';
  role: UserRole | null = null;
  driverId: number | null = null;

  driverTotalTrips: number = 0;
  driverTotalHours: number = 0;

  private tripUrl = 'http://localhost:5106/api/trip';
  private vehicleUrl = 'http://localhost:5106/api/vehicle';
  private driverUrl = 'http://localhost:5106/api/driver';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: Authservice,
    private tripService: TripService
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.role = this.authService.role();
    this.driverName = this.authService.driverName() || '';

    const driverIdStr = localStorage.getItem('driverId');
    this.driverId = driverIdStr ? +driverIdStr : null;

    this.loadStats();
  }

  private getAuthHeaders(): { headers: HttpHeaders } {
    const token = this.authService.getToken();
    return {
      headers: token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders()
    };
  }

  loadStats(): void {
    const headers = this.getAuthHeaders();

    if (this.role === 'Dispatcher') {
      // ✅ Trips
      this.http.get<Trip[]>(this.tripUrl, headers).subscribe({
        next: trips => {
          this.activeTrips = trips.filter(t => !t.enddate).length;
          this.completedTrips = trips.filter(t => !!t.enddate).length;
          this.totalTrips = trips.length; // ✅ total trip count
        },
        error: err => console.error('Error loading trips', err)
      });

      // ✅ Vehicles
      this.http.get<Vehicle[]>(this.vehicleUrl, headers).subscribe({
        next: vehicles => {
          this.totalVehicles = vehicles.length;
          this.availableVehicles = vehicles.filter(v => v.isAvailable).length;
          this.vehiclesBusyInTrips = this.totalVehicles - this.availableVehicles; // ✅ busy count
        },
        error: err => console.error('Error loading vehicles', err)
      });

      // ✅ Drivers
      this.http.get<Driver[]>(this.driverUrl, headers).subscribe({
        next: drivers => {
          this.totalDrivers = drivers.length;
          this.availableDrivers = drivers.filter(d => d.driverAvailable).length;
          this.driversBusyInTrips = this.totalDrivers - this.availableDrivers; // ✅ busy count
        },
        error: err => console.error('Error loading drivers', err)
      });

    } else if (this.role === 'Driver' && this.driverId != null) {
      const driverTripsUrl = `${this.tripUrl}/driver/${this.driverId}`;
      this.http.get<Trip[]>(driverTripsUrl, headers).subscribe({
        next: trips => {
          this.activeTrips = trips.filter(t => !t.enddate).length;
          this.completedTrips = trips.filter(t => !!t.enddate).length;
        },
        error: err => console.error('Error loading driver trips', err)
      });

      this.tripService.getDriverTripSummary(this.driverId).subscribe({
        next: (summary: DriverTripSummary) => {
          if (summary) {
            this.driverTotalTrips = summary.totalTrips;
            this.driverTotalHours = summary.totalHoursDriven;
          }
        },
        error: err => console.error('Error loading driver summary', err)
      });
    }
  }

  navigateTo(page: string, filter?: string): void {
    this.router.navigate([`/${page}`], { queryParams: { filter } });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
