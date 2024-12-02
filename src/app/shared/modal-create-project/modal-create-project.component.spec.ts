import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCreateProjectComponent } from './modal-create-project.component';

describe('ModalCreateProjectComponent', () => {
  let component: ModalCreateProjectComponent;
  let fixture: ComponentFixture<ModalCreateProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCreateProjectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalCreateProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
