
export interface Vehicle {
  vehicleId?: number;        // optional for new vehicle
  vehicleNumber: string;
  type: string;
  capacity: number;
  isAvailable: boolean;
}
