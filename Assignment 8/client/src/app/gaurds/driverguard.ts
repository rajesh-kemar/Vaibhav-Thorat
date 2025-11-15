import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Authservice } from '../services/authservice';

@Injectable({ providedIn: 'root' })
export class DriverGuard implements CanActivate {
  constructor(private auth: Authservice) {}
  canActivate(): boolean {
    return this.auth.role() === 'Driver';
  }
}
