import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vehicle } from '../models/vehiclemodel';
import { Authservice } from './authservice';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private baseUrl = 'http://localhost:5106/api/vehicle'; // matches your controller route

  constructor(private http: HttpClient, private authService: Authservice) { }

  private getAuthHeaders(): { headers: HttpHeaders } {
    const token = this.authService.getToken();
    return {
      headers: token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders()
    };
  }

  // Get all vehicles
  getAllVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(this.baseUrl, this.getAuthHeaders());
  }

  // Get all available vehicles
  getAvailableVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${this.baseUrl}/available`, this.getAuthHeaders());
  }

  // Get vehicle by ID
  getVehicleById(vehicleId: number): Observable<Vehicle> {
    return this.http.get<Vehicle>(`${this.baseUrl}/${vehicleId}`, this.getAuthHeaders());
  }

  // Add a new vehicle
  addVehicle(vehicle: Vehicle): Observable<Vehicle> {
    return this.http.post<Vehicle>(this.baseUrl, vehicle, this.getAuthHeaders());
  }

  // Update an existing vehicle
  updateVehicle(vehicleId: number, vehicle: Vehicle): Observable<any> {
    return this.http.put(`${this.baseUrl}/${vehicleId}`, vehicle, this.getAuthHeaders());
  }

  // Delete a vehicle
  deleteVehicle(vehicleId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${vehicleId}`, this.getAuthHeaders());
  }
}
