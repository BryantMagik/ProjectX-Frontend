import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubtasksBoardComponent } from './subtasks-board.component';

describe('SubtasksBoardComponent', () => {
  let component: SubtasksBoardComponent;
  let fixture: ComponentFixture<SubtasksBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubtasksBoardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubtasksBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
