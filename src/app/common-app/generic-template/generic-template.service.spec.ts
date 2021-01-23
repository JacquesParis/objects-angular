/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GenericTemplateService } from './generic-template.service';

describe('Service: GenericTemplate', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GenericTemplateService]
    });
  });

  it('should ...', inject([GenericTemplateService], (service: GenericTemplateService) => {
    expect(service).toBeTruthy();
  }));
});
