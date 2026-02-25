import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Router } from '@angular/router';

import { NavbarComponent } from './navbar.component';
import { NotificationService } from '../../../../core/services/notification.service';

class MockNotificationService {
  notifications$ = of([]);
  loading$ = of(false);
  error$ = of(null);
  start(): void {}
  stop(): void {}
  markAsRead(): void {}
  markAllAsRead(): void {}
}

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        { provide: NotificationService, useClass: MockNotificationService },
        { provide: Router, useValue: { navigate: () => Promise.resolve(true) } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
