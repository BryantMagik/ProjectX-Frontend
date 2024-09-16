import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubtasksDetailsComponent } from './subtasks-details.component';

describe('SubtasksDetailsComponent', () => {
  let component: SubtasksDetailsComponent;
  let fixture: ComponentFixture<SubtasksDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubtasksDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubtasksDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
