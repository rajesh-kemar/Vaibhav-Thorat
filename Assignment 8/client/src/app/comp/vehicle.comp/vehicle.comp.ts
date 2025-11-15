import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Vehicle } from '../../models/vehiclemodel';
import { VehicleService } from '../../services/vehicleservice';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-vehicle',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
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
      capacity: ['', [Validators.required, Validators.min(1)]],
      isAvailable: [true],
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const filter = params['filter'];
      this.loadVehicles(filter);
    });
  }

  loadVehicles(filter?: string) {
    this.vehicleService.getAllVehicles().subscribe({
      next: (data) => {
        if (filter === 'available') {
          this.vehicles = data.filter((v) => v.isAvailable);
        } else if (filter === 'unavailable') {
          this.vehicles = data.filter((v) => !v.isAvailable);
        } else {
          this.vehicles = data;
        }
      },
      error: (err) => console.error('Error loading vehicles', err),
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.vehicleForm.invalid) return;

    const vehicleData: Vehicle = this.vehicleForm.value;

    if (this.isEditMode && this.currentVehicleId) {
      this.vehicleService.updateVehicle(this.currentVehicleId, vehicleData).subscribe({
        next: () => {
          alert('✅ Vehicle updated successfully!');
          this.resetForm();
          this.loadVehicles(this.route.snapshot.queryParams['filter']);
        },
        error: (err) => console.error('Error updating vehicle', err),
      });
    } else {
      this.vehicleService.addVehicle(vehicleData).subscribe({
        next: () => {
          alert('✅ Vehicle added successfully!');
          this.resetForm();
          this.loadVehicles(this.route.snapshot.queryParams['filter']);
        },
        error: (err) => console.error('Error adding vehicle', err),
      });
    }
  }

  editVehicle(vehicle: Vehicle) {
    if (!vehicle.isAvailable) {
      alert('❌ This vehicle is currently busy and cannot be edited.');
      return;
    }
    this.isEditMode = true;
    this.currentVehicleId = vehicle.vehicleId!;
    this.vehicleForm.patchValue({
      vehicleNumber: vehicle.vehicleNumber,
      type: vehicle.type,
      capacity: vehicle.capacity,
      isAvailable: vehicle.isAvailable,
    });
  }

  deleteVehicle(vehicle: Vehicle) {
    if (!vehicle.vehicleId) return;

    if (!vehicle.isAvailable) {
      alert('❌ This vehicle is currently busy and cannot be deleted.');
      return;
    }

    if (confirm('Are you sure you want to delete this vehicle?')) {
      this.vehicleService.deleteVehicle(vehicle.vehicleId).subscribe({
        next: () => {
          alert('🗑️ Vehicle deleted successfully!');
          this.loadVehicles(this.route.snapshot.queryParams['filter']);
        },
        error: (err) => {
          console.error('Error deleting vehicle', err);
          alert('❌ Failed to delete vehicle. Please check console for details.');
        },
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
  