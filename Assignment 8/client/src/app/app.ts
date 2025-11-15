import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Authservice, UserRole } from './services/authservice';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  userName: string | null = null;

  constructor(private router: Router, private authService: Authservice) {}

  ngOnInit(): void {
    this.userName = this.authService.driverName(); // Fetch logged-in name
  }

  goHome() {
    this.router.navigate(['/']);
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  role(): UserRole | null {
    return this.authService.role();
  }

  goLogin() {
    this.router.navigate(['/login']);
  }

  goRegister() {
    this.router.navigate(['/register']); 
  }

  logout() {
    this.authService.logout();
    this.userName = null;
    this.router.navigate(['/login']);
  }
}
