import { IRestEntity } from '@jacquesparis/objects-model';
import { Injectable } from '@angular/core';

import { RulesLogic } from 'json-logic-js';

export interface IEntityObserver {
  observe(entity: IRestEntity);
}

@Injectable({
  providedIn: 'root',
})
export class EntityObservationService {
  public observers: {
    rule: any;
    observer: IEntityObserver;
    options: { once: boolean };
    observed: number;
  }[] = [];
  constructor() {}

  public observeEntity(
    rule: RulesLogic,
    observer: IEntityObserver,
    inputOptions: { once?: boolean } = { once: true }
  ) {
    const options: { once: boolean } = {
      once:
        inputOptions && undefined !== inputOptions.once
          ? inputOptions.once
          : true,
    };
    this.observers.push({ rule, observer, options, observed: 0 });
  }
}
