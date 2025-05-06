import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCreateTaskComponent } from './modal-create-task.component';

describe('ModalCreateTaskComponent', () => {
  let component: ModalCreateTaskComponent;
  let fixture: ComponentFixture<ModalCreateTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCreateTaskComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalCreateTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
