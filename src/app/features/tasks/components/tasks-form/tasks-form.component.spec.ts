import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { TasksFormComponent } from './tasks-form.component';
import { TaskService } from '../../../../service/task/task.service';
import { UserService } from '../../../profile/data-access/user.service';

class MockTaskService {
  getTasksById() {
    return of(null);
  }
  createTask() {
    return of({});
  }
  actuaTask() {
    return of({});
  }
}

class MockUserService {
  getAllUsers() {
    return of([]);
  }
}

describe('TasksFormComponent', () => {
  let component: TasksFormComponent;
  let fixture: ComponentFixture<TasksFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TasksFormComponent],
      providers: [
        { provide: TaskService, useClass: MockTaskService },
        { provide: UserService, useClass: MockUserService },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null } }, queryParams: of({}) } },
        { provide: Location, useValue: { back: () => {} } }
      ]
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
