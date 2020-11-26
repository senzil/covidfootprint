import { TestBed } from '@angular/core/testing';

import { FootprintService } from './footprint.service';

describe('FootprintService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FootprintService = TestBed.get(FootprintService);
    expect(service).toBeTruthy();
  });
});
