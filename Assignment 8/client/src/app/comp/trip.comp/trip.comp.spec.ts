import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripComp } from './trip.comp';

describe('TripComp', () => {
  let component: TripComp;
  let fixture: ComponentFixture<TripComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripComp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
