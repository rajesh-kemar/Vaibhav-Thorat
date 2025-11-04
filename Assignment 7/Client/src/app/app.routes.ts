import { Routes } from '@angular/router';
import {  TripComponent } from './comp/trip.comp/trip.comp';
import { DashboardComponent } from './comp/dashborad.comp/dashboard.comp';
import { VehicleComp } from './comp/vehicle.comp/vehicle.comp';
import { DriverComponent } from './comp/driver.comp/driver.comp';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'trip', component:TripComponent  },
  { path: 'vehicle', component: VehicleComp },
  {path:'driver', component:DriverComponent},
  {path: '', redirectTo:'', pathMatch:"full"}
];
