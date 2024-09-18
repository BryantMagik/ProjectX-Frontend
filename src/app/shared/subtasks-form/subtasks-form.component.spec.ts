import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubtasksFormComponent } from './subtasks-form.component';

describe('SubtasksFormComponent', () => {
  let component: SubtasksFormComponent;
  let fixture: ComponentFixture<SubtasksFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubtasksFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubtasksFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
