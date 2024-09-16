import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubtasksComponent } from './subtasks.component';

describe('SubtasksComponent', () => {
  let component: SubtasksComponent;
  let fixture: ComponentFixture<SubtasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubtasksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubtasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
