
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trip } from '../models/tripmodel';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  private apiUrl = 'http://localhost:5106/api/trip'; // Matches the controller route

  constructor(private http: HttpClient) {}

  // Get all trips
  getAllTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(this.apiUrl);
  }

  // Get trip by ID
  getTripById(id: number): Observable<Trip> {
    return this.http.get<Trip>(`${this.apiUrl}/${id}`);
  }

  // Get trips by driver
  getTripsByDriver(driverId: number): Observable<Trip[]> {
    return this.http.get<Trip[]>(`${this.apiUrl}/driver/${driverId}`);
  }

  // Add a new trip
  addTrip(trip: Trip): Observable<Trip> {
    return this.http.post<Trip>(this.apiUrl, trip);
  }

  // Update existing trip
  updateTrip(id: number, trip: Trip): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, trip);
  }

  // Complete a trip
  completeTrip(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/complete/${id}`, {});
  }

  // Delete a trip
  deleteTrip(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
