import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export type UserRole = 'Dispatcher' | 'Driver';

export interface LoginCredentials {
  role: UserRole;
  password: string;
  driverName?: string;      // for Dispatcher
  licenceNumber?: string;   // for Driver
}

export interface RegisterCredentials {
  driverName: string;
  licenceNumber: string;
}

export interface AuthResponse {
  token: string;
  driverId?: number | null;
  role: UserRole;
  driverName?: string;
  licenceNumber?: string;
}

@Injectable({ providedIn: 'root' })
export class Authservice {
  private apiUrl = 'http://localhost:5106/api/auth';
  public roleSignal = signal<UserRole | null>(null);

  constructor(private http: HttpClient) {
    if (this.isBrowser()) {
      const savedRole = localStorage.getItem('role') as UserRole | null;
      if (savedRole) this.roleSignal.set(savedRole);
    }
  }

  // -----------------------------
  // LOGIN
  // -----------------------------
  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => this.storeAuthResponse(res))
    );
  }

  // -----------------------------
  // REGISTER DRIVER
  // -----------------------------
  register(credentials: RegisterCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, credentials).pipe(
      tap(res => this.storeAuthResponse(res))
    );
  }

  // -----------------------------
  // LOGOUT
  // -----------------------------
  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem('jwt');
      localStorage.removeItem('driverId');
      localStorage.removeItem('driverName');
      localStorage.removeItem('role');
    }
    this.roleSignal.set(null);
  }

  // -----------------------------
  // PRIVATE: SAVE AUTH DATA
  // -----------------------------
  private storeAuthResponse(res: AuthResponse): void {
    if (this.isBrowser()) {
      if (res.token) localStorage.setItem('jwt', res.token);
      if (res.role) localStorage.setItem('role', res.role);
      if (res.driverId != null) localStorage.setItem('driverId', res.driverId.toString());
      if (res.driverName) localStorage.setItem('driverName', res.driverName);
    }
    this.roleSignal.set(res.role);
  }

  // -----------------------------
  // HELPERS
  // -----------------------------
  getToken(): string | null {
    return this.isBrowser() ? localStorage.getItem('jwt') : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  role(): UserRole | null {
    const current = this.roleSignal();
    if (current) return current;

    if (this.isBrowser()) {
      return localStorage.getItem('role') as UserRole | null;
    }

    return null;
  }

  driverId(): number | null {
    if (!this.isBrowser()) return null;
    const val = localStorage.getItem('driverId');
    return val ? Number(val) : null;
  }

  driverName(): string | null {
    return this.isBrowser() ? localStorage.getItem('driverName') : null;
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }
}
