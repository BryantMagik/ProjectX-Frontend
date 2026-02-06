import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskDropdownOptionsComponent } from './task-dropdown-options.component';

describe('TaskDropdownOptionsComponent', () => {
  let component: TaskDropdownOptionsComponent;
  let fixture: ComponentFixture<TaskDropdownOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskDropdownOptionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskDropdownOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
