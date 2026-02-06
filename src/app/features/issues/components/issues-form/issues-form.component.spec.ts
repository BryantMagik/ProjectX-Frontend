import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuesFormComponent } from './issues-form.component';

describe('IssuesFormComponent', () => {
  let component: IssuesFormComponent;
  let fixture: ComponentFixture<IssuesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IssuesFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IssuesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
