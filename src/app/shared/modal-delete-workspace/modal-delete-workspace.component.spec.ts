import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDeleteWorkspaceComponent } from './modal-delete-workspace.component';

describe('ModalDeleteWorkspaceComponent', () => {
  let component: ModalDeleteWorkspaceComponent;
  let fixture: ComponentFixture<ModalDeleteWorkspaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalDeleteWorkspaceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalDeleteWorkspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
