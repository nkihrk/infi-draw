import { TestBed } from '@angular/core/testing';

import { NameInfoService } from './name-info.service';

describe('NameInfoService', () => {
  let service: NameInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NameInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
