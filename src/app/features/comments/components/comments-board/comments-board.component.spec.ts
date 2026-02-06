import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentsBoardComponent } from './comments-board.component';

describe('CommentsBoardComponent', () => {
  let component: CommentsBoardComponent;
  let fixture: ComponentFixture<CommentsBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentsBoardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentsBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});