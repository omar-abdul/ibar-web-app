import { TestBed, inject } from '@angular/core/testing';

import { MentorService } from './mentor-service.service';

describe('MentorServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MentorService]
    });
  });

  it('should be created', inject([MentorService], (service: MentorService) => {
    expect(service).toBeTruthy();
  }));
});
