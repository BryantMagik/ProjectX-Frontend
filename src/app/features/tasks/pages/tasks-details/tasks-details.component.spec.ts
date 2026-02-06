import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksDetailsComponent } from './tasks-details.component';

describe('TasksDetailsComponent', () => {
  let component: TasksDetailsComponent;
  let fixture: ComponentFixture<TasksDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TasksDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TasksDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
