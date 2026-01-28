import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuesDetailsComponent } from './issues-details.component';

describe('IssuesDetailsComponent', () => {
  let component: IssuesDetailsComponent;
  let fixture: ComponentFixture<IssuesDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IssuesDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IssuesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
