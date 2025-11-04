import { TestBed } from '@angular/core/testing';

import { Driverservice } from './driverservice';

describe('Driverservice', () => {
  let service: Driverservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Driverservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
