import { RestEntityListService } from './../../objects-client/abstract-rest-entity/rest-entity-list.service';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ObjectSubTypeImpl } from '@jacquesparis/objects-client';
import { ObjectsCommonService } from '../../objects-client/services/objects-common.service';
import * as _ from 'lodash-es';
import { AbstractObjectSubTypeComponent } from '../../objects-client/components/abstract-object-sub-type.component';

@Component({
  selector: 'app-object-sub-type-card',
  templateUrl: './object-sub-type-card.component.html',
  styleUrls: ['./object-sub-type-card.component.scss'],
})
export class ObjectSubTypeCardComponent extends AbstractObjectSubTypeComponent {
  @Input() entity: ObjectSubTypeImpl;

  constructor(
    protected objectsCommonService: ObjectsCommonService,
    protected restEntityListService: RestEntityListService
  ) {
    super(objectsCommonService, restEntityListService);
  }
}
