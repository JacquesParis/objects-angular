import { TestBed } from '@angular/core/testing';

import { ObjectNodesListService } from './object-nodes-list.service';

describe('ObjectNodesListService', () => {
  let service: ObjectNodesListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObjectNodesListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
