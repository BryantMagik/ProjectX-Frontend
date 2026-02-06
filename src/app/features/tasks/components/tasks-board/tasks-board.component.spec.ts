import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksBoardComponent } from './tasks-board.component';

describe('TasksBoardComponent', () => {
  let component: TasksBoardComponent;
  let fixture: ComponentFixture<TasksBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TasksBoardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TasksBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
