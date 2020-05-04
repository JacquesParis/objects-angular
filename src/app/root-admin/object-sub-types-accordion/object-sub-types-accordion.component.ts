import { Component, OnInit, Input } from '@angular/core';
import { extend } from '@uirouter/core';
import { CommonComponentComponent } from '../../common-app/common-component/common-component.component';
import {
  ObjectTypeImpl,
  ObjectSubTypeImpl,
  EntityName,
} from '@jacquesparis/objects-client';
import { ObjectsCommonService } from '../../objects-client/services/objects-common.service';
import { AbstractRestEntityListComponent } from '../../objects-client/abstract-rest-entity/abstract-rest-entity-list.component';

@Component({
  selector: 'app-object-sub-types-accordion',
  templateUrl: './object-sub-types-accordion.component.html',
  styleUrls: ['./object-sub-types-accordion.component.scss'],
})
export class ObjectSubTypesAccordionComponent extends AbstractRestEntityListComponent<
  ObjectSubTypeImpl
> {
  @Input() objectType: ObjectTypeImpl;

  constructor(protected objectsCommonService: ObjectsCommonService) {
    super(
      objectsCommonService,
      EntityName.objectSubType,
      EntityName.objectType
    );
  }

  get objectTypes(): ObjectTypeImpl[] {
    return this.objectsCommonService.objectTypesArray;
  }
}
