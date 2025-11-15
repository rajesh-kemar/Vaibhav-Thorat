
import { Driver } from "./drivermodels";
import { Vehicle } from "./vehiclemodel";


export interface Trip {
  tripId?: number;
  driverId: number;
  vehicleId: number;
  vehicleNumber: string;
  source: string;
  destination: string;
  startdate: string;  // ISO string
  enddate?: string;   // optional
  status?: string;    // InProgress / completed
  driver?: Driver;
  vehicle?: Vehicle;
}
