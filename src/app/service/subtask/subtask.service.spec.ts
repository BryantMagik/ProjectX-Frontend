import { TestBed } from '@angular/core/testing';

import { SubtaskService } from './subtask.service';

describe('SubtaskService', () => {
  let service: SubtaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubtaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
