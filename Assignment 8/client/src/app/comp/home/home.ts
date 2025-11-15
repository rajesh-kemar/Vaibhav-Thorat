import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Authservice } from '../../services/authservice';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {
  driverName: string | null = '';
  role: string | null = '';

  constructor(private auth: Authservice, private router: Router) {}

  ngOnInit(): void {
    if (typeof localStorage !== 'undefined') {
      this.driverName = localStorage.getItem('driverName');
      this.role = localStorage.getItem('role');
    }
  }

  goToTrips() {
    this.router.navigate(['/trip']);
  }

  goToVehicles() {
    this.router.navigate(['/vehicle']);
  }

  goToDrivers() {
    this.router.navigate(['/driver']);
  }
}
