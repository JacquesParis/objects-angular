import { Component, OnInit, Input, ViewChild } from '@angular/core';
import {
  ObjectTypeImpl,
  ObjectsTypeService,
  EntityName,
} from '@jacquesparis/objects-client';
import { IObjectType, IObjectSubType } from '@jacquesparis/objects-model';
import { CommonComponentComponent } from '../../common-app/common-component/common-component.component';
import { ObjectsCommonService } from '../../objects-client/services/objects-common.service';
import {
  EditableFormDirective,
  IJsonSchema,
  IJsonLayoutPorperty,
} from '@jacquesparis/objects-angular-forms';
import * as _ from 'lodash-es';

import { AbstractRestEntityComponent } from '../../objects-client/abstract-rest-entity/abstract-rest-entity.component';

@Component({
  selector: 'app-object-type-card',
  templateUrl: './object-type-card.component.html',
  styleUrls: ['./object-type-card.component.scss'],
})
export class ObjectTypeCardComponent extends AbstractRestEntityComponent<
  IObjectSubType,
  ObjectTypeImpl
> {
  @Input() entity: ObjectTypeImpl;

  constructor(protected objectsCommonService: ObjectsCommonService) {
    super(EntityName.objectType, objectsCommonService);
  }
}
