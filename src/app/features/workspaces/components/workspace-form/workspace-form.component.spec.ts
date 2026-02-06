import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspaceFormComponent } from './workspace-form.component';

describe('WorkspaceFormComponent', () => {
  let component: WorkspaceFormComponent;
  let fixture: ComponentFixture<WorkspaceFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkspaceFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkspaceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
