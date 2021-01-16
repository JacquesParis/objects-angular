/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ManagementPageService } from './management-page.service';

describe('Service: ManagementPage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ManagementPageService]
    });
  });

  it('should ...', inject([ManagementPageService], (service: ManagementPageService) => {
    expect(service).toBeTruthy();
  }));
});
