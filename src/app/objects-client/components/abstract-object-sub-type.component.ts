import { RestEntityListService } from './../abstract-rest-entity/rest-entity-list.service';
import { AbstractRestEntityComponent } from '../abstract-rest-entity/abstract-rest-entity.component';
import { ObjectSubTypeImpl, EntityName } from '@jacquesparis/objects-client';
import { IObjectSubType } from '@jacquesparis/objects-model';
import { ObjectsCommonService } from '../services/objects-common.service';
import { OnInit } from '@angular/core';
import * as _ from 'lodash-es';

export abstract class AbstractObjectSubTypeComponent
  extends AbstractRestEntityComponent<IObjectSubType, ObjectSubTypeImpl>
  implements OnInit {
  entity: ObjectSubTypeImpl;

  constructor(
    protected objectsCommonService: ObjectsCommonService,
    protected restEntityListService: RestEntityListService
  ) {
    super(
      EntityName.objectSubType,
      objectsCommonService,
      restEntityListService
    );
  }
}
