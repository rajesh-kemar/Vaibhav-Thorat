import { TestBed } from '@angular/core/testing';

import { Tripservice } from './tripservice';

describe('Tripservice', () => {
  let service: Tripservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Tripservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
