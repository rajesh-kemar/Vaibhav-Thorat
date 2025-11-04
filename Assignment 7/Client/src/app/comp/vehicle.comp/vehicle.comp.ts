import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Vehicle } from '../../models/vehiclemodel';
import { VehicleService } from '../../services/vehicleservice';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-vehicle',
  imports: [ReactiveFormsModule, CommonModule,RouterModule],
  templateUrl: './vehicle.comp.html',
  styleUrls: ['./vehicle.comp.css'],
})
export class VehicleComp implements OnInit {
  vehicles: Vehicle[] = [];
  vehicleForm: FormGroup;
  submitted = false;
  isEditMode = false;
  currentVehicleId: number | null = null;

  constructor(
    private vehicleService: VehicleService,
    private fb: FormBuilder,
    public route: ActivatedRoute
  ) {
    this.vehicleForm = this.fb.group({
      vehicleNumber: ['', Validators.required],
      type: ['', Validators.required],
      isAvailable: [true]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const filter = params['filter']; // e.g., 'available'
      this.loadVehicles(filter);
    });
  }

  loadVehicles(filter?: string) {
    this.vehicleService.getAllVehicles().subscribe(data => {
      if (filter === 'available') this.vehicles = data.filter(v => v.isAvailable);
      else this.vehicles = data;
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.vehicleForm.invalid) return;

    const vehicleData: Vehicle = this.vehicleForm.value;

    if (this.isEditMode && this.currentVehicleId) {
      this.vehicleService.updateVehicle(this.currentVehicleId, vehicleData).subscribe(() => {
        alert('Vehicle updated successfully!');
        this.resetForm();
        this.loadVehicles();
      });
    } else {
      this.vehicleService.addVehicle(vehicleData).subscribe(() => {
        alert('Vehicle added successfully!');
        this.resetForm();
        this.loadVehicles();
      });
    }
  }

  editVehicle(vehicle: Vehicle) {
    this.isEditMode = true;
    this.currentVehicleId = vehicle.vehicleId!;
    this.vehicleForm.patchValue({
      vehicleNumber: vehicle.vehicleNumber,
      type: vehicle.type,
      isAvailable: vehicle.isAvailable
    });
  }

  deleteVehicle(vehicleId: number) {
    if (confirm('Are you sure you want to delete this vehicle?')) {
      this.vehicleService.deleteVehicle(vehicleId).subscribe(() => {
        alert('Vehicle deleted successfully!');
        this.loadVehicles();
      });
    }
  }

  resetForm() {
    this.vehicleForm.reset({ isAvailable: true });
    this.submitted = false;
    this.isEditMode = false;
    this.currentVehicleId = null;
  }
}
