import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Driver } from '../models/drivermodels';
import { Authservice } from './authservice';

@Injectable({
  providedIn: 'root'
})
export class DriverService {
  private apiUrl = 'http://localhost:5106/api/driver';

  constructor(private http: HttpClient, private authService: Authservice) {}

  private getAuthHeaders(): { headers: HttpHeaders } {
    const token = this.authService.getToken();
    return {
      headers: token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders()
    };
  }

  // Get all drivers
  getAllDrivers(): Observable<Driver[]> {
    return this.http.get<Driver[]>(this.apiUrl, this.getAuthHeaders());
  }

  // Get a driver by ID
  getDriverById(id: number): Observable<Driver> {
    return this.http.get<Driver>(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }

  // Add a new driver
  addDriver(driver: Driver): Observable<Driver> {
    return this.http.post<Driver>(this.apiUrl, driver, this.getAuthHeaders());
  }

  // Update an existing driver
  updateDriver(id: number, driver: Driver): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, driver, this.getAuthHeaders());
  }

  // Delete a driver
  deleteDriver(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }
}
