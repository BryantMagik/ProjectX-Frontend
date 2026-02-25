import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

import { TasksDetailsComponent } from './tasks-details.component';
import { TaskService } from '../../../../service/task/task.service';
import { UserService } from '../../../profile/data-access/user.service';

class MockTaskService {
  getTasksPorId() {
    return of(null);
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

describe('TasksDetailsComponent', () => {
  let component: TasksDetailsComponent;
  let fixture: ComponentFixture<TasksDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TasksDetailsComponent],
      providers: [
        { provide: TaskService, useClass: MockTaskService },
        { provide: UserService, useClass: MockUserService },
        { provide: Router, useValue: { navigate: () => Promise.resolve(true) } },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => 'task-id' } } } }
      ]
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
