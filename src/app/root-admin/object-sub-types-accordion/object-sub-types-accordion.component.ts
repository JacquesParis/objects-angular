import { Component, OnInit, Input } from '@angular/core';
import { extend } from '@uirouter/core';
import { CommonComponentComponent } from '../../common-app/common-component/common-component.component';
import { ObjectTypeImpl } from '@jacquesparis/objects-client';
import { ObjectsCommonService } from '../../objects-client/services/objects-common.service';
import { IObjectSubType } from '@jacquesparis/objects-model';

@Component({
  selector: 'app-object-sub-types-accordion',
  templateUrl: './object-sub-types-accordion.component.html',
  styleUrls: ['./object-sub-types-accordion.component.scss'],
})
export class ObjectSubTypesAccordionComponent extends CommonComponentComponent {
  @Input() objectType: ObjectTypeImpl;

  constructor(protected objectsCommonService: ObjectsCommonService) {
    super();
  }

  get objectTypes(): ObjectTypeImpl[] {
    return this.objectsCommonService.objectTypesArray;
  }
}
