import { TestBed } from '@angular/core/testing';

import { ObjectsCommonService } from './objects-common.service';

describe('ObjectsCommonService', () => {
  let service: ObjectsCommonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObjectsCommonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
