/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { EntityObservationService } from './entity-observation.service';

describe('Service: EntityObservation', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EntityObservationService]
    });
  });

  it('should ...', inject([EntityObservationService], (service: EntityObservationService) => {
    expect(service).toBeTruthy();
  }));
});
