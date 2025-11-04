// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { Vehicle } from '../models/vehiclemodel';


// @Injectable({
//   providedIn: 'root'
// })
// export class VehicleService {
//   private baseUrl = 'http://localhost:5106/api/vehicles'; // replace with your backend URL

//   constructor(private http: HttpClient) { }

//   getVehicles(): Observable<Vehicle[]> {
//     return this.http.get<Vehicle[]>(this.baseUrl);
//   }

//   addVehicle(vehicle: Vehicle): Observable<Vehicle> {
//     return this.http.post<Vehicle>(this.baseUrl, vehicle);
//   }

//   updateVehicle(vehicleId: number, vehicle: Vehicle): Observable<Vehicle> {
//     return this.http.put<Vehicle>(`${this.baseUrl}/${vehicleId}`, vehicle);
//   }

//   deleteVehicle(vehicleId: number): Observable<any> {
//     return this.http.delete(`${this.baseUrl}/${vehicleId}`);
//   }
// }

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vehicle } from '../models/vehiclemodel';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private baseUrl = 'http://localhost:5106/api/vehicle'; // matches your controller route

  constructor(private http: HttpClient) { }

  // Get all vehicles
  getAllVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(this.baseUrl);
  }

  // Get all available vehicles
  getAvailableVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${this.baseUrl}/available`);
  }

  // Get vehicle by ID
  getVehicleById(vehicleId: number): Observable<Vehicle> {
    return this.http.get<Vehicle>(`${this.baseUrl}/${vehicleId}`);
  }

  // Add a new vehicle
  addVehicle(vehicle: Vehicle): Observable<Vehicle> {
    return this.http.post<Vehicle>(this.baseUrl, vehicle);
  }

  // Update an existing vehicle
  updateVehicle(vehicleId: number, vehicle: Vehicle): Observable<any> {
    return this.http.put(`${this.baseUrl}/${vehicleId}`, vehicle);
  }

  // Delete a vehicle
  deleteVehicle(vehicleId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${vehicleId}`);
  }
}
