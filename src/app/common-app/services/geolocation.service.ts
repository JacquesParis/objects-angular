import { ObjectsCommonService } from './../../objects-client/services/objects-common.service';
import {
  IEntityObserver,
  EntityObservationService,
} from './entity-observation.service';
import { IMethodValuesResult, IRestEntity } from '@jacquesparis/objects-model';
import {
  EditableFormService,
  IGeolocationService,
  IGeolocationPosition,
} from '@jacquesparis/objects-angular-forms';
import { Injectable } from '@angular/core';
import { RulesLogic } from 'json-logic-js';

const geolocationEntityCondition: RulesLogic = {
  and: [
    { '===': [{ var: 'entityCtx.entityType' }, 'objectTree'] },
    {
      some: [
        { var: 'entityCtx.actions.methods' },
        { '==': [{ var: 'methodId' }, 'geocode'] },
      ],
    },
  ],
};
@Injectable({
  providedIn: 'root',
})
export class GeolocationService
  implements IGeolocationService, IEntityObserver {
  public geolocationEntityId: string;

  constructor(
    private editableFormService: EditableFormService,
    private objectsCommonService: ObjectsCommonService,
    private entityObservationService: EntityObservationService
  ) {
    this.editableFormService.registerGeolocationService(this);
    this.entityObservationService.observeEntity(
      geolocationEntityCondition,
      this
    );
  }
  observe(entity: IRestEntity) {
    this.geolocationEntityId = entity.id;
  }
  hasGeocodeMethod(): boolean {
    return (
      !!this.geolocationEntityId &&
      !!this.objectsCommonService.getObjectTreeById(this.geolocationEntityId)
    );
  }
  async geocode(address: string): Promise<IGeolocationPosition> {
    if (
      !this.geolocationEntityId ||
      !this.objectsCommonService.getObjectTreeById(this.geolocationEntityId)
    ) {
      throw new Error('Method not implemented.');
    }
    return ((await this.objectsCommonService
      .getObjectTreeById(this.geolocationEntityId)
      .runAction('geocode', {
        address: address,
      })) as IMethodValuesResult).jsonResult;
  }
}
