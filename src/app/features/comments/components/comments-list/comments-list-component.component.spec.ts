import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentsListComponentComponent } from './comments-list-component.component';

describe('CommentsListComponentComponent', () => {
  let component: CommentsListComponentComponent;
  let fixture: ComponentFixture<CommentsListComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentsListComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentsListComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
