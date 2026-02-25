import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Router } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { UserService } from '../../features/profile/data-access/user.service';
import { NotificationService } from '../../core/services/notification.service';

class MockUserService {
  loadUserProfile() {
    return of(null);
  }
}

class MockNotificationService {
  notifications$ = of([]);
  loading$ = of(false);
  error$ = of(null);
  start(): void {}
  stop(): void {}
  markAsRead(): void {}
  markAllAsRead(): void {}
}

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutComponent],
      providers: [
        { provide: UserService, useClass: MockUserService },
        { provide: NotificationService, useClass: MockNotificationService },
        { provide: Router, useValue: { navigate: () => Promise.resolve(true) } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
