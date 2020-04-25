import { Component, OnInit } from '@angular/core';
import { ObjectsCommonService } from '../../objects-client/services/objects-common.service';
import { IDataEntity, IObjectSubType } from '@jacquesparis/objects-model';
import { ObjectTypeImpl } from '@jacquesparis/objects-client';
import { extend } from '@uirouter/core';
import { CommonComponentComponent } from '../../common-app/common-component/common-component.component';

@Component({
  selector: 'app-object-types-list',
  templateUrl: './object-types-list.component.html',
  styleUrls: ['./object-types-list.component.scss'],
})
export class ObjectTypesListComponent extends CommonComponentComponent {
  constructor(protected objectsCommonService: ObjectsCommonService) {
    super();
  }

  get objectTypes(): ObjectTypeImpl[] {
    return this.objectsCommonService.objectTypesArray;
  }

  public trackByObjectType(objectType: ObjectTypeImpl) {
    return objectType.id + objectType.name + objectType.type;
  }
}
