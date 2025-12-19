import { TestBed } from '@angular/core/testing';

import { Dispatchers } from './dispatchers';

describe('Dispatchers', () => {
  let service: Dispatchers;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Dispatchers);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
