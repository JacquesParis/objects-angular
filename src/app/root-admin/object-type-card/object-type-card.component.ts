import { Component, Input, EventEmitter, Output } from '@angular/core';
import { ObjectTypeImpl, EntityName } from '@jacquesparis/objects-client';
import { IObjectType } from '@jacquesparis/objects-model';
import { ObjectsCommonService } from '../../objects-client/services/objects-common.service';
import * as _ from 'lodash-es';

import { AbstractRestEntityComponent } from '../../objects-client/abstract-rest-entity/abstract-rest-entity.component';

@Component({
  selector: 'app-object-type-card',
  templateUrl: './object-type-card.component.html',
  styleUrls: ['./object-type-card.component.scss'],
})
export class ObjectTypeCardComponent extends AbstractRestEntityComponent<
  IObjectType,
  ObjectTypeImpl
> {
  @Input() entity: ObjectTypeImpl;

  constructor(protected objectsCommonService: ObjectsCommonService) {
    super(EntityName.objectType, objectsCommonService);
  }
}
