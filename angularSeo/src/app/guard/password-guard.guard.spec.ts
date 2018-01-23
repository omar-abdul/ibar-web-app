import { TestBed, async, inject } from '@angular/core/testing';

import { PasswordGuardGuard } from './password-guard.guard';

describe('PasswordGuardGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PasswordGuardGuard]
    });
  });

  it('should ...', inject([PasswordGuardGuard], (guard: PasswordGuardGuard) => {
    expect(guard).toBeTruthy();
  }));
});
