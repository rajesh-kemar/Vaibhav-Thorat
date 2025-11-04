import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Driver } from '../models/drivermodels';


@Injectable({
  providedIn: 'root'
})
export class DriverService {
  private apiUrl = 'http://localhost:5106/api/driver'; // matches your controller route

  constructor(private http: HttpClient) {}

  // Get all drivers
  getAllDrivers(): Observable<Driver[]> {
    return this.http.get<Driver[]>(this.apiUrl);
  }

  // Get a driver by ID
  getDriverById(id: number): Observable<Driver> {
    return this.http.get<Driver>(`${this.apiUrl}/${id}`);
  }

  // Add a new driver
  addDriver(driver: Driver): Observable<Driver> {
    return this.http.post<Driver>(this.apiUrl, driver);
  }

  // Update an existing driver
  updateDriver(id: number, driver: Driver): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, driver);
  }

  // Delete a driver
  deleteDriver(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
