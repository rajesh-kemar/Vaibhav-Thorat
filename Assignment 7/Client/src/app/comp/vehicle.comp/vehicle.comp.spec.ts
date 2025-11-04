import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleComp } from './vehicle.comp';

describe('VehicleComp', () => {
  let component: VehicleComp;
  let fixture: ComponentFixture<VehicleComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleComp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
