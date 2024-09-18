import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuesdetailsComponent } from './issuesdetails.component';

describe('IssuesdetailsComponent', () => {
  let component: IssuesdetailsComponent;
  let fixture: ComponentFixture<IssuesdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IssuesdetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IssuesdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
