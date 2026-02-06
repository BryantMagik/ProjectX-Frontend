import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksFormComponent } from './tasks-form.component';

describe('TasksFormComponent', () => {
  let component: TasksFormComponent;
  let fixture: ComponentFixture<TasksFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TasksFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TasksFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
