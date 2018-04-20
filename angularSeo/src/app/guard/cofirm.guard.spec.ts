import { TestBed, async, inject } from '@angular/core/testing';

import { CofirmGuard } from './cofirm.guard';

describe('CofirmGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CofirmGuard]
    });
  });

  it('should ...', inject([CofirmGuard], (guard: CofirmGuard) => {
    expect(guard).toBeTruthy();
  }));
});
