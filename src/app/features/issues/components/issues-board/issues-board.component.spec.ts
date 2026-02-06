import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuesBoardComponent } from './issues-board.component';

describe('IssuesBoardComponent', () => {
  let component: IssuesBoardComponent;
  let fixture: ComponentFixture<IssuesBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IssuesBoardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IssuesBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
