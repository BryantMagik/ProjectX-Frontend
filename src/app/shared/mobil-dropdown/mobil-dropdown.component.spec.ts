import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobilDropdownComponent } from './mobil-dropdown.component';

describe('MobilDropdownComponent', () => {
  let component: MobilDropdownComponent;
  let fixture: ComponentFixture<MobilDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobilDropdownComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobilDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
