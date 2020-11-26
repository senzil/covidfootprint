import { TestBed } from '@angular/core/testing';

import { FirebaseMessagingService } from './firabase-messaging.service';

describe('FirabaseMessagingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FirebaseMessagingService = TestBed.get(FirebaseMessagingService);
    expect(service).toBeTruthy();
  });
});
