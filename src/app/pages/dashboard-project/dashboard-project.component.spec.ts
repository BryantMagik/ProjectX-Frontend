import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardProjectComponent } from './dashboard-project.component';

describe('DashboardProjectComponent', () => {
  let component: DashboardProjectComponent;
  let fixture: ComponentFixture<DashboardProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardProjectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
