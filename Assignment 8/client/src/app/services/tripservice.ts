import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trip } from '../models/tripmodel';
import { Authservice } from './authservice';
import { DriverTripSummary } from '../models/DriverTripSummary';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  private apiUrl = 'http://localhost:5106/api/trip';

  constructor(private http: HttpClient, private auth: Authservice) {}

  // Helper to get headers with JWT
  private getAuthHeaders(): HttpHeaders {
    const token = this.auth.getToken(); // make sure token is stored on login
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }

  // Get all trips
  getAllTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  // Get trip by ID
  getTripById(id: number): Observable<Trip> {
    return this.http.get<Trip>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  // Get trips by driver
  getTripsByDriver(driverId: number): Observable<Trip[]> {
    return this.http.get<Trip[]>(`${this.apiUrl}/driver/${driverId}`, { headers: this.getAuthHeaders() });
  }

  // Add a new trip
  addTrip(trip: Trip): Observable<Trip> {
    return this.http.post<Trip>(this.apiUrl, trip, { headers: this.getAuthHeaders() });
  }

  // Update existing trip
  updateTrip(id: number, trip: Trip): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, trip, { headers: this.getAuthHeaders() });
  }

  // Complete a trip
  completeTrip(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/complete/${id}`, {}, { headers: this.getAuthHeaders() });
  }

  // Delete a trip
  deleteTrip(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  // Get driver trip summary
  getDriverTripSummary(driverId: number): Observable<DriverTripSummary> {
  return this.http.get<DriverTripSummary>(
    `${this.apiUrl}/driver/${driverId}/summary`,
    { headers: this.getAuthHeaders() }
  );
}

}
