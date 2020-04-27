import { Component, OnInit, Input } from '@angular/core';
import { ObjectSubTypeImpl, EntityName } from '@jacquesparis/objects-client';
import { ObjectsCommonService } from '../../objects-client/services/objects-common.service';
import { CommonComponentComponent } from '../../common-app/common-component/common-component.component';
import { IObjectSubType } from '@jacquesparis/objects-model';
import { AbstractRestEntityComponent } from '../../objects-client/abstract-rest-entity/abstract-rest-entity.component';
import * as _ from 'lodash-es';
import { AbtractObjectSubTypeComponent } from '../../objects-client/components/abtract-object-sub-type.component';

@Component({
  selector: 'app-object-sub-type-card',
  templateUrl: './object-sub-type-card.component.html',
  styleUrls: ['./object-sub-type-card.component.scss'],
})
export class ObjectSubTypeCardComponent extends AbtractObjectSubTypeComponent {
  @Input() entity: ObjectSubTypeImpl;

  constructor(protected objectsCommonService: ObjectsCommonService) {
    super(objectsCommonService);
  }
}
