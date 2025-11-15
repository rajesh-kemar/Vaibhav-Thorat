import { Routes } from '@angular/router';
import { DashboardComponent } from './comp/dashborad.comp/dashboard.comp';
import { TripComponent } from './comp/trip.comp/trip.comp';
import { VehicleComp } from './comp/vehicle.comp/vehicle.comp';
import { DriverComponent } from './comp/driver.comp/driver.comp';
import { DispatcherGuard } from './gaurds/dispatcherguard';
import { DriverGuard } from './gaurds/driverguard';
import { LoginComp } from './comp/login.comp/login.comp';
import { HomeComponent } from './comp/home/home';
import { DashboardGuard } from './gaurds/dashboardguard';
import { RegistrationComponent } from './comp/registration/registration';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComp },
    { path: 'register', component: RegistrationComponent }, 
  { path: 'dashboard', component: DashboardComponent, canActivate: [DashboardGuard] },
  { path: 'trip', component: TripComponent, canActivate: [DashboardGuard] },
  { path: 'vehicle', component: VehicleComp, canActivate: [DispatcherGuard] },
  { path: 'driver', component: DriverComponent, canActivate: [DispatcherGuard] },
  { path: 'my-trips', component: TripComponent, canActivate: [DriverGuard] }, // optional driver-only route
  { path: '**', redirectTo: '' }
];

