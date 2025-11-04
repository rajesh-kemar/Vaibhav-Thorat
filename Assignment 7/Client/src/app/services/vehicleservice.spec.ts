import { TestBed } from '@angular/core/testing';

import { Vehicleservice } from './vehicleservice';

describe('Vehicleservice', () => {
  let service: Vehicleservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Vehicleservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
