import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Authservice } from '../services/authservice';

@Injectable({ providedIn: 'root' })
export class DashboardGuard implements CanActivate {
  constructor(private auth: Authservice, private router: Router) {}

  canActivate(): boolean {
    const role = this.auth.role();
    if (this.auth.isLoggedIn() && (role === 'Driver' || role === 'Dispatcher')) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
