import { Component, OnInit } from '@angular/core';
import { ObjectsCommonService } from '../../objects-client/services/objects-common.service';
import { ObjectTypeImpl, EntityName } from '@jacquesparis/objects-client';
import { AbstractRestEntityListComponent } from '../../objects-client/abstract-rest-entity/abtrsact-rest-entity-list.component';

@Component({
  selector: 'app-object-types-list',
  templateUrl: './object-types-list.component.html',
  styleUrls: ['./object-types-list.component.scss'],
})
export class ObjectTypesListComponent extends AbstractRestEntityListComponent<
  ObjectTypeImpl
> {
  constructor(protected objectsCommonService: ObjectsCommonService) {
    super(objectsCommonService, EntityName.objectType);
  }

  get objectTypes(): ObjectTypeImpl[] {
    return this.objectsCommonService.objectTypesArray;
  }
  /*
  public trackByObjectType(objectType: ObjectTypeImpl) {
    return objectType.id + objectType.name + objectType.type;
  }
*/
}
