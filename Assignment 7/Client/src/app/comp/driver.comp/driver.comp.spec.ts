import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DriverComponent } from './driver.comp';

// import { DriverComp } from './driver.comp';

describe('DriverComp', () => {
  let component: DriverComponent;
  let fixture: ComponentFixture<DriverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriverComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
